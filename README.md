
# 🖥️ TIPS – Touch Interactive Projection System

> **TIPS** is a gesture-controlled, touch-interactive projection system that combines **computer vision**, **screen sharing**, and **infrared + fingertip tracking** to create a futuristic and intuitive digital interface.
---

## 🧠 Project Idea

TIPS transforms any **flat surface** into an interactive touchscreen using a **projector** and a **camera**. A user can share their screen in real-time and interact with it using gestures, thanks to:

* **Finger tracking** using MediaPipe
* **IR light detection** for accurate touch
* **Screen mirroring** via WebSockets

Whether it’s a presentation, a smart classroom, or an interactive kiosk — **TIPS** lets you control content using your fingers, just like a touchscreen!

---

## 🏆 Achievements

🥉 **Winner** of **Innovators hub** – *Featured for innovation in real-time interaction systems.*

---

## 📁 Project Structure

```
tips-project/
├── backend/
│   └── server.js              # Socket.IO backend for screen sharing
├── frontend/
│   └── src/components/
│       ├── ScreenShare.jsx    # Captures and emits screen frames
│       ├── ScreenView.jsx     # Receives and renders screen frames
│       └── App.js             # Root React component
├── tips.py                    # Python script for IR + fingertip gesture detection
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

---

## 🔧 Technologies Used

### 💻 Frontend

* **React.js** (with hooks)
* **Socket.IO Client**
* **Web APIs** (`getDisplayMedia`)

### 🌐 Backend

* **Node.js**
* **Express.js**
* **Socket.IO**

### 🧠 Python & CV

* **OpenCV** – for image processing
* **MediaPipe** – for hand & finger detection
* **NumPy**

---

## ⚙️ How It Works

### 📡 Real-Time Screen Sharing

* The presenter starts screen sharing from the React app.
* Screen frames are captured as images and sent to the backend using Socket.IO.
* Other connected clients receive and display those frames in real-time.

### 🖐️ Gesture-Based Interaction

* A Python script runs on the projector's side, which has a **rear camera**.
* This script:

  * Detects **IR grid points**.
  * Recognizes **fingertip gestures** (using MediaPipe).
  * Maps finger location to on-screen controls like buttons.
  * Prints feedback like `Button 1 Clicked` when a gesture is detected in a certain area.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/tips-project.git
cd tips-project
```

---

### 2. 🔌 Start the Backend (Node.js)

```bash
cd backend
npm install
node server.js
```

> Make sure `server.js` allows CORS and listens to the correct port.

---

### 3. 💻 Start the Frontend (React)

```bash
cd frontend
npm install
npm start
```

Open `ScreenShare.jsx` or `ScreenView.jsx` as required.

---

### 4. 🧠 Run Gesture Control (Python)

```bash
pip install -r requirements.txt
python tips.py
```

Ensure a camera is connected and an IR light grid is visible on the surface for accurate fingertip detection.

---

## 📄 `requirements.txt`

```txt
opencv-python==4.9.0.80
mediapipe==0.10.9
numpy==1.26.4
```

---

## 🙌 Future Scope

* Click-and-drag gestures
* Multi-finger interactions
* Remote control from mobile
* Integration with IoT devices

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---
