# 🗨️ AsyncTalk – Real-Time Messaging Platform

AsyncTalk is a **real-time chat application** built using the **MERN stack** and **Socket.IO**, enabling seamless one-to-one messaging with live user status, instant message delivery, and an integrated **AI-powered chatbot**.  
The project focuses on delivering a smooth, modern, and responsive chat experience.

---

## 🚀 Live Demo
🔗 [View Project](https://asynctalk.onrender.com/)

---

## 🧩 Features

- 💬 **Real-Time Messaging** — One-to-one chat with instant message delivery using Socket.IO.  
- 🧠 **AI Chatbot** — Integrated intelligent bot that responds dynamically to user inputs.  
- 👤 **User Profiles** — Upload profile photos and display live online/offline status.  
- 📱 **Responsive UI** — Optimized design for all screen sizes using Tailwind CSS.  
- 🔒 **Secure Communication** — Authentication and private socket channels for users.  
- ⚡ **Fast & Scalable** — Built using efficient state management and RESTful APIs.

---

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Real-Time Communication:** Socket.IO  
**Database:** MongoDB  
**AI Integration:** OpenAI API (or similar, depending on your setup)  
**Version Control & Deployment:** Git, GitHub, Render

---

## ⚙️ Installation and Setup

Follow these steps to run the project locally:

```bash
# Clone the repository
git clone https://github.com/Sumityadav1811/AsyncTalk.git

# Navigate into the project folder
cd AsyncTalk

# Install dependencies for backend
cd backend
npm install

# Install dependencies for frontend
cd ../frontend
npm install

# Create a .env file in both client and server directories with required variables
# Example:
# MONGO_URI=your_mongo_connection_string
# PORT=5000
# OPENAI_API_KEY=your_api_key

# Run backend and frontend concurrently
npm run dev

