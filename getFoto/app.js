// Capturar elementos
const video = document.querySelector(".video");
const canvas = document.querySelector(".canvas");
const button = document.querySelector(".start-btn");
const photo = document.querySelector(".photo");

// Configuración de la cámara
const constraints = {
    video: { width: 420, height: 340 },
    audio: false,
};

// Obtener video desde la cámara
const getVideo = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (error) {
        console.error("No se pudo acceder a la cámara: ", error);
    }
};

// Manejo exitoso del stream de la cámara
const handleSuccess = (stream) => {
    video.srcObject = stream;
    video.play();
};

// Tomar foto al hacer clic en el botón
button.addEventListener("click", () => {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // Dibujar la imagen del video en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Convertir el contenido del canvas a una URL de datos
    const data = canvas.toDataURL("image/png");
    // Mostrar la imagen capturada en el elemento <img>
    photo.setAttribute("src", data);
});

// Iniciar el video
getVideo();
