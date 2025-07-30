document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const taskForm = document.getElementById('taskForm');
    const tasksContainer = document.getElementById('tasksContainer');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Cargar tareas al iniciar
    loadTasks();
    
    // Evento para agregar tarea
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;
        
        if (!title || !priority) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor complete el título y seleccione prioridad',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            return;
        }
        
        const newTask = {
            id: Date.now(),
            title,
            priority,
            dueDate,
            completed: false
        };
        
        addTask(newTask);
        taskForm.reset();
        
        Swal.fire({
            title: '¡Tarea agregada!',
            text: 'La tarea se ha añadido correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    });
    
    // Filtrado de tareas
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterTasks(this.dataset.filter);
        });
    });
    
    // Función para cargar tareas
    function loadTasks(filter = 'all') {
        const tasks = getTasks();
        displayTasks(tasks, filter);
    }
    
    // Función para mostrar tareas
    function displayTasks(tasks, filter = 'all') {
        tasksContainer.innerHTML = '';
        
        if (tasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No hay tareas registradas</h3>
                    <p>Comienza agregando una nueva tarea</p>
                </div>
            `;
            return;
        }
        
        let filteredTasks = tasks;
        if (filter !== 'all') {
            filteredTasks = tasks.filter(task => task.priority === filter);
            
            if (filteredTasks.length === 0) {
                tasksContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>No hay tareas con ${filter} prioridad</h3>
                        <p>Prueba con otro filtro o agrega nuevas tareas</p>
                    </div>
                `;
                return;
            }
        }
        
        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.priority}`;
            taskElement.innerHTML = `
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-info">
                        <span class="task-priority priority-${task.priority}">${getPriorityText(task.priority)}</span>
                        ${task.dueDate ? `<span><i class="far fa-calendar-alt"></i> ${formatDate(task.dueDate)}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${task.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            
            tasksContainer.appendChild(taskElement);
        });
        
        // Agregar eventos a los botones
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                editTask(parseInt(this.dataset.id));
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteTask(parseInt(this.dataset.id));
            });
        });
    }
    
    // Función para agregar tarea
    function addTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
        loadTasks(document.querySelector('.filter-btn.active').dataset.filter);
    }
    
    // Función para editar tarea
    function editTask(id) {
        const tasks = getTasks();
        const task = tasks.find(task => task.id === id);
        
        if (!task) return;
        
        Swal.fire({
            title: 'Editar Tarea',
            html: `
                <input id="editTitle" class="swal2-input" value="${task.title}" placeholder="Título">
                <select id="editPriority" class="swal2-select">
                    <option value="alta" ${task.priority === 'alta' ? 'selected' : ''}>Alta Prioridad</option>
                    <option value="media" ${task.priority === 'media' ? 'selected' : ''}>Media Prioridad</option>
                    <option value="baja" ${task.priority === 'baja' ? 'selected' : ''}>Baja Prioridad</option>
                </select>
                <input type="date" id="editDueDate" class="swal2-input" value="${task.dueDate || ''}">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                return {
                    title: document.getElementById('editTitle').value.trim(),
                    priority: document.getElementById('editPriority').value,
                    dueDate: document.getElementById('editDueDate').value
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                task.title = result.value.title;
                task.priority = result.value.priority;
                task.dueDate = result.value.dueDate;
                
                saveTasks(tasks);
                loadTasks(document.querySelector('.filter-btn.active').dataset.filter);
                
                Swal.fire({
                    title: '¡Tarea actualizada!',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    }
    
    // Función para eliminar tarea
    function deleteTask(id) {
        Swal.fire({
            title: '¿Eliminar tarea?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const tasks = getTasks().filter(task => task.id !== id);
                saveTasks(tasks);
                loadTasks(document.querySelector('.filter-btn.active').dataset.filter);
                
                Swal.fire({
                    title: '¡Tarea eliminada!',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    }
    
    // Función para filtrar tareas
    function filterTasks(filter) {
        loadTasks(filter);
    }
    
    // Funciones auxiliares
    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }
    
    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function getPriorityText(priority) {
        const priorities = {
            'alta': 'Alta Prioridad',
            'media': 'Media Prioridad',
            'baja': 'Baja Prioridad'
        };
        return priorities[priority];
    }
    
    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
});