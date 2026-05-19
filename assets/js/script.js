document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = loginForm.querySelector('button[type="submit"]');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const username = usernameInput.value;
        const password = passwordInput.value;
        loginButton.textContent = 'Loading...';
        loginButton.disabled = true;

        setTimeout(function() {
            if (username === 'test001' && password === 'secret4') {
                window.location.href = 'home.html'; 
            } else {
                loginButton.textContent = 'Login';
                loginButton.disabled = false;
                errorMessage.style.display = 'block'; 
            }
        }, 4000);
    });
});