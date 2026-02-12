// 1. Mockea el módulo `config.js` por completo. Jest reemplazará todas sus
// funciones exportadas con funciones simuladas (mocks).
jest.mock('./config.js', () => ({
    getApiUrl: jest.fn(() => 'http://localhost:8000'),
    getToken: jest.fn(() => 'test-token'),
    getUser: jest.fn(() => ({ username: 'test-user', role: 'USER' })),
    isAdmin: jest.fn(() => true),
    logout: jest.fn(),
    checkAuth: jest.fn(), // Se mockea para evitar que se ejecute la redirección real
    fetchWithAuth: jest.fn(),
}));

// 2. Importa las funciones simuladas para poder controlarlas en los tests.
const config = require('./config.js');
const { isAdmin } = config;

// Asigna los mocks al objeto global para que dashboard.js pueda encontrarlos
Object.assign(global, config);

// 3. Importa las funciones que quieres probar DESPUÉS de mockear las dependencias.
// El código de alto nivel en `dashboard.js` se ejecutará usando los mocks.
const { showSection, displayPlanetas, showAlert } = require('./dashboard.js');

describe('Dashboard Functions', () => {
    let alertContainer, crearSection, listarSection;

    beforeEach(() => {
        // Limpia los mocks antes de cada test para asegurar un estado limpio
        jest.clearAllMocks();

        // Limpiar el DOM antes de cada test
        document.body.innerHTML = `
            <nav>
                <span id="userNameNav"></span>
                <span id="userRoleBadge"></span>
                <button id="btnListar"></button>
            </nav>
            <div id="alertContainer"></div>
            <div id="crearSection" style="display: none;"></div>
            <div id="listarSection" style="display: none;"></div>
            <table>
                <tbody id="planetasTableBody"></tbody>
            </table>
            <form id="crearPlanetaForm">
                <input id="nombre" type="text" value="">
                <select id="tipo"></select>
            </form>
        `;
        alertContainer = document.getElementById('alertContainer');
        crearSection = document.getElementById('crearSection');
        listarSection = document.getElementById('listarSection');
    });

    describe('showSection', () => {
        test('debe mostrar sección crear cuando se llama con "crear"', () => {
            showSection('crear');
            expect(crearSection.style.display).toBe('block');
            expect(listarSection.style.display).toBe('none');
        });

        test('debe mostrar sección listar cuando se llama con "listar" y es Admin', () => {
            isAdmin.mockReturnValue(true);
            showSection('listar');
            expect(listarSection.style.display).toBe('block');
            expect(crearSection.style.display).toBe('none');
        });

        test('debe mostrar alerta cuando intenta listar sin permisos', () => {
            isAdmin.mockReturnValue(false);
            showSection('listar');
            expect(alertContainer.innerHTML).toContain('No tienes permisos');
        });
    });

    describe('displayPlanetas', () => {
        test('debe mostrar mensaje cuando no hay planetas', () => {
            displayPlanetas([]);
            expect(document.getElementById('planetasTableBody').innerHTML).toContain(
                'No hay planetas registrados'
            );
        });

        test('debe mostrar planetas en la tabla', () => {
            const planetas = [
                { id: 1, nombre: 'Tierra', tipo: 'Terrestre' },
                { id: 2, nombre: 'Marte', tipo: 'Rocoso' }
            ];
            displayPlanetas(planetas);
            
            const tbody = document.getElementById('planetasTableBody');
            expect(tbody.innerHTML).toContain('Tierra');
            expect(tbody.innerHTML).toContain('Marte');
            expect(tbody.innerHTML).toContain('Terrestre');
            expect(tbody.innerHTML).toContain('Rocoso');
        });

        test('debe tener botones de eliminar para cada planeta', () => {
            const planetas = [
                { id: 1, nombre: 'Tierra', tipo: 'Terrestre' }
            ];
            displayPlanetas(planetas);
            
            const tbody = document.getElementById('planetasTableBody');
            expect(tbody.innerHTML).toContain('deletePlaneta(1');
        });
    });

    describe('showAlert', () => {
        test('debe crear una alerta con mensaje y tipo', () => {
            showAlert('Test message', 'success');
            const alert = alertContainer.querySelector('.alert');
            
            expect(alert).toBeTruthy();
            expect(alert.textContent).toContain('Test message');
            expect(alert.classList.contains('alert-success')).toBe(true);
        });

        test('debe crear alerta con clase danger', () => {
            showAlert('Error', 'danger');
            const alert = alertContainer.querySelector('.alert');
            
            expect(alert.classList.contains('alert-danger')).toBe(true);
        });

        test('debe tener botón de cerrar', () => {
            showAlert('Test', 'info');
            const closeBtn = alertContainer.querySelector('.btn-close');
            
            expect(closeBtn).toBeTruthy();
        });
    });
});
