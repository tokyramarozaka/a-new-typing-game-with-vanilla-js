window.addEventListener("DOMContentLoaded", function(){
    const mail = "test@gmail.com"
    const pswd = "1234"
    const bouton = document.querySelector('.login_button')
    const message = this.document.querySelector('.message')
    const message1 = this.document.querySelector('.message1')
    
    function connect() {
        if (!document.querySelector(".mail").value || !document.querySelector(".password").value) {
            message.classList.add("message_allert");
            setTimeout(() => {
                message.classList.remove("message_allert")
            }, 3000);
            
        }
        else{
            setTimeout(() => {
                bouton.innerHTML = "Please wait"
            },10)
            setTimeout(() => {
               if (document.querySelector(".mail").value === mail && document.querySelector(".password").value ===  pswd) {
                    window.location.href = "./index.html"
                }
                else{
                    bouton.innerHTML = "Login now"
                    message1.classList.add("message_allert");
                    setTimeout(() => {
                        message1.classList.remove("message_allert")
                    }, 3000);
                }
            },3000)
        } 
    }
    bouton.addEventListener('click', connect)
})