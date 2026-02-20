# 🌟 Dynamic Portfolio Website with CMS

A full-stack MERN (MongoDB, Express, React, Node.js) portfolio website with a powerful Admin Content Management System (CMS).

This project allows dynamic content management for a personal portfolio, including posts about, services, resume, blog and contact messages — all controlled from a secure admin panel.

---

## 🚀 Features

### 🌐 Public Website
- Modern Responsive UI
- Dynamic Hero Section
- About Section
- Certifications Section
- Gallery with Lightbox
- Latest Updates
- Contact Form
- Smooth Animations

### 🔐 Admin CMS Panel
- Secure Admin Authentication (JWT)
- Create / Edit / Delete Posts
- Manage Certifications
- Manage Gallery Images
- Cloudinary Image Upload
- View Contact Messages

---

## 🛠 Tech Stack

### Frontend
- React (Create React App)
- React Router
- Axios
- Framer Motion
- Modern CSS Styling

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary Integration

---

## 📁 Project Structure


backend/
└── src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
└── server.js

frontend/
└── src/
├── components/
├── layout/
├── pages/
├── routes/
├── services/
└── theme/


---

## ⚙️ Installation Guide

### 1️⃣ Clone Repository


git clone https://github.com/rabina315/Dynamic-portfolio-website-with-CMS.git


---

### 2️⃣ Backend Setup


cd backend
npm install
npm run dev


Create a `.env` file inside backend folder and add:


PORT=
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=


---

### 3️⃣ Frontend Setup


cd frontend
npm install
npm start


Frontend runs on:

http://localhost:3001


Backend runs on:

http://localhost:8001


---

## 🔐 Admin Routes

- POST `/admin/setup`
- POST `/admin/login`
- GET `/admin/me`

---

## 📌 Future Improvements

- Role-based authentication
- SEO optimization
- Performance improvements
- Production deployment

---

## 👩‍💻 Developed By

Rabina Dahal  
Full Stack MERN Developer