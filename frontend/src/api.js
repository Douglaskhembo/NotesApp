import axios from "axios"; // Importing axios for making HTTP requests
import { ACCESS_TOKEN } from "./constants"; // Importing the constant key used to store the access token in localStorage

// Create an Axios instance with a base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL // Setting the base URL from environment variables
});

// Add a request interceptor to the Axios instance
api.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem(ACCESS_TOKEN);

        // If a token exists, add it to the request headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Return the modified config
        return config;
    },
    (error) => {
        // Handle any errors that occur during request setup
        return Promise.reject(error);
    }
);

// Export the configured Axios instance
export default api;
