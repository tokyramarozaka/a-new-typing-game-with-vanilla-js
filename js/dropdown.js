const profileDropdownList = document.querySelector(".profile-dropdown-list");
const btn = document.querySelector(".profile-dropdown-btn");

const toggle = ()=>profileDropdownList.classList.toggle('active');

window.addEventListener('click',(e)=>{
    if(!btn.contains(e.target)) profileDropdownList.classList.remove('active')

})