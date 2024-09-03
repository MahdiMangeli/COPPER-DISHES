const inputPhoneNumber = document.querySelector('#input-phone-number')
const inputPassword = document.querySelector('#input-password')
const btnSubmit = document.querySelector('.btn-submit');

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

const validationPhoneNumber = (phoneNumber) => {
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
    axios({
        url: 'http://localhost:3000/users',
    }).then(res => {
        return res.data;
    }).then(usersArray => {
        usersArray.forEach(user => {
            if (user.phoneNumber === inputPhoneNumber.value && user.password === inputPassword.value) {
                location.href = 'index.html';
                localStorage.setItem('user', JSON.stringify(user))
            }
            else {
                Swal.fire({
                    icon: 'error',
                    toast: true,
                    position: 'top-end',
                    timer: 2000,
                    timerProgressBar: true,
                    title: 'خطا',
                    text: 'شماره تماس یا رمز عبور نا معتبر هست!'
                });
            }
        });
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

