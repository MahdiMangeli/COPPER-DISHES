import './utils.js'
const formInputs = document.querySelectorAll('.form-input');
const showHidePassword = document.querySelectorAll('.input-svg');
const passwordInput = document.querySelector('.password-group input[type=password]');
const confirmPasswordInput = document.querySelector('.confirm-password-group input[type=password]');




let isPasswordType = false;
let input;

formInputs.forEach(input => {
    input.addEventListener('blur', function (e) {
        if (input.value.trim() !== "") {
            input.nextElementSibling.classList.add('not-empty');
        }
        else {
            input.nextElementSibling.classList.remove('not-empty');
        }
    });
});

showHidePassword.forEach(svg => {
    svg.addEventListener('click', (e) => {
        input = e.target.previousElementSibling.previousElementSibling;

        if (input !== null && (input === passwordInput || input === confirmPasswordInput)) {
            isPasswordType = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPasswordType ? 'text' : 'password')
        }
    });
});

