const manuBarBtn = document.querySelector('.manu-bar-btn');
const navbarMobile = document.querySelector('.navbar-mobile');
const navbarClose = document.querySelector('.navbar-close');

//!Show Menu
const showMenu = () => {
    navbarMobile.classList.remove('navbar-hidden');
    navbarMobile.classList.add('navbar-active');
}

//!Close Menu
const closeMenu = () => {
    navbarMobile.classList.add('navbar-hidden');
    navbarMobile.classList.remove('navbar-active');
}

//!Manu Bar Btn
manuBarBtn.addEventListener('click', () => {
    if (navbarMobile.classList.contains('navbar-hidden')) {
        showMenu();
    }
    else {
        closeMenu();
    }
    document.addEventListener('click', (event) => {
        if (event.target.tagName != 'BUTTON' && event.target.tagName != 'svg') {
            closeMenu()
        }
    });
});

navbarClose.addEventListener('click', () => {
    closeMenu();
})
//!Category Button Aside In Mode Mobile
const categoryButton = document.querySelector(".category-btn");
const navbarSubmenuMobile = document.querySelector(".navbar-submenu");
categoryButton.addEventListener('click', (event) => {
    event.target.parentElement.classList.toggle('gap-32');
    navbarSubmenuMobile.classList.toggle('disable');
})

