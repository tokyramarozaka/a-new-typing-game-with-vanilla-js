document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        let isValid = true;
        
     
        document.querySelectorAll('.error').forEach(el => el.remove());
     
        if (!email) {
            showError('email', 'Veuillez entrer votre email');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Email invalide');
            isValid = false;
        }
        
        
        if (!password) {
            showError('password', 'Veuillez entrer votre mot de passe');
            isValid = false;
        } else if (password.length < 8) {
            showError('password', 'Le mot de passe doit contenir au moins 8 caractères');
            isValid = false;
        }
        
        if (isValid) {
          
            const button = loginForm.querySelector('button');
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion en cours...';
            
           
            setTimeout(() => {
                alert('Connexion réussie !');
                window.location.href = 'web.html';
            }, 1500);
        }
    });
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.style.color = '#ffcc00';
        errorElement.style.marginTop = '5px';
        errorElement.style.fontSize = '0.8rem';
        errorElement.textContent = message;
        field.parentNode.insertBefore(errorElement, field.nextSibling);

        field.parentNode.style.animation = 'shake 0.5s';
        setTimeout(() => {
            field.parentNode.style.animation = '';
        }, 500);
    }
});
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);