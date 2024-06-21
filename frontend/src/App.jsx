import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; // Importing the Login component
import Register from "./pages/Register"; // Importing the Register component
import NotFound from "./pages/NotFound"; // Importing the NotFound component
import Home from "./pages/Home"; // Importing the Home component
import ProtectedRoute from "./componets/protectedRoute"; // Importing the ProtectedRoute component

// Logout function component
function Logout() {
  localStorage.clear(); // Clear all items from localStorage
  return <Navigate to="/login" />; // Redirect to the login page
}

// RegisterAndLogout function component
function RegisterAndLogout() {
  localStorage.clear(); // Clear all items from localStorage
  return <Register />; // Render the Register component
}

// Main App component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the home page, protected by ProtectedRoute */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* Route for the login page */}
        <Route path="/login" element={<Login />} />
        {/* Route for the logout page, clears localStorage and redirects to login */}
        <Route path="/logout" element={<Logout />} />
        {/* Route for the register page, clears localStorage before rendering Register component */}
        <Route path="/register" element={<RegisterAndLogout />} />
        {/* Route for handling 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
