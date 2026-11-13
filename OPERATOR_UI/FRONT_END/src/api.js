
import axios from "axios";

const api = axios.create({
    // django address
    baseURL: "http://127.0.0.1:8000/api/",

    headers: {
        "Content-Type": "application/json",
    },

    timeout: 15000,
});

export default api;
