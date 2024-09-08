import './utils.js';

const navbarButtons = document.querySelectorAll('.navbar-btn a');
const navbarSubmenus = document.querySelectorAll('.navbar-submenu');
const listOurProducts = document.querySelector('.list-our-products')

listOurProducts.innerHTML = ''
// navbarSubmenus.innerHTML = '';
const showCategorysInSubMenu = async () => {
    await axios({
        url: 'http://localhost:3000/api/categorys'
    }).then(res => res.data)
        .then(data => {
            data.forEach(category => {
                navbarSubmenus.forEach(submenu => {
                    // submenu.innerHTML = ''
                    submenu.insertAdjacentHTML('beforeend', `
                        <li class="navbar-submenu-item">
                        <a href="category.html?id=${category._id}" class="navbar-submenu-item-link w-100 d-block">${category.name}</a>
                        </li>
                        `);
                });

                listOurProducts.insertAdjacentHTML('beforeend', `
                 <li>
                   <a href="category.html?id=${category._id}">${category.name}</a>
                 </li>
                 `)
            });

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
