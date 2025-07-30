// script.js
document.addEventListener('DOMContentLoaded', function() {
    const blogForm = document.getElementById('blogForm');
    const postsContainer = document.getElementById('postsContainer');
    
    // Cargar posts guardados al iniciar
    loadPosts();
    
    blogForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;
        
        if (title && content) {
            addPost(title, content);
            blogForm.reset();
            
            // Guardar posts en localStorage
            savePosts();
        }
    });
    
    function addPost(title, content, isLoaded = false) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        
        const postTitle = document.createElement('h3');
        postTitle.textContent = title;
        
        const postContent = document.createElement('p');
        postContent.textContent = content;
        
        const postDate = document.createElement('small');
        postDate.textContent = new Date().toLocaleString();
        
        postDiv.appendChild(postTitle);
        postDiv.appendChild(postDate);
        postDiv.appendChild(postContent);
        
        // Insertar nuevo post al principio
        postsContainer.insertBefore(postDiv, postsContainer.firstChild);
        
        if (!isLoaded) {
            // Animación solo para nuevos posts
            postDiv.style.opacity = '0';
            setTimeout(() => {
                postDiv.style.opacity = '1';
                postDiv.style.transition = 'opacity 0.5s';
            }, 10);
        }
    }
    
    function savePosts() {
        const posts = [];
        document.querySelectorAll('.post').forEach(post => {
            posts.push({
                title: post.querySelector('h3').textContent,
                content: post.querySelector('p').textContent,
                date: post.querySelector('small').textContent
            });
        });
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    }
    
    function loadPosts() {
        const savedPosts = JSON.parse(localStorage.getItem('blogPosts'));
        if (savedPosts && savedPosts.length > 0) {
            // Ordenar por fecha (más nuevos primero)
            savedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            savedPosts.forEach(post => {
                addPost(post.title, post.content, true);
            });
        }
    }
});