const productName = document.querySelector('.product-name')
const productType = document.querySelector('.product-type')
const productModel = document.querySelector('.product-model')
const aboutProduct = document.querySelector('.about-product');
const priceText = document.querySelector('.price-text');
const btnAddCart = document.querySelector('.btn-add-cart')
const productImageWrap = document.querySelector('.product-image-wrap');

let locationSearch = location.search;
const locationSearchParams = new URLSearchParams(locationSearch);
let productIDParam = locationSearchParams.get('id');
const user = JSON.parse(localStorage.getItem('user'));
const userId = user._id
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    timerProgressBar: true,
});
//!Swiper Product Images
new Swiper('.swiper-product-images', {
    slidesPerView: 1,
    autoplay: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    grabCursor: true,
});

const getCategorys = async () => {
    return await axios.get('http://localhost:3000/api/categorys').then(res => res.data);
}

const getProducts = async () => {
    return await axios.get('http://localhost:3000/api/products').then(res => res.data);
}

const getShoppingCart = async () => {
    return await axios.get(`http://localhost:3000/api/shoppingcarts/${userId}`).then(res => res.data);
}

const showProduct = async () => {

    const [categorys, products] = await Promise.all([getCategorys(), getProducts()])
    let product = products.find(product => {
        return product._id === productIDParam;
    });
    if (product) {
        let category = categorys.find(category => {
            return category._id === product.category._id;
        });
        if (category) {
            productType.innerHTML = `جنس: ${category.name}`;
        }

        productModel.innerHTML = `مدل: ${product.model}`
        priceText.innerHTML = `${Number(product.price).toLocaleString('fa-IR')} تومان `
        aboutProduct.innerHTML = product.desc;

        productName.innerHTML = product.name;
        product.images.forEach(image => {
            productImageWrap.insertAdjacentHTML('beforeend', `
                <div class="swiper-slide">
                <div class="product-big-image overflow-hidden w-md-100">
                  <img src="${image}" alt="Photo" class="w-100" />
                </div>
              </div>`);
        })
        zoomImage();
    }
}

const zoomImage = () => {
    const imageContainers = document.querySelectorAll('.product-big-image');
    imageContainers.forEach(imageContainer => {
        const image = imageContainer.querySelector('img');
        imageContainer.addEventListener('click', () => {
            if (image.style.transform === 'scale(2)') {
                image.style.cursor = 'zoom-in';
                image.style.transform = 'scale(1)';
            }
            else {
                image.style.cursor = 'zoom-out';
                imageContainer.addEventListener('mousemove', (e) => {
                    const rect = imageContainer.getBoundingClientRect();

                    let xPos = e.clientX - rect.left;
                    let yPos = e.clientY - rect.top;

                    image.style.transformOrigin = `${xPos}px ${yPos}px`;
                    image.style.transform = `scale(2)`
                });
            }
        });
        imageContainer.addEventListener('mouseleave', () => {
            image.style.transformOrigin = `center`
            image.style.transform = `scale(1)`
        });
    })
}

const addToCart = async () => {
    let user = JSON.parse(localStorage.getItem('user'));

    let products = await getProducts();
    let shoppingCart = await getShoppingCart();
console.log(shoppingCart)
    let product = products.find(product => {
        return product._id === productIDParam;
    });
    let isProductInCart = shoppingCart.some(item => {
        return product._id === item.productId._id && item.userId === user._id
    });
    if (isProductInCart) {
        Toast.fire({
            icon: 'warning',
            text: 'این محصول در سبد خرید شما موجود است',
            confirmButtonText: 'تایید'
        })
    } else {
        const shoppingCartObject = {
            productId: product._id,
            userId: user._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            count: 1,
        }
        try {
            const res = await axios({
                method: 'POST',
                url: 'http://localhost:3000/api/shoppingcarts',
                data: shoppingCartObject,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            Toast.fire({
                icon: 'success',
                text: `${res.data.name} به سبد خرید شما اضافه شد.`,
                confirmButtonText: 'تایید'
            })
        } catch (err) {
            Toast.fire({
                icon: 'error',
                text: `محصول به سبد خریداضافه نشد.`,
                confirmButtonText: 'تایید'
            })
        }
    }
}
btnAddCart.addEventListener('click', addToCart);

showProduct();
