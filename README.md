# Online Learning Platform

This project is an online learning platform with user authentication, course management, student management, and enrollment management functionalities. It is built using Node.js, Next.js, Bootstrap, Google Firestore, JWT, and Swagger.

## Table of Contents
- Project Overview
- Technologies Used
- Installation
- Environment Variables
- Running the Application
- API Documentation
- Features
- Project Structure
- Contributing
- License

## Project Overview
This platform enables users to register, login, and access various courses. Admins can manage courses and students, while students can enroll in courses. The backend is built with Node.js and Firestore, and the frontend uses Next.js and Bootstrap for responsive design. JWT-based authentication secures the API.

## Technologies Used
- **Frontend:** Next.js, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** Google Firestore
- **Authentication:** JWT (JSON Web Token)
- **API Documentation:** Swagger
- **Version Control:** Git

## Installation
1. Clone the repository:
git clone https://github.com/your-username/online-learning-platform.git

2. Navigate to the project directory:
cd online-learning-platform

3. Install dependencies:
npm install

4. ## Environment Variables
   Create a `.env` file in the root of the project to configure environment variables:

  
FIREBASE_API_KEY=your_firebase_api_key

FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain

FIREBASE_PROJECT_ID=your_firebase_project_id

FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket

FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id

FIREBASE_APP_ID=your_firebase_app_id

JWT_SECRET=your_jwt_secret


These variables are necessary for Firebase and JWT authentication.

## Running the Application
### Backend (Node.js)
Start the server:
npm run server
The backend server will start at `http://localhost:5000`.

### Frontend (Next.js)
Run the Next.js development server:
npm run dev
Access the frontend at `http://localhost:3001`.

## API Documentation
The API is documented using Swagger. To view the API documentation, navigate to:
http://localhost:5000/api-docs


Here, you can explore and test all available endpoints.
## Features
- **User Authentication:**
  - Register/Login with JWT-based authentication.
  - Role-based access control (Admin and Student).
- **Course Management (Admin):**
  - Add, update, delete courses.
  - View all courses.
- **Student Management (Admin):**
  - Add, update, delete students.
  - View all students.
- **Enrollment (Students):**
  - Enroll in a course.
  - View enrolled courses.
- **Responsive Design:** Built using Bootstrap for mobile-first, responsive web design.

## Project Structure

├── backend/

│   ├── controllers/

│   ├── middlewares/

│   ├── models/

│   ├── routes/

├── swagger.yaml

└── server.js

├── frontend/

│   ├── components/

│   ├── pages/

│   └── styles/

├── .env

├── README.md

├── package.json

- **api/:** Contains all the backend-related files such as controllers, middlewares, models, and routes.
- **client/:** Contains all the frontend components, pages, and styles.
- **server.js:** The main entry point for the backend server.
- **swagger.yaml:** Swagger configuration for API documentation.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any bugs or feature requests.

## License
This project is licensed under the MIT License.

This README.md provides a detailed overview of the project, instructions for installation, usage, and contributions, along with a clear breakdown of the tech stack and folder structure. Customize it as per your project details before adding it to GitHub.
