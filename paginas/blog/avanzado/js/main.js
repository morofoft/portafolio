document.addEventListener('DOMContentLoaded', function() {
    const blogForm = document.getElementById('blogForm');
    
    if (blogForm) {
        blogForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('postTitle').value;
            const content = document.getElementById('postContent').value;
            
            if (title && content) {
                Swal.fire({
                    title: '¡Post creado!',
                    text: `Título: ${title}`,
                    html: `<p>Tu post ha sido creado exitosamente.</p><hr><p>${content.substring(0, 100)}...</p>`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#012060',
                    backdrop: `
                        rgba(1, 32, 96, 0.4)
                        url("/img/banner.jpg")
                        center top
                        no-repeat
                    `
                }).then((result) => {
                    if (result.isConfirmed) {
                        blogForm.reset();
                    }
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor completa todos los campos',
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#012060'
                });
            }
        });
    }
    
    const categoryLinks = document.querySelectorAll('.categories a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryName = this.textContent;
            
            Swal.fire({
                title: `Categoría: ${categoryName}`,
                text: `Mostrando posts de ${categoryName}`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#012060',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ver posts',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Aquí iría la lógica para filtrar posts
                    Swal.fire(
                        'Redirigiendo...',
                        `Serás llevado a la categoría ${categoryName}, ESTA FUNCION ESTARA DISPONIBLE PRONTO.`,
                        'info'
                        
                    );
                }
            });
        });
    });

});