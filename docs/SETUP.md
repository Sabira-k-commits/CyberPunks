# Setup Instructions

Follow the steps below to set up and run the project locally.

---

## 📦 Requirements
Make sure you have the following installed:

- **Node.js** v18+  
- **npm** or **yarn** (comes with Node.js)  
- **MongoDB** (local or cloud e.g., MongoDB Atlas)  
- **Git**  


---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Sabira-k-commits/CyberPunks.git
cd CyberPunks


### 2. Install dependencies
## Backend (Express API)
```bash
cd src/backend
npm install
⚙️ Environment Setup

Create a .env file in the server directory with the following values:

PORT=5000
MONGO_URI=mongodb://localhost:27017/cyberpunks-db
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
SUPERADMIN_EMAIL=valid_email_for_admin
SUPERADMIN_PASSWORD=strong_password 

Replace MONGO_URI with your MongoDB URI if using MongoDB Atlas.

Use an app password for EMAIL_PASS if using Gmail or other secure email providers.


Frontend (React App)
cd cd src/frontend
npm install


▶️ Running the Project
Start Backend (Express API)
cd src/backend
npm run dev

Start Frontend (React )
cd src/frontend
npm run dev


This will start:

Backend (Express API)

Frontend (React App)

MongoDB instance

And craete an admin user 


