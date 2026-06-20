import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        console.log('API Request - Token from localStorage:', token ? 'Present' : 'Missing')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
            console.log('Authorization header set:', config.headers.Authorization)
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error('Network Error:', error.message)
        } else {
            console.error('API Error:', {
                status: error.response.status,
                message: error.response.data?.message,
                url: error.response.config.url
            })
        }
        return Promise.reject(error)
    }
)

export default api;