
const form = document.querySelector('.form');
const inputFullName = document.querySelector('#input-full-name')
const inputPhoneNumber = document.querySelector('#input-phone-number')
const inputPassword = document.querySelector('#input-password')
const inputConfirmPassword = document.querySelector('#input-confirm-password')
const btnSubmit = document.querySelector('.btn-submit');
const apiBaseUrlRegister = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : 'https://naghshnegar.liara.run/api'

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

const clearInputs = () => {
    inputFullName.value = '';
    inputPhoneNumber.value = '';
    inputPassword.value = '';
    inputConfirmPassword.value = '';
}
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
const userExists = async () => {
    const res = await axios.get(`${apiBaseUrlRegister}/users`)
    let data = res.data;
    let filterExistingUsers = data.some(user => {
        return user.phoneNumber === inputPhoneNumber.value
    })
    return filterExistingUsers;
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
const addUser = async () => {
    let isUser = await userExists();
    const fullName = inputFullName.value.trim();
    const phoneNumber = inputPhoneNumber.value.trim();
    const password = inputPassword.value.trim();
    const confrimPassword = inputConfirmPassword.value.trim();
    if (!validationInputs() || !validationPhoneNumber(phoneNumber) || !validationPassword(password, confrimPassword)) {
        return;
    }

    if (isUser) {
        Toast.fire({
            icon: 'error',
            title: 'خطا',
            text: 'این شماره موبایل قبلا ثبت نام کرده است'
        });
    }
    else {
        const newUsers = {
            fullName: fullName,
            phoneNumber: phoneNumber,
            password: password,
            confrimPassword: confrimPassword,
        };
        try {
            const res = await axios({
                method: "POST",
                url: `${apiBaseUrlRegister}/users`,
                data: newUsers,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            Toast.fire({
                icon: 'success',
                title: 'ثبت نام موفق',
                text: "ثبت نام  شما با موفقیت انجام شد"
            });
            clearInputs();
            setTimeout(() => {
                location.href = 'index.html'
            }, 1000);
        } catch (err) {
            Toast.fire({
                icon: 'error',
                title: 'ثبت نام نا موفق',
                text: "ثبت نام نام شما با شکست مواجه شد"
            });
        }
    }
}
btnSubmit.addEventListener('click', addUser);
