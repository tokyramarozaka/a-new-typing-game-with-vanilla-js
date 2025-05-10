function changingMode() {
  let bodyElement = document.body;
  bodyElement.classList.toggle("dark-mode");

  // Get the button text bodyElement
  let buttonText = document.querySelector(".theme-mode button .nav-text");
  let buttonIcon = document.querySelector(".theme-mode button .nav-icon");

  // Change the text and icon based on current mode state
  if (bodyElement.classList.contains("dark-mode")) {
    buttonText.textContent = "Light mode";
    buttonIcon.classList.remove("fa-moon");
    buttonIcon.classList.add("fa-sun");
  } else {
    buttonText.textContent = "Dark mode";
    buttonIcon.classList.remove("fa-sun");
    buttonIcon.classList.add("fa-moon");
  }
}


let targetIndex = 1;
showTarget(targetIndex);

function plusTarget(n) {
  showTarget(targetIndex += n);
}

function currentSlide(n) {
  showTarget(targetIndex = n);
}

function showTarget(n) {
  let i;
  let targetSlide = document.querySelectorAll(".target");
  let dots = document.querySelectorAll(".indicator");

  if (n > targetSlide.length) { targetIndex = 1 }
  if (n < 1) { targetIndex = targetSlide.length }

  for (i = 0; i < targetSlide.length; i++) {
    targetSlide[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  targetSlide[targetIndex - 1].style.display = "block";
  dots[targetIndex - 1].className += " active";
}

function autoSlide() {
  plusTarget(1);
}

let slideInterval = setInterval(autoSlide, 6000);

document.querySelector('.next').addEventListener('click', function () {
  plusTarget(1);
  resetInterval();
});

document.querySelector('.prev').addEventListener('click', function () {
  plusTarget(-1);
  resetInterval();
});

function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(autoSlide, 5000);
}

// Add event listener for the start button to the login page
document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById("start-button");
  startButton.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = "login.html";
  });
})
