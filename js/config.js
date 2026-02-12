// js/config.js - Configuración global y Autenticación

function getApiUrl() {
    // Si el usuario guardó una URL en el login (Configurar API URL), usamos esa.
    const savedUrl = localStorage.getItem('apiUrl');
    if (savedUrl) return savedUrl;

    // Si estamos en localhost (desarrollo), usamos el puerto 8000 del contenedor Docker.
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000';
    }

    // Por defecto retornamos localhost, pero en Vercel se debe configurar manualmente en el login.
    return 'http://localhost:8000';
}

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isAdmin() {
    const user = getUser();
    // Uso de !! para asegurar que el resultado sea estrictamente true o false para los Tests.
    return !!(user && (user.role === 'ADMIN' || user.role === 'admin'));
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function checkAuth() {
    if (!getToken()) {
        window.location.href = 'index.html';
    }
}

async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };
    
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        // Manejo de token expirado o inválido
        if (response.status === 401) {
            logout();
            return null;
        }
        
        return response;
    } catch (error) {
        console.error("Error de red/conexión:", error);
        throw error; // Permite que el catch del dashboard muestre "Error de conexión"
    }
}

// Exportación compatible con el Navegador y con JEST (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        getApiUrl, 
        getToken, 
        getUser, 
        isAdmin, 
        logout, 
        checkAuth, 
        fetchWithAuth 
    };
}