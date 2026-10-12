import cv2
import sys
import time
import numpy as np
from PIL import Image

# Import the existing model and processing logic from your app.py!
try:
    from app import restore_image
except ImportError:
    print("Error: Could not import app.py. Make sure you run this script from inside the 'backend' folder.")
    sys.exit(1)

def process_video(input_path, output_path):
    print(f"Opening video: {input_path}")
    cap = cv2.VideoCapture(input_path)
    
    if not cap.isOpened():
        print("Error: Could not open the video file. Check the path.")
        return

    # Get video properties
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    print(f"Video Properties: {width}x{height} at {fps} FPS")
    print(f"Total Frames to process: {total_frames}")

    # Set up the VideoWriter to save the result
    fourcc = cv2.VideoWriter_fourcc(*'mp4v') # Standard MP4 codec
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    frame_count = 0
    start_time = time.time()

    print("\nStarting enhancement processing...")
    while True:
        ret, frame = cap.read()
        if not ret:
            break # End of video

        frame_count += 1
        
        # 1. OpenCV uses BGR format, but our AI expects RGB (PIL Image)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(frame_rgb)
        
        # 2. Run the AI enhancement (from app.py)
        enhanced_pil = restore_image(pil_img)
        
        # 3. Convert back to OpenCV format to save the video frame
        enhanced_rgb = np.array(enhanced_pil)
        enhanced_bgr = cv2.cvtColor(enhanced_rgb, cv2.COLOR_RGB2BGR)
        
        # 4. Write to the output video
        out.write(enhanced_bgr)
        
        # Print progress every 10 frames
        if frame_count % 10 == 0 or frame_count == total_frames:
            elapsed = time.time() - start_time
            frames_per_sec = frame_count / elapsed
            eta = (total_frames - frame_count) / frames_per_sec if frames_per_sec > 0 else 0
            
            # Print on the same line
            sys.stdout.write(f"\rProcessed: {frame_count}/{total_frames} frames | Speed: {frames_per_sec:.2f} fps | ETA: {eta:.0f} seconds  ")
            sys.stdout.flush()

    cap.release()
    out.release()
    print(f"\n\nDone! Successfully saved enhanced video to: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python process_video.py <input_video.mp4> <output_video.mp4>")
        print("Example: python process_video.py my_dive.mp4 enhanced_dive.mp4")
    else:
        input_vid = sys.argv[1]
        output_vid = sys.argv[2]
        process_video(input_vid, output_vid)
