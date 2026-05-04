#!/bin/bash
# ============================================
# BumiCast Project Setup Script
# Run this ONCE after cloning the repo
# ============================================

echo "🌊 Setting up BumiCast project structure..."

# --- AI Module (Carol's zone) ---
mkdir -p ai/data
mkdir -p ai/notebooks
mkdir -p ai/models

# --- Backend (Aisyah's zone) ---
mkdir -p backend

# --- Frontend (Aisyah's zone) ---
mkdir -p frontend

# --- Hardware (Dania's zone) ---
mkdir -p hardware/esp32
mkdir -p hardware/schematics

# --- Docs (Naz's zone) ---
mkdir -p docs/pitch
mkdir -p docs/business

# --- Create .gitignore ---
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.pyc
.env
venv/
.venv/

# Jupyter
.ipynb_checkpoints/

# Large data files (share via Google Drive instead)
*.csv
*.h5
*.pkl
*.hdf5

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Compiled Arduino
hardware/esp32/build/
EOF

# --- Create placeholder README files so Git tracks empty folders ---
echo "# AI Module - Carol's Zone
This folder contains the AI forecasting models and data pipelines.

- \`data/\` — Raw and processed datasets
- \`notebooks/\` — Jupyter notebooks for exploration and training
- \`models/\` — Saved model files (.h5, .pkl)" > ai/README.md

echo "# Backend - Aisyah's Zone
FastAPI server that receives sensor data and serves predictions." > backend/README.md

echo "# Frontend - Aisyah's Zone
Streamlit dashboard for visualizing sensor data and forecasts." > frontend/README.md

echo "# Hardware - Dania's Zone
ESP32 sensor module code and wiring schematics.

- \`esp32/\` — Arduino/ESP32 firmware code
- \`schematics/\` — Circuit diagrams and wiring guides" > hardware/README.md

echo "# Documentation - Naz's Zone
Pitch deck, business model, and project documentation.

- \`pitch/\` — Presentation files
- \`business/\` — Business model canvas, cost analysis" > docs/README.md

# --- Create the main README ---
cat > README.md << 'EOF'
# 🌊 BumiCast

**Crop-stage aware saltwater intrusion forecasting for ASEAN river estuaries.**

> Built for the ASEAN AI Hackathon 2026

## What is BumiCast?

BumiCast predicts saltwater intrusion risk at river estuaries by fusing open climate data with low-cost IoT sensor readings, giving ASEAN governments 7–30 day advance warning to protect freshwater supplies.

## Team

| Name   | Role                        |
|--------|-----------------------------|
| Danny  | Team Lead & System Architect|
| Carol  | AI Lead & Data Pipelines    |
| Aisyah | Backend & Frontend Dev      |
| Dania  | Hardware & IoT Modules      |
| Naz    | Business & Impact Strategy  |

## Project Structure

```
bumicast/
├── ai/          # AI models and data (Carol)
├── backend/     # FastAPI server (Aisyah)
├── frontend/    # Streamlit dashboard (Aisyah)
├── hardware/    # ESP32 sensor code (Dania)
└── docs/        # Pitch & business docs (Naz)
```

## Tech Stack

- **AI**: Python, Prophet, LSTM (TensorFlow/PyTorch)
- **Backend**: FastAPI
- **Frontend**: Streamlit
- **Hardware**: ESP32, DS18B20, TDS sensor, Ultrasonic sensor
- **Data**: NASA PODAAC, ERA5 Reanalysis, Mekong River Commission
EOF

echo ""
echo "✅ BumiCast project structure created!"
echo ""
echo "📁 Folders created:"
echo "   ai/          → Carol"
echo "   backend/     → Aisyah"
echo "   frontend/    → Aisyah"
echo "   hardware/    → Dania"
echo "   docs/        → Naz"
echo ""
echo "📄 Files created:"
echo "   .gitignore   → Keeps junk out of GitHub"
echo "   README.md    → Project description (shows on GitHub homepage)"
echo ""
echo "🚀 Next step: run these commands to push everything to GitHub:"
echo "   git add ."
echo '   git commit -m "setup project structure"'
echo "   git push origin main"
