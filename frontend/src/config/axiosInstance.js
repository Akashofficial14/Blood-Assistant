import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true, // Crucial for sending cookies in cross-origin requests
})

export default axiosInstance