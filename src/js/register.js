const form = document.querySelector('.form');
const inputFullName = document.querySelector('#input-full-name')
const inputPhoneNumber = document.querySelector('#input-phone-number')
const inputPassword = document.querySelector('#input-password')
const inputConfirmPassword = document.querySelector('#input-confirm-password')
const btnSubmit = document.querySelector('.btn-submit');

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

const validationInputs = () => {
    const inputs = [inputFullName, inputPhoneNumber, inputPassword, inputConfirmPassword];
    for (const input of inputs) {
        if (input.value.trim() === '') {
            Toast.fire({
                icon: 'error',
                title: 'خطا',
                text: 'ورودی ها نمیتواند خالی باشد!'
            });
            return false
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

const validationPassword = (password, confrimPassword) => {
    if (password != confrimPassword) {
        Toast.fire({
            icon: 'error',
            title: 'خطا',
            text: 'پسورد با تکرار پسورد مطابقت ندارد!'
        });
        return false;
    }
    if (password.length < 8 && confrimPassword.length < 8) {
        Toast.fire({
            icon: 'error',
            title: 'خطا',
            text: 'رمز عبور باید 8 رقم باشد!'
        });
        return false;
    }
    return true;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
});

btnSubmit.addEventListener('click', (e) => {
    const fullName = inputFullName.value.trim();
    const phoneNumber = inputPhoneNumber.value.trim();
    const password = inputPassword.value.trim();
    const confrimPassword = inputConfirmPassword.value.trim();

    if (!validationInputs() || !validationPhoneNumber(phoneNumber) || !validationPassword(password, confrimPassword)) {
        return;
    }
    const newUsers = {
        id: Math.floor(Math.random() * 9999),
        fullName: fullName,
        phoneNumber: phoneNumber,
        password: password,
        confrimPassword: confrimPassword,

    };
    axios({
        method: 'post',
        url: 'http://localhost:3000/users',
        data: newUsers,
    }).then(res => {
        Toast.fire({
            icon: 'success',
            title: 'ثبت نام موفق',
            text: "ثبت نام نام شما با موفقیت انجام شد"
        });
    }).catch(err => {
        Toast.fire({
            icon: 'error',
            title: 'ثبت نام نا موفق',
            text: "ثبت نام نام شما با شکست مواجه شد"
        });
    })
})