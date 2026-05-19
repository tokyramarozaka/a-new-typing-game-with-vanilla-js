const darkModeToggle = document.getElementById('dark-mode-toggle');


// Toggle dark/light mode
const toggleDarkMode = () => {
    document.body.classList.toggle('light-mode');
    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
}

// Dark mode toggle
darkModeToggle.addEventListener('change', toggleDarkMode);