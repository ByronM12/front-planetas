// Configuración global
function getApiUrl() {
    return localStorage.getItem('apiUrl') || 'http://localhost:8000';
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
    // Forzamos que siempre devuelva true o false (booleano)
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
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            logout();
            return null;
        }
        return response;
    } catch (error) {
        console.error("Error en fetchWithAuth:", error);
        throw error;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getApiUrl, getToken, getUser, isAdmin, logout, checkAuth, fetchWithAuth };
}