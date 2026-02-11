// Importar las funciones de config.js
const { getApiUrl, getToken, getUser, isAdmin } = require('./config.js');

// Tests para config.js
describe('Config Functions', () => {
  
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  describe('getApiUrl', () => {
    test('debe retornar la URL por defecto si no está en localStorage', () => {
      expect(getApiUrl()).toBe('http://localhost:8000');
    });

    test('debe retornar la URL guardada en localStorage', () => {
      localStorage.setItem('apiUrl', 'http://api.example.com');
      expect(getApiUrl()).toBe('http://api.example.com');
    });
  });

  describe('getToken', () => {
    test('debe retornar null si no hay token', () => {
      expect(getToken()).toBeNull();
    });

    test('debe retornar el token guardado', () => {
      const token = 'test-token-123';
      localStorage.setItem('token', token);
      expect(getToken()).toBe(token);
    });
  });

  describe('getUser', () => {
    test('debe retornar null si no hay usuario', () => {
      expect(getUser()).toBeNull();
    });

    test('debe retornar el usuario parseado', () => {
      const user = { username: 'admin', role: 'ADMIN' };
      localStorage.setItem('user', JSON.stringify(user));
      expect(getUser()).toEqual(user);
    });
  });

  describe('isAdmin', () => {
    test('debe retornar false si no hay usuario', () => {
      expect(isAdmin()).toBe(false);
    });

    test('debe retornar true si el usuario es ADMIN', () => {
      const user = { username: 'admin', role: 'ADMIN' };
      localStorage.setItem('user', JSON.stringify(user));
      expect(isAdmin()).toBe(true);
    });

    test('debe retornar false si el usuario no es ADMIN', () => {
      const user = { username: 'user', role: 'USER' };
      localStorage.setItem('user', JSON.stringify(user));
      expect(isAdmin()).toBe(false);
    });
  });
});
