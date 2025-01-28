async function obtenerDatos() {
    try {
        const response = await fetch('/api/empleados');
        const datos = await response.json();
        const tbody = document.querySelector('#empleadosTable tbody');
        tbody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        datos.forEach(empleado => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${empleado.id}</td>
                <td>${empleado.nombre}</td>
                <td>${empleado.edad}</td>
                <td>${empleado.salario}</td>
                <td>
                    <button onclick="editarEmpleado(${empleado.id})">Editar</button>
                    <button onclick="eliminarEmpleado(${empleado.id})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        mostrarError('Error al obtener los datos.');
    }
}

async function agregarEmpleado(event) {
    event.preventDefault();  // Prevenir que el formulario se recargue automáticamente

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('empleadoNombre').value;
    const edad = parseInt(document.getElementById('empleadoEdad').value);
    const salario = parseFloat(document.getElementById('empleadoSalario').value);

    // Validación básica
    if (!nombre || !edad || !salario || edad <= 0 || salario < 0) {
        return mostrarError('Por favor, complete todos los campos correctamente.');
    }

    try {
        const response = await fetch('/api/empleados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, edad, salario })
        });
        if (!response.ok) throw new Error(await response.text());

        // Limpiar el formulario después de agregar
        document.getElementById('empleadoForm').reset();

        obtenerDatos(); // Recargar la lista de empleados
        mostrarExito('Empleado agregado correctamente.');
    } catch (error) {
        mostrarError(error.message);
    }
}
async function eliminarEmpleado(id) {
    try {
        const response = await fetch(`/api/empleados/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(await response.text());

        obtenerDatos(); // Recargar la lista después de eliminar
        mostrarExito('Empleado eliminado correctamente.');
    } catch (error) {
        mostrarError('Error al eliminar el empleado: ' + error.message);
    }
}





// Llamar a esta función al enviar el formulario
document.getElementById('empleadoForm').addEventListener('submit', agregarEmpleado);

function mostrarError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('successMessage').textContent = '';
}

function mostrarExito(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('errorMessage').textContent = '';
}

// Llamar obtenerDatos cuando la página cargue
window.onload = obtenerDatos;
