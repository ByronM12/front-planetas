// Verificar autenticación
checkAuth();

// Mostrar información del usuario
const user = getUser();
document.getElementById('userNameNav').textContent = user.username;
document.getElementById('userRoleBadge').textContent = user.role;

// Controlar acceso según rol
if (!isAdmin()) {
    // Usuario normal no puede listar
    const btnListar = document.getElementById('btnListar');
    if (btnListar) {
        btnListar.style.display = 'none';
    }
}

// Funciones de navegación
function showSection(section) {
    document.getElementById('crearSection').style.display = 'none';
    document.getElementById('listarSection').style.display = 'none';
    
    if (section === 'crear') {
        document.getElementById('crearSection').style.display = 'block';
    } else if (section === 'listar') {
        if (!isAdmin()) {
            showAlert('No tienes permisos para listar planetas', 'danger');
            return;
        }
        document.getElementById('listarSection').style.display = 'block';
        loadPlanetas();
    }
}

// Crear planeta
document.getElementById('crearPlanetaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const tipo = document.getElementById('tipo').value;
    
    if (!nombre) {
        showAlert('El nombre es obligatorio', 'warning');
        return;
    }
    
    if (!tipo) {
        showAlert('El tipo es obligatorio', 'warning');
        return;
    }
    
    const planetaData = {
        nombre: nombre,
        tipo: tipo
    };
    
    try {
        const response = await fetchWithAuth(`${getApiUrl()}/planetas/`, {
            method: 'POST',
            body: JSON.stringify(planetaData)
        });
        
        if (!response) return;
        
        if (response.ok) {
            const data = await response.json();
            showAlert(`Planeta "${data.nombre}" creado exitosamente`, 'success');
            document.getElementById('crearPlanetaForm').reset();
        } else if (response.status === 409) {
            const error = await response.json();
            showAlert('Ya existe un planeta con ese nombre', 'danger');
        } else if (response.status === 400) {
            const error = await response.json();
            showAlert('Error en los datos enviados. Verifica los campos.', 'danger');
        } else {
            showAlert('Error al crear el planeta', 'danger');
        }
    } catch (error) {
        showAlert('Error de conexión con el servidor', 'danger');
        console.error('Error:', error);
    }
});

// Cargar planetas (solo ADMIN)
async function loadPlanetas() {
    if (!isAdmin()) {
        showAlert('No tienes permisos para listar planetas', 'danger');
        return;
    }
    
    try {
        const response = await fetchWithAuth(`${getApiUrl()}/planetas/`);
        
        if (!response) return;
        
        if (response.ok) {
            const planetas = await response.json();
            displayPlanetas(planetas);
        } else if (response.status === 403) {
            showAlert('No tienes permisos para listar planetas', 'danger');
        } else {
            showAlert('Error al cargar los planetas', 'danger');
        }
    } catch (error) {
        showAlert('Error de conexión con el servidor', 'danger');
        console.error('Error:', error);
    }
}

// Mostrar planetas en la tabla
function displayPlanetas(planetas) {
    const tbody = document.getElementById('planetasTableBody');
    
    if (planetas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay planetas registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = planetas.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td><span class="badge bg-info">${p.tipo}</span></td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deletePlaneta(${p.id}, '${p.nombre}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Eliminar planeta
async function deletePlaneta(id, nombre) {
    if (!isAdmin()) {
        showAlert('No tienes permisos para eliminar planetas', 'danger');
        return;
    }
    
    if (!confirm(`¿Estás seguro de eliminar el planeta "${nombre}"?`)) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(`${getApiUrl()}/planetas/${id}`, {
            method: 'DELETE'
        });
        
        if (!response) return;
        
        if (response.ok) {
            showAlert(`Planeta "${nombre}" eliminado correctamente`, 'success');
            loadPlanetas();
        } else if (response.status === 403) {
            showAlert('No tienes permisos para eliminar planetas', 'danger');
        } else if (response.status === 404) {
            showAlert('Planeta no encontrado', 'warning');
        } else {
            showAlert('Error al eliminar el planeta', 'danger');
        }
    } catch (error) {
        showAlert('Error de conexión con el servidor', 'danger');
        console.error('Error:', error);
    }
}

// Función para mostrar alertas
function showAlert(message, type) {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.getElementById('alertContainer').innerHTML = alertHtml;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 150);
        }
    }, 5000);
}

// Exportar funciones para pruebas unitarias
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showSection,
        displayPlanetas,
        loadPlanetas,
        deletePlaneta,
        showAlert
    };
}
