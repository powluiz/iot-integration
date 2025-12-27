# IoT Integration - MQTT Dashboard

A demonstrative IoT project, illustrating real-time lamp control and monitoring using the MQTT protocol.

## 📋 About the Project

This project is a **proof of concept (PoC)** developed within the scope of a Postgraduate program. It demonstrates a IoT architecture involving Edge Computing and Cloud/Web interfaces, enabling:

- **Lamp control** via relay with real-time feedback
- **Temperature and humidity monitoring** using DHT11 sensor
- **Web dashboard** for visualization and control

### Structure

| Layer | Technology | Function |
|-------|------------|----------|
| **Edge** | ESP32 | Sensor reading and relay actuation |
| **Fog** | Node-RED | Intermediate processing and flow orchestration |
| **Front** | Next.js + React | Web interface for control and visualization |


## 🎬 Demo

![Demo](assets/demo.gif)


## 🚀 Features

### Web Dashboard
- Real-time MQTT connection status
- Lamp ON/OFF control
- Temperature and Humidity display

### Edge Device (ESP32)
- Telemetry publishing (temperature/humidity) periodically with MQTT
- Command reception for relay control
- Relay state publishing

## 🛠️ Technologies

- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [MQTT.js](https://github.com/mqttjs/MQTT.js) - MQTT client for browser
- [Arduino](https://www.arduino.cc/) - Development framework
- [PubSubClient](https://github.com/knolleary/pubsubclient) - MQTT client
- [ArduinoJson](https://arduinojson.org/) - JSON serialization
- [DHT Sensor Library](https://github.com/adafruit/DHT-sensor-library) - Sensor reading

## 📜 License

This project was developed for **educational and academic demonstration purposes**.