document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formularioRegistro');
    
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarFormulario()) {
            // Si la validación es exitosa
            Swal.fire({
                title: '¡Registro exitoso!',
                text: 'Tu cuenta ha sido creada correctamente',
                icon: 'success',
                confirmButtonColor: '#012060'
            }).then(() => {
                formulario.submit(); // Envía el formulario
            });
        }
    });

    function validarFormulario() {
        let isValid = true;
        
        // 1. Validación de Nombre
        const nombre = document.getElementById('nombre');
        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']{3,50}$/;
        if (!nombreRegex.test(nombre.value.trim())) {
            mostrarError('nombreError', 'El nombre debe contener minimo 3 caracteres alfabéticos');
            isValid = false;
        } else {
            limpiarError('nombreError');
        }

        // 2. Validación de Email
        const email = document.getElementById('email');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.value.trim())) {
            mostrarError('emailError', 'Ingresa un correo electrónico válido (ejemplo@dominio.com)');
            isValid = false;
        } else {
            limpiarError('emailError');
        }

        // 3. Validación de Contraseña
        const password = document.getElementById('password');
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password.value)) {
            mostrarError('passwordError', 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula, número y carácter especial');
            isValid = false;
        } else {
            limpiarError('passwordError');
        }

        // 4. Validación de Confirmación de Contraseña
        const confirmPassword = document.getElementById('confirmPassword');
        if (password.value !== confirmPassword.value) {
            mostrarError('confirmPasswordError', 'Las contraseñas no coinciden');
            isValid = false;
        } else {
            limpiarError('confirmPasswordError');
        }

        // 5. Validación de Fecha de Nacimiento
        const fechaNacimiento = document.getElementById('fechaNacimiento');
        if (!fechaNacimiento.value || !validarMayoriaEdad(fechaNacimiento.value)) {
            mostrarError('fechaError', 'Debes ser mayor de 18 años para registrarte');
            isValid = false;
        } else {
            limpiarError('fechaError');
        }

        // 6. Validación de Términos y Condiciones
        const terminos = document.getElementById('terminos');
        if (!terminos.checked) {
            mostrarError('terminosError', 'Debes aceptar los términos y condiciones');
            isValid = false;
        } else {
            limpiarError('terminosError');
        }

        // Mostrar todos los errores juntos si hay varios
        if (!isValid) {
            Swal.fire({
                title: 'Error en el formulario',
                text: 'Por favor corrige los errores marcados',
                icon: 'error',
                confirmButtonColor: '#012060'
            });
        }

        return isValid;
    }

    // Función para validar mayoría de edad (18+ años)
    function validarMayoriaEdad(fecha) {
        const fechaNac = new Date(fecha);
        const hoy = new Date();
        const edadMinima = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
        return fechaNac <= edadMinima;
    }

    // Función para mostrar errores
    function mostrarError(elementId, mensaje) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = mensaje;
        errorElement.style.display = 'block';
        errorElement.style.width = '100%';
        errorElement.style.color = '#dc3545';
    }

    // Función para limpiar errores
    function limpiarError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    // Validación en tiempo real para mejor UX
    document.getElementById('nombre').addEventListener('input', function() {
        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']{3,50}$/;
        if (nombreRegex.test(this.value.trim())) {
            limpiarError('nombreError');
        }
    });

    document.getElementById('email').addEventListener('input', function() {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(this.value.trim())) {
            limpiarError('emailError');
        }
    });

    document.getElementById('password').addEventListener('input', function() {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (passwordRegex.test(this.value)) {
            limpiarError('passwordError');
        }
    });
});