import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
import os

# --- Configuration ---
DATA_DIR = 'dataset' # Folder containing 'underwater' and 'normal' subfolders
MODEL_SAVE_PATH = 'underwater_classifier.pth'
BATCH_SIZE = 16
NUM_EPOCHS = 5
LEARNING_RATE = 0.001
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def train_model():
    if not os.path.exists(DATA_DIR):
        print(f"Error: Directory '{DATA_DIR}' not found.")
        print("Please create a folder named 'dataset' with two subfolders inside:")
        print("  - dataset/underwater (put underwater images here)")
        print("  - dataset/normal     (put normal images here)")
        return

    # 1. Data Transforms (Resize, Normalize)
    data_transforms = {
        'train': transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
    }

    # 2. Load Dataset
    print("Loading dataset...")
    full_dataset = datasets.ImageFolder(os.path.join(DATA_DIR), data_transforms['train'])
    dataloader = DataLoader(full_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
    
    class_names = full_dataset.classes
    print(f"Classes found: {class_names} (0: {class_names[0]}, 1: {class_names[1]})")

    # 3. Define Model (Using a lightweight pre-trained MobileNetV2)
    print("Loading MobileNetV2...")
    model = models.mobilenet_v2(pretrained=True)
    
    # Freeze earlier layers to speed up training
    for param in model.parameters():
        param.requires_grad = False
        
    # Replace the final classification layer for 2 classes
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_ftrs, 2)
    model = model.to(DEVICE)

    # 4. Loss and Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=LEARNING_RATE)

    # 5. Training Loop
    print(f"Starting training on {DEVICE}...")
    for epoch in range(NUM_EPOCHS):
        model.train()
        running_loss = 0.0
        running_corrects = 0

        for inputs, labels in dataloader:
            inputs = inputs.to(DEVICE)
            labels = labels.to(DEVICE)

            optimizer.zero_grad()

            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            loss = criterion(outputs, labels)

            loss.backward()
            optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data)

        epoch_loss = running_loss / len(full_dataset)
        epoch_acc = running_corrects.double() / len(full_dataset)
        print(f"Epoch {epoch+1}/{NUM_EPOCHS} - Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}")

    # 6. Save the Model
    torch.save(model.state_dict(), MODEL_SAVE_PATH)
    print(f"\nTraining complete! Model saved to {MODEL_SAVE_PATH}")
    print(f"IMPORTANT: Make a note of which class is 0 and which is 1:")
    for i, name in enumerate(class_names):
        print(f"  Class {i}: {name}")

if __name__ == '__main__':
    train_model()
