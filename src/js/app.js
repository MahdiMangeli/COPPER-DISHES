import './utils.js'

const navbarSubmenus = document.querySelectorAll('.navbar-submenu');
navbarSubmenus.forEach(submenu => {
    submenu.innerHTML = ''
    axios({
        url: 'http://localhost:3000/categories'
    }).then(res => res.data)
        .then(data => {
            data.forEach(category => {
                submenu.insertAdjacentHTML('beforeend', `
                <li class="navbar-submenu-item">
                <a href="category.html?id=${category.id}" class="navbar-submenu-item-link w-100 d-block">${category.name}</a>
                </li>
                `)
            })
        })
})
const navbarButtons = document.querySelectorAll('.navbar-btn a');

window.addEventListener('load', () => {
    let getUserFromLocal = JSON.parse(localStorage.getItem('user'));
    if (getUserFromLocal) {
        navbarButtons.forEach(btn => {
            btn.innerHTML = 'داشبورد'
            btn.addEventListener('click', () => {
                btn.href = 'dashboard.html';
            });
        });
    }
    else {
        navbarButtons.forEach(btn => {
            btn.innerHTML = 'ورود'
            btn.href = 'login.html';
        });
    }
})
