//login js
const correctUserMail = "trainer@gmail.com";
const correctUserPassword = "987654psw";
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const mail = document.querySelector('.input-group input[type="email"]').value;
    const password = document.querySelector('.input-group input[type="password"]').value;
    const errorMessageElement = document.querySelector('.error-message');
    const loader = document.getElementById("loader");
    const loginButton = document.querySelector('#login-form button[type="submit"]');
    
    errorMessageElement.textContent = '';
    
    loader.classList.remove("loading-hidden");
    loader.classList.add("loading");
    loginButton.disabled = true;
    
    setTimeout(function() {
        if (mail === correctUserMail && password === correctUserPassword) {
            window.location.href = "test.html";
        } else {
            errorMessageElement.textContent = "Incorrect email or password. Please try again.";
            
            setTimeout(function() {
                errorMessageElement.textContent = '';
            }, 3000);
        }
        
        loader.classList.remove("loading");
        loader.classList.add("loading-hidden");
        loginButton.disabled = false;
    }, 2000);
});