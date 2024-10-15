function notificacion(tipo = "success", mensaje = "Todo ok") {
    const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: tipo,
        title: mensaje
    });
}

function cargarDatos() {
    const jugadores = JSON.parse(localStorage.getItem('jugadores')) || [];
    jugadores.forEach(jugador => {
        if (!jugador.historial) {
            jugador.historial = [];
        }
    });
    return jugadores;
}

function guardarDatos(jugadores) {
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
}

async function registrarJugador() {
    const { value: nombre } = await Swal.fire({
        title: 'Registrar Jugador',
        input: 'text',
        inputLabel: 'Nombre del Jugador',
        inputPlaceholder: 'Ingresa el nombre',
        showCancelButton: true,
        confirmButtonText: 'Registrar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return '¡Por favor ingresa un nombre!';
            }
        }
    });

    if (nombre) {
        const jugadores = cargarDatos();
        if (jugadores.find(jugador => jugador.nombre === nombre)) {
            notificacion("error", "El jugador ya está registrado.");
            return;
        }
        jugadores.push({ nombre, deuda: 0, historial: [] });
        guardarDatos(jugadores);
        notificacion("success", "Jugador registrado con éxito.");
        actualizarInterfaz();
    }
}

function actualizarInterfaz() {
    const jugadores = cargarDatos();
    const jugadorSelect = document.getElementById('jugadorSelect');
    const jugadorAbonoSelect = document.getElementById('jugadorAbonoSelect');
    const jugadorHistorialSelect = document.getElementById('jugadorHistorialSelect');
    const listaDeudas = document.getElementById('listaDeudas');

    jugadorSelect.innerHTML = '';
    jugadorAbonoSelect.innerHTML = '';
    jugadorHistorialSelect.innerHTML = '';
    listaDeudas.innerHTML = '';

    jugadores.forEach((jugador, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = jugador.nombre;
        jugadorSelect.appendChild(option);

        const optionAbono = document.createElement('option');
        optionAbono.value = index;
        optionAbono.textContent = jugador.nombre;
        jugadorAbonoSelect.appendChild(optionAbono);

        const optionHistorial = document.createElement('option');
        optionHistorial.value = index;
        optionHistorial.textContent = jugador.nombre;
        jugadorHistorialSelect.appendChild(optionHistorial);

        const li = document.createElement('li');
        li.textContent = `${jugador.nombre}: Deuda $${jugador.deuda.toFixed(2)}`;
        listaDeudas.appendChild(li);
    });

    mostrarHistorial(); // Actualiza el historial al cambiar los jugadores
}

function prestarDinero() {
    const jugadorIndex = document.getElementById('jugadorSelect').value;
    const monto = parseFloat(document.getElementById('montoPrestamo').value);

    if (isNaN(monto) || monto <= 0) {
        notificacion("error", "Por favor, ingresa un monto válido");
        return;
    }

    const jugadores = cargarDatos();
    const interes = monto * 0.20;
    const totalPrestamo = monto + interes;

    jugadores[jugadorIndex].deuda += totalPrestamo;

    jugadores[jugadorIndex].historial.push({
        tipo: 'Préstamo',
        monto: totalPrestamo,
        fecha: new Date().toLocaleString()
    });

    guardarDatos(jugadores);
    notificacion("success", `Se prestó $${totalPrestamo.toFixed(2)} a ${jugadores[jugadorIndex].nombre}`);
    actualizarInterfaz();
}

function agregarAbono() {
    const jugadorIndex = document.getElementById('jugadorAbonoSelect').value;
    const monto = parseFloat(document.getElementById('montoAbono').value);

    if (isNaN(monto) || monto <= 0) {
        notificacion("error", "Por favor, ingresa un monto válido");
        return;
    }

    const jugadores = cargarDatos();
    if (monto > jugadores[jugadorIndex].deuda) {
        notificacion("error", "El abono no puede ser mayor que la deuda actual");
        return;
    }

    jugadores[jugadorIndex].deuda -= monto;

    jugadores[jugadorIndex].historial.push({
        tipo: 'Abono',
        monto: monto,
        fecha: new Date().toLocaleString()
    });

    guardarDatos(jugadores);
    notificacion("success", `Se abonó $${monto.toFixed(2)} a ${jugadores[jugadorIndex].nombre}`);
    actualizarInterfaz();
}

function mostrarHistorial() {
    const jugadorIndex = document.getElementById('jugadorHistorialSelect').value;
    const jugadores = cargarDatos();
    const listaHistorial = document.getElementById('listaHistorial');

    listaHistorial.innerHTML = '';

    if (jugadores[jugadorIndex] && jugadores[jugadorIndex].historial.length > 0) {
        jugadores[jugadorIndex].historial.forEach(transaccion => {
            const li = document.createElement('li');
            li.textContent = `${transaccion.fecha} - ${transaccion.tipo}: $${transaccion.monto.toFixed(2)}`;
            listaHistorial.appendChild(li);
        });
    }
}

function limpiarTodo() {
Swal.fire({
title: '¿Qué deseas hacer?',
text: "Elige una opción:",
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#007bff',
cancelButtonColor: '#d33',
confirmButtonText: 'Eliminar todos los datos',
cancelButtonText: 'Limpiar solo los inputs'
}).then((result) => {
if (result.isConfirmed) {
    // Eliminar todos los datos
    localStorage.removeItem('jugadores');
    actualizarInterfaz();
    notificacion("success", "Todos los datos han sido eliminados.");
} else if (result.isDismissed) {
    // Limpiar solo los inputs
    document.getElementById('montoPrestamo').value = '';
    document.getElementById('montoAbono').value = '';
    notificacion("info", "Los campos de entrada han sido limpiados.");
}
});
}


// Inicializar la aplicación
actualizarInterfaz();
document.getElementById('jugadorHistorialSelect').addEventListener('change', mostrarHistorial);