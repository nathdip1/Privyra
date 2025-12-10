# Privyra

**Privyra** is a secure, end-to-end encrypted photo transfer platform built as a SaaS application. It allows users to share images privately with others using temporary secure links. The platform ensures that uploaded media remains confidential, even from developers, and provides features like watermarked images, link expiration, and access tracking.

---

## Features

- **Secure Photo Sharing**: Upload images and generate secure links for sharing.
- **Watermarking**: Add optional text watermark to images to protect your content.
- **End-to-End Encryption**: Only the sender and receiver can access the content; not even developers can view it.
- **Link Expiry**: Set an expiration time for each shared image.
- **Access Tracking**: Track how many times an image is viewed.
- **User Authentication**: Login and signup system to manage uploads and stop sharing links anytime.
- **Responsive UI**: Clean and modern interface optimized for both desktop and mobile.
- **Cloud Storage**: Images are stored securely using Cloudinary.
- **Local Development**: Works seamlessly with MongoDB Atlas and local development environments.

---

## Project Structure

##Project Structure##

Privyra/
├── Client/ # Frontend React app
│ ├── public/
│ ├── src/
│ ├── package.json
│ └── .gitignore
│
├── Server/ # Backend Node.js + Express API
│ ├── src/
│ │ ├── config/ # DB and Cloudinary config
│ │ ├── models/ # MongoDB models
│ │ ├── routes/ # API routes
│ │ ├── controllers/ # API controllers
│ │ ├── middlewares/ # Auth, expiry check, rate limiter
│ │ └── utils/ # Helper functions
│ ├── .env # Environment variables
│ └── package.json
└── README.md


---

## Technologies Used

- **Frontend**: React, React Router, Axios, React Dropzone, React Toastify  
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Cloudinary  
- **Authentication**: JWT (JSON Web Tokens)  
- **Deployment**: Ready for deployment to platforms like Vercel, Render, or Heroku  

---

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Privyra

Install dependencies

# For Client
cd Client
npm install

# For Server
cd ../Server
npm install

Configure environment variables
Create a .env file in Server/:

PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Run the application

# Start backend
cd Server
npm run dev

# Start frontend
cd ../Client
npm start

Usage

Signup/Login to create an account.

Upload an image and add optional watermark text.

Copy the secure link and share it with your recipients.

Recipients can open the link to view the image with watermark.

Track image access and stop sharing if needed.

Contact

Developer: AxomAI
Project: Privyra - Secure Photo Transfer SaaS
