document.addEventListener('DOMContentLoaded', function() {
  // ========== MENÚ HAMBURGUESA ==========
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  
  menuToggle.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('active');
    this.innerHTML = isExpanded 
      ? '<i class="fas fa-bars"></i>' 
      : '<i class="fas fa-times"></i>';
  });

  // ========== FILTRADO DE PROYECTOS ==========
  const filterButtons = document.querySelectorAll('.modBtns button');
  const projects = document.querySelectorAll('.proyecto');
  
  function filterProjects(category) {
    projects.forEach(project => {
      const shouldShow = category === 'todos' || 
                        project.classList.contains(category);
      
      project.style.display = shouldShow ? 'flex' : 'none';
      project.setAttribute('aria-hidden', !shouldShow);
    });
  }
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Actualizar estado activo
      filterButtons.forEach(btn => {
        btn.classList.remove('activo');
        btn.setAttribute('aria-selected', 'false');
      });
      
      this.classList.add('activo');
      this.setAttribute('aria-selected', 'true');
      
      // Filtrar proyectos
      const category = this.dataset.show;
      filterProjects(category);
      
      // Guardar preferencia
      localStorage.setItem('projectFilter', category);
    });
  });
  
  // Cargar filtro guardado
  const savedFilter = localStorage.getItem('projectFilter') || 'todos';
  const activeButton = document.querySelector(`.modBtns button[data-show="${savedFilter}"]`);
  if (activeButton) {
    activeButton.click();
  }

  // ========== SCROLL TO TOP ==========
  const scrollToTopButton = document.getElementById('scrollToTop');
  
  window.addEventListener('scroll', function() {
    scrollToTopButton.style.display = window.scrollY > 200 ? 'flex' : 'none';
  });
  
  scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ========== FORMULARIO DE CONTACTO ==========
  const contactForm = document.getElementById('fContacto');
  
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (!this.checkValidity()) {
      // Mostrar errores de validación
      this.reportValidity();
      return;
    }
    
    // Mostrar confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres enviar el formulario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí iría el envío real del formulario (AJAX, etc.)
        Swal.fire(
          '¡Enviado!',
          'Tu mensaje ha sido enviado correctamente.',
          'success'
        );
        this.reset();
      }
    });
  });

  // ========== AÑO ACTUAL EN FOOTER ==========
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // ========== ANIMACIONES AL SCROLL ==========
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.proyecto, .habilidad, .educacion-item, .contact-card');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Configurar elementos inicialmente
  document.querySelectorAll('.proyecto, .habilidad, .educacion-item, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  // Ejecutar al cargar y al hacer scroll
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Ejecutar una vez al cargar
});