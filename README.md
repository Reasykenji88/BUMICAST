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
