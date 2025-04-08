window.addEventListener("DOMContentLoaded", function () {
    let email = ""
    let password = ""
    const bouton = document.querySelector('.button_create')
    const message = this.document.querySelector('.message')
    const message1 = this.document.querySelector('.message1') 

    function create() {
        email += document.querySelector(".mail").value
        if (document.querySelector(".password").value === document.querySelector(".password1").value) {
            password += document.querySelector(".password").value
        }
        if (!document.querySelector(".inout_main").value || !document.querySelector(".input_name").value) {
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
                if (document.querySelector(".password").value != document.querySelector(".password1").value) {
                    message1.classList.add("message_allert")
                    bouton.innerHTML = "Login now"
                }
             },3000)
        }
    }
    bouton.addEventListener('click', create)
})