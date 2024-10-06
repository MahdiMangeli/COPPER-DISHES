const inputPhoneNumber = document.querySelector('#input-phone-number')
const inputPassword = document.querySelector('#input-password')
const btnSubmit = document.querySelector('.btn-submit');
const apiBaseUrlLogin = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://naghshnegar.liara.run/api'

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});
const validationInputs = () => {
    const inputs = [inputPhoneNumber, inputPassword];
    for (const input of inputs) {
        if (input.value.trim() === '') {
            Toast.fire({
                icon: 'error',
                title: 'خطا',
                text: 'ورودی ها نمیتواند خالی باشد!'
            });
            return false;
        }
    }
    return true;
}

const validationPhoneNumber = (phoneNumber) => {
    let phoneNumberRegex = /^(\+98|0)?9\d{9}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
        Toast.fire({
            icon: 'error',
            title: 'خطا',
            text: 'شماره موبایل معتبر نیست'
        })
        return false;
    }
    return true;
}

btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();

    if (!validationInputs() || !validationPhoneNumber(inputPhoneNumber.value.trim())) {
        return;
    }

    axios({
        url: `${apiBaseUrlLogin}/users`,
    }).then(res => {
        return res.data
    }).then(usersArray => {
        let foundUser = false;
        usersArray.forEach(user => {
            console.log(typeof user.phoneNumber)
            console.log(typeof user.password)
            if (user.phoneNumber == inputPhoneNumber.value.trim() && user.password == inputPassword.value.trim()) {
                localStorage.setItem('user', JSON.stringify(user));
                foundUser = true;
            }
        });
        if (!foundUser) {
            Swal.fire({
                icon: 'error',
                toast: true,
                position: 'top-end',
                timer: 2000,
                timerProgressBar: true,
                title: 'خطا',
                text: 'شماره تماس یا رمز عبور اشتباه است!'
            });
        }
        else {
             location.href = 'index.html';
        }

    }).catch(err => {
        Swal.fire({
            icon: 'error',
            toast: true,
            position: 'top-end',
            timer: 2000,
            timerProgressBar: true,
            title: 'خطا',
            text: 'ورود با خطا مواجه شد !'
        });
    });
});

