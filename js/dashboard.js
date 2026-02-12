// Inicialización
function initializeDashboard() {
    checkAuth();
    const user = getUser();
    if (user) {
        document.getElementById('userNameNav').textContent = user.username;
        document.getElementById('userRoleBadge').textContent = user.role;
    }

    if (!isAdmin()) {
        const btnListar = document.getElementById('btnListar');
        if (btnListar) btnListar.style.display = 'none';
    }

    const form = document.getElementById('crearPlanetaForm');
    if (form) {
        form.addEventListener('submit', handleCreatePlanet);
    }
}

async function handleCreatePlanet(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const tipo = document.getElementById('tipo').value;

    if (!nombre || !tipo) {
        showAlert('Todos los campos son obligatorios', 'warning');
        return;
    }

    await createPlanet({ nombre, tipo });
}

async function createPlanet(planetaData) {
    try {
        const response = await fetchWithAuth(`${getApiUrl()}/planetas/`, {
            method: 'POST',
            body: JSON.stringify(planetaData)
        });

        if (response && response.ok) {
            const data = await response.json();
            showAlert(`Planeta "${data.nombre}" creado con éxito`, 'success');
            document.getElementById('crearPlanetaForm').reset();
        } else {
            const error = await response.json();
            showAlert(error.detail || 'Error al crear planeta', 'danger');
        }
    } catch (error) {
        showAlert('Error de conexión', 'danger');
    }
}

function showSection(section) {
    document.getElementById('crearSection').style.display = 'none';
    document.getElementById('listarSection').style.display = 'none';
    
    if (section === 'crear') {
        document.getElementById('crearSection').style.display = 'block';
    } else if (section === 'listar') {
        if (!isAdmin()) {
            showAlert('Acceso denegado', 'danger');
            return;
        }
        document.getElementById('listarSection').style.display = 'block';
        loadPlanetas();
    }
}

async function loadPlanetas() {
    try {
        const response = await fetchWithAuth(`${getApiUrl()}/planetas/`);
        if (response && response.ok) {
            const planetas = await response.json();
            displayPlanetas(planetas);
        }
    } catch (error) {
        showAlert('Error al cargar datos', 'danger');
    }
}

function displayPlanetas(planetas) {
    const tbody = document.getElementById('planetasTableBody');
    if (planetas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Vacio</td></tr>';
        return;
    }
    tbody.innerHTML = planetas.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td><span class="badge bg-info">${p.tipo}</span></td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deletePlaneta(${p.id}, '${p.nombre}')">
                    Eliminar
                </button>
            </td>
        </tr>`).join('');
}

async function deletePlaneta(id, nombre) {
    if (!confirm(`¿Eliminar ${nombre}?`)) return;
    try {
        const response = await fetchWithAuth(`${getApiUrl()}/planetas/${id}`, { method: 'DELETE' });
        if (response && response.ok) {
            showAlert('Eliminado', 'success');
            loadPlanetas();
        }
    } catch (error) {
        showAlert('Error al eliminar', 'danger');
    }
}

function showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => { container.innerHTML = ''; }, 3000);
}

// Evitar ejecución en Jest
if (typeof process === 'undefined' || !process.env.JEST_WORKER_ID) {
    initializeDashboard();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        showSection, 
        displayPlanetas, 
        loadPlanetas, 
        deletePlaneta, 
        showAlert, 
        createPlanet,
        handleCreatePlanet
    };
}