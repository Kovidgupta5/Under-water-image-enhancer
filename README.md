# 🌊 Underwater Image Enhancer & Scene Classifier

An intelligent AI-powered framework for underwater image enhancement and scene validation using Deep Learning (WaterNet neural blending) and Computer Vision.

Developed by **Kovid Gupta** & **Shashank Srivastava**.

---

## 📌 Overview

Underwater photography frequently suffers from severe color casts (dominant blue/green hues), low contrast, and haze caused by the selective absorption and scattering of light in aquatic environments.

This framework introduces a dual-stage solution:
1. **Scene Validation (MobileNetV2):** Validates incoming images to ensure they are from an underwater environment before processing, preventing non-underwater images from color distortion.
2. **Neural Blending (WaterNet):** Synthesizes physical pre-processing representations (White Balancing in LAB space + CLAHE Histogram Equalization) with the raw input using a Convolutional Neural Network confidence head.

---

## ✨ Features

- **🎯 Smart Scene Classifier:** Automatically flags whether an uploaded photo is truly an underwater scene or a standard image.
- **🎨 Color Cast Correction:** Restores suppressed red and warm color spectrums.
- **🔍 Contrast & Texture Recovery:** Reveals hidden details and textures in low-light underwater scenes.
- **⚡ Dual-Engine Architecture:** High-throughput FastAPI (Python / PyTorch / OpenCV) backend paired with a modern React + Vite frontend.
- **🎛️ Interactive Visual Comparison:** Real-time side-by-side and interactive slider comparison of original vs. enhanced images.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Lucide Icons, Modern CSS
- **Backend:** FastAPI, Uvicorn, Python 3
- **Deep Learning & CV:** PyTorch, Torchvision, OpenCV, NumPy, PIL

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- **PyTorch** & CUDA (optional, CPU supported)

### 2. Automatic Launch (Windows)
Simply run the included batch script:
```cmd
start_app.bat
```
This automatically launches both the FastAPI backend and the Vite frontend, opening the application in your browser.

### 3. Manual Launch

#### Backend:
```bash
cd underwater-enhancer-ui/backend
pip install -r requirements.txt
python app.py
```
*Backend runs on `http://localhost:8000`*

#### Frontend:
```bash
cd underwater-enhancer-ui
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 📂 Project Structure

```
├── research_paper_outline.md          # Comprehensive research paper draft & outline
├── README.md                          # Project documentation
└── underwater-enhancer-ui/
    ├── backend/
    │   ├── app.py                     # FastAPI server with WaterNet inference
    │   ├── process_video.py           # Video enhancement processing script
    │   ├── train_classifier.py        # MobileNetV2 training pipeline
    │   ├── underwater_classifier.pth  # Trained scene classifier weights
    │   ├── underwater_restoration_final.pth # Trained WaterNet weights
    │   └── requirements.txt           # Python dependencies
    ├── src/                           # React frontend source code
    │   ├── components/                # UI components (Uploader, Comparison, etc.)
    │   ├── App.jsx                    # Main application logic
    │   └── main.jsx
    ├── start_app.bat                  # One-click Windows starter script
    ├── package.json
    └── vite.config.js
```

---

## 📄 Research & Documentation

A full academic outline is available in [`research_paper_outline.md`](./research_paper_outline.md) detailing the theoretical foundations, related work, neural blending architecture, and experimental validation.
