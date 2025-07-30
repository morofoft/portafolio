document.getElementById('registroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
    const edad = document.getElementById('edad').value;
    
    // Validar campos
    if (!nombre || !apellido || !sexo || !edad) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor complete todos los campos',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        return;
    }
    
    if (edad < 1 || edad > 120) {
        Swal.fire({
            title: 'Edad inválida',
            text: 'Por favor ingrese una edad válida (1-120)',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
        return;
    }
    
    // Mostrar SweetAlert de confirmación
    Swal.fire({
        title: '¡Registro exitoso!',
        text: 'Los datos se han guardado correctamente',
        icon: 'success',
        confirmButtonText: 'Ver datos'
    }).then(() => {
        // Mostrar los datos en pantalla
        mostrarDatos(nombre, apellido, sexo, edad);
    });
});

function mostrarDatos(nombre, apellido, sexo, edad) {
    const datosUsuario = document.getElementById('datosUsuario');
    datosUsuario.innerHTML = `
        <div class="dato-item">
            <span class="dato-label">Nombre:</span>
            <span class="dato-valor">${nombre}</span>
        </div>
        <div class="dato-item">
            <span class="dato-label">Apellido:</span>
            <span class="dato-valor">${apellido}</span>
        </div>
        <div class="dato-item">
            <span class="dato-label">Sexo:</span>
            <span class="dato-valor">${sexo}</span>
        </div>
        <div class="dato-item">
            <span class="dato-label">Edad:</span>
            <span class="dato-valor">${edad} años</span>
        </div>
    `;
    
    // Mostrar el contenedor de resultados
    document.getElementById('resultado').style.display = 'block';
    
    // Desplazarse suavemente a los resultados
    document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
}