# ReservQ - Restaurant Reservation System

ReservQ is a modern web application for managing restaurant reservations, built with React and Node.js. It provides a seamless experience for both customers and restaurant administrators.

## Features

### Frontend Features
- **User Authentication**: Secure login and registration system
- **Reservation Management**: Book, modify, and cancel reservations
- **Admin Dashboard**: Comprehensive management interface for restaurant staff
- **Real-time Updates**: Dynamic reservation status updates
- **Responsive Design**: Works seamlessly across all devices
- **Data Visualization**: Interactive charts and statistics for business insights
- **Modern UI**: Built with Bootstrap and custom animations

### Backend Features
- **RESTful API**: Full-featured API endpoints for all operations
- **User Authentication**: JWT-based authentication system
- **Data Validation**: Input validation and sanitization
- **Error Handling**: Comprehensive error handling and logging
- **Database Management**: Efficient MongoDB operations
- **API Documentation**: Swagger/OpenAPI documentation
- **Security**: Protected routes and data encryption

## Tech Stack

### Frontend
- **Framework**: React 19, React Router DOM
- **Styling**: Bootstrap 5, FontAwesome, Animate.css
- **State Management**: React Context API
- **Charts**: Chart.js, Recharts
- **Animations**: GSAP
- **Form Validation**: Yup
- **UI Components**: React Bootstrap, Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Validation**: Express Validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Set up environment variables:
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Start the backend server:
```bash
cd backend
npm start
```

6. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

## Project Structure

```
frontend/
├── src/
│   ├── Admindashboard/    # Admin interface components
│   ├── Components/        # Reusable UI components
│   ├── Contexts/         # React context providers
│   ├── Pages/            # Main application pages
│   ├── assets/           # Static assets
│   ├── data/             # Data files
│   └── hooks/            # Custom React hooks

backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── validators/      # Input validation
```

## API Documentation

when the backend server is running. It includes:
- All available endpoints
- Request/response formats
- Authentication requirements
- Example requests

## Available Scripts

### Frontend
- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (one-way operation)

### Backend
- `npm start`: Starts the production server
- `npm run dev`: Starts the development server with hot reload
- `npm test`: Runs the test suite
- `npm run lint`: Runs the linter

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
