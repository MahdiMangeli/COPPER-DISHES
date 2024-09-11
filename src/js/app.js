import './utils.js';
const navbarButtons = document.querySelectorAll('.navbar-btn a');
const navbarSubmenus = document.querySelectorAll('.navbar-submenu');
const listOurProducts = document.querySelector('.list-our-products')
const apiBaseUrlApp = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://naghshnegar.liara.run/api'

listOurProducts.innerHTML = ''
navbarSubmenus.innerHTML = '';
const showCategorysInSubMenu = async () => {
    await axios({
        url: `${apiBaseUrlApp}/categorys`
    }).then(res => res.data)
        .then(data => {
            navbarSubmenus.forEach(submenu => {
                submenu.innerHTML = ''
                data.forEach(category => {
                    submenu.insertAdjacentHTML('beforeend', `
                        <li class="navbar-submenu-item">
                        <a href="category.html?id=${category._id}" class="navbar-submenu-item-link w-100 d-block">${category.name}</a>
                        </li>
                        `);
                });
            });
            data.forEach(category => {
                listOurProducts.insertAdjacentHTML('beforeend', `
                     <li>
                       <a href="category.html?id=${category._id}">${category.name}</a>
                     </li>
                     `);
            })
        });
}


window.addEventListener('load', async () => {
    await showCategorysInSubMenu();
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
