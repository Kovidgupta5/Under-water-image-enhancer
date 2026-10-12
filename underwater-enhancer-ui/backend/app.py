import io
import os
import torch
import torch.nn as nn
from torchvision import transforms
import numpy as np
import cv2
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response, JSONResponse
import uvicorn
from torchvision import models

app = FastAPI()

# --- 1. Model Architecture ---
class WaterNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.feature_extractor = nn.Sequential(
            nn.Conv2d(9, 64, kernel_size=3, padding=1),
            nn.PReLU(),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.PReLU(),
            nn.Conv2d(128, 128, kernel_size=3, padding=1),
            nn.PReLU(),
            nn.Conv2d(128, 64, kernel_size=3, padding=1),
            nn.PReLU()
        )
        self.confidence_head = nn.Sequential(
            nn.Conv2d(64, 3, kernel_size=3, padding=1),
            nn.Softmax(dim=1)
        )

    def forward(self, raw, wb, he):
        x = torch.cat([raw, wb, he], dim=1)
        features = self.feature_extractor(x)
        weights = self.confidence_head(features)
        w1, w2, w3 = weights[:, 0:1, :, :], weights[:, 1:2, :, :], weights[:, 2:3, :, :]
        return (raw * w1) + (wb * w2) + (he * w3)

# --- 2. On-the-Fly Pre-processing ---
def apply_white_balance(img_rgb_np):
    # Convert RGB to BGR for OpenCV
    bgr = cv2.cvtColor(img_rgb_np, cv2.COLOR_RGB2BGR)
    
    # Exactly as in prepare_data.py
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    l, a, b = cv2.split(lab)
    a = a - ((np.mean(a) - 128) * (l / 255.0) * 1.1)
    b = b - ((np.mean(b) - 128) * (l / 255.0) * 1.1)
    wb_bgr = cv2.cvtColor(cv2.merge([l, np.clip(a, 0, 255), np.clip(b, 0, 255)]).astype(np.uint8), cv2.COLOR_LAB2BGR)
    
    # Convert back to RGB for PIL/PyTorch
    return cv2.cvtColor(wb_bgr, cv2.COLOR_BGR2RGB)

def apply_histogram_equalization(img_rgb_np):
    # Convert RGB to BGR for OpenCV
    bgr = cv2.cvtColor(img_rgb_np, cv2.COLOR_RGB2BGR)
    
    # Exactly as in prepare_data.py
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    l, a, b = cv2.split(lab)
    a = a - ((np.mean(a) - 128) * (l / 255.0) * 1.1)
    b = b - ((np.mean(b) - 128) * (l / 255.0) * 1.1)
    
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    l_he = clahe.apply(l.astype(np.uint8))
    he_bgr = cv2.cvtColor(cv2.merge([l_he, np.clip(a, 0, 255).astype(np.uint8), np.clip(b, 0, 255).astype(np.uint8)]), cv2.COLOR_LAB2BGR)
    
    # Convert back to RGB
    return cv2.cvtColor(he_bgr, cv2.COLOR_BGR2RGB)

# --- 3. Load Model ---
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = WaterNet().to(DEVICE)

model_path = os.path.join(os.path.dirname(__file__), "underwater_restoration_final.pth")
if not os.path.exists(model_path):
    model_path = "c:/Users/kovid/Downloads/underwater_restoration_final.pth"
if not os.path.exists(model_path):
    print(f"Warning: Model not found at {model_path}. Trying K drive...")
    model_path = "K:/underwater_project/checkpoints/underwater_restoration_final.pth"

try:
    model.load_state_dict(torch.load(model_path, map_location=DEVICE))
    model.eval()
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

# --- 3.5. Load Classifier Model ---
CLASSIFIER_DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
classifier = models.mobilenet_v2(weights=None)
num_ftrs = classifier.classifier[1].in_features
classifier.classifier[1] = nn.Linear(num_ftrs, 2)

classifier_path = os.path.join(os.path.dirname(__file__), "underwater_classifier.pth")
if os.path.exists(classifier_path):
    try:
        classifier.load_state_dict(torch.load(classifier_path, map_location=CLASSIFIER_DEVICE))
        classifier = classifier.to(CLASSIFIER_DEVICE)
        classifier.eval()
        print("Classifier loaded successfully!")
    except Exception as e:
        print(f"Error loading classifier: {e}")
else:
    print(f"Warning: Classifier not found at {classifier_path}")

def is_underwater(image: Image.Image) -> bool:
    # Resize and normalize just like in training
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    input_tensor = preprocess(image).unsqueeze(0).to(CLASSIFIER_DEVICE)
    
    with torch.no_grad():
        output = classifier(input_tensor)
        _, predicted = torch.max(output, 1)
        
    # Assuming 'normal' is 0 and 'underwater' is 1 based on alphabetical folder names
    return predicted.item() == 1

# --- 4. Processing Pipeline ---
def restore_image(image: Image.Image) -> Image.Image:
    # We DO NOT resize the image down to 512x512 anymore. 
    # We process it at full native resolution to preserve crystal clear textures!
    raw_np = np.array(image)
    
    wb_np = apply_white_balance(raw_np)
    he_np = apply_histogram_equalization(raw_np)
    
    raw_t = transforms.ToTensor()(image).unsqueeze(0).to(DEVICE)
    wb_t = transforms.ToTensor()(Image.fromarray(wb_np)).unsqueeze(0).to(DEVICE)
    he_t = transforms.ToTensor()(Image.fromarray(he_np)).unsqueeze(0).to(DEVICE)
    
    with torch.no_grad():
        restored_t = model(raw_t, wb_t, he_t)
        
    restored_t = torch.clamp(restored_t, 0.0, 1.0)
    
    # --- 1. SMART RED CLAMP ---
    red_channel = restored_t[:, 0, :, :]
    green_channel = restored_t[:, 1, :, :]
    restored_t[:, 0, :, :] = torch.minimum(red_channel, green_channel * 1.35)
    
    # --- 2. GENTLE SHADOW LIFT ---
    restored_t = restored_t ** 0.85
    
    restored_pil = transforms.ToPILImage()(restored_t.squeeze(0).cpu())
    
    return restored_pil

@app.post("/api/enhance")
async def enhance_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # Check if it's underwater FIRST
    if not is_underwater(image):
        return JSONResponse(status_code=400, content={"error": "The uploaded image does not appear to be an underwater scene."})
    
    # Process
    restored_image = restore_image(image)
    
    # Save to bytes
    img_byte_arr = io.BytesIO()
    restored_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return Response(content=img_byte_arr.getvalue(), media_type="image/png")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
