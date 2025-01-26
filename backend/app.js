require('dotenv').config(); // Load environment variables

const express = require('express');
const admin = require('./lib/firebaseAdmin'); // Ensure this is the correct path
const { swaggerUi, swaggerSpec } = require('./swagger'); // Swagger config file
const courseRoutes = require('./routes/courseRoutes'); // Import the course routes
const studentRoutes = require('./routes/studentRoutes');

const app = express();

const cors = require('cors');
app.use(cors());

// Middleware (if needed)
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Online Learning Platform API');
});

// Course routes
app.use('/api/courses', courseRoutes);

app.use('/api/students', studentRoutes);



// Listen to the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs are available at http://localhost:${PORT}/api-docs`);
});
