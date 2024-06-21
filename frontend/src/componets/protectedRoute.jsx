import { Navigate } from "react-router-dom"; // Importing Navigate for redirecting users
import {jwtDecode} from "jwt-decode"; // Importing jwtDecode for decoding JWT tokens
import api from "../api"; // Importing the configured Axios instance
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"; // Importing token keys from constants
import { useEffect, useState } from "react"; // Importing React hooks

function ProtectedRoute({ children }) { // ProtectedRoute component to protect routes
    const [isAuthorized, setIsAuthorized] = useState(null); // State to track if the user is authorized

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false)); // Call auth function on component mount
    }, []);

    // Function to refresh the access token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN); // Get the refresh token from localStorage
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access); // Save new access token to localStorage
                setIsAuthorized(true); // Set isAuthorized to true
            } else {
                setIsAuthorized(false); // Set isAuthorized to false if response status is not 200
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false); // Set isAuthorized to false if there is an error
        }
    };

    // Function to check if the user is authenticated
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN); // Get the access token from localStorage
        if (!token) {
            setIsAuthorized(false); // Set isAuthorized to false if no token is found
            return;
        }
        const decoded = jwtDecode(token); // Decode the token to get its payload
        const tokenExpiration = decoded.exp; // Get the token expiration time
        const now = Date.now() / 1000; // Get the current time in seconds

        if (tokenExpiration < now) {
            await refreshToken(); // Refresh the token if it is expired
        } else {
            setIsAuthorized(true); // Set isAuthorized to true if the token is still valid
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>; // Show loading state while checking authorization
    }

    return isAuthorized ? children : <Navigate to="/login" />; // Render children if authorized, otherwise redirect to login
}

export default ProtectedRoute;
