let logoutIcon = document.getElementById('logoutIcon');
let settingsIcon = document.getElementById('settingsIcon');

if (!localStorage.getItem('token')) {
    logoutIcon.style.display = 'none';
    settingsIcon.style.display = 'none';
}