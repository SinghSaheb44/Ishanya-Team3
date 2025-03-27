# **Ishanya Foundation Management System**

## **Overview**

The **Ishanya Foundation Management System** is a web-based platform designed to streamline the management of students, educators, and sessions for the NGO. It provides an **admin portal** for managing data and a **homepage** where visitors can view basic details of students and educators.

## **Features**

### **Admin Login & Portal**
- Secure login system for administrators to manage data.

### **Student & Educator Management**
- View basic details on the homepage.
- Add, edit, and view student and educator information.

### **Session Management**
- Admin can schedule, modify, and manage sessions.

### **Database**
- All data is stored securely using **MongoDB Atlas**.

## **Tech Stack**

### **Frontend**
- **React.js**: Used for building the user interface.
- **Tailwind CSS / Material UI (optional)**: For styling and better UI components.

### **Backend**
- **FastAPI**: Handles API requests, authentication, and data processing.
- **MongoDB Atlas**: NoSQL database for storing NGO data.

## **Installation & Setup**

### **Prerequisites**
Ensure you have the following installed:
- **Node.js (v16 or later)**
- **Python (3.8 or later)**
- **MongoDB Atlas account and connection string**

### **Backend Setup (FastAPI)**

Clone the repository:
```sh
git clone https://github.com/SinghSaheb44/Ishanya-Team3.git
cd Ishanya-Team3/backend
```

Create a virtual environment and activate it:
```sh
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

Install dependencies:
```sh
pip install -r requirements.txt
```

Set up environment variables:
Create a **.env** file in the backend directory and add:
```sh
MONGODB_URI=mongodb+srv://sahebdeepsingh44:RsA1NWrXJSaQLjZE@cluster0.rwfm2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
SECRET_KEY=<your-secret-key>
```

Run the FastAPI server:
```sh
uvicorn main:app --reload
```

The API will be available at **http://127.0.0.1:8000**

### **Frontend Setup (React.js)**

Navigate to the frontend directory:
```sh
cd ../frontend
```

Install dependencies:
```sh
npm install
```

Configure environment variables:
Create a **.env** file in frontend with:
```sh
REACT_APP_API_URL=http://127.0.0.1:8000
```

Run the React development server:
```sh
npm start
```

The frontend will be available at **http://localhost:3000**



## **Future Enhancements**
- Implement **role-based access** for different users.
- Improve **UI/UX** for a better user experience.
- Add **analytics dashboard** for NGO performance insights.

## **Contributors**
- **Sahebdeep Singh Kukreja** - 
- **Anders Arnold** 
- **Dheeraj Siripurapu**
- **Dev Meerchandani**
- **Swati Chavan**

## **Mentors**
- **Harman Gupta**  
- **Chetan Jain**


## **License**
This project is licensed under the **MIT License**.

## **Contact**
For queries, reach out at **sahebdeepsingh44@gmail.com**.

