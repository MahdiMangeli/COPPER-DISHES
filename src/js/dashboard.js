
const dashboardMainContent = document.querySelector('.dashboard-main-content');
const dashboardMain = document.querySelector('.dashboard-main');
const totalPriceNumber = document.querySelector('.total-price-number');
const ordersBtn = document.querySelector('.orders-btn');
const exitBtn = document.querySelector('.exit-btn');

const getCartProduct = async () => {
  const res = await axios({
    url: 'http://localhost:3000/shoppingCart'
  });
  let data = res.data;
  return data;
}

const filterProductsByUser = async () => {
  const cartProducts = await getCartProduct();
  const user = JSON.parse(localStorage.getItem('user'));
  dashboardMainContent.innerHTML = '<h2 class="dashboard-title">سبد خرید شما</h2>'
  let products = cartProducts.filter(product => {
    return Number(product.userId) === Number(user.id);
  });
  return products;
}
//!Show Products
const showProducts = async () => {
  const products = await filterProductsByUser();
  if (products) {
    products.forEach(product => {
      dashboardMainContent.insertAdjacentHTML('beforeend', `
           <button class="dashboard-main-btn d-flex align-center justify-center" onclick="deleteProductFromCart(${product.id},${product.userId},'${product.name}')">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512"
                  class="cursor-pointer w-9 h-9" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" stroke-miterlimit="10" stroke-width="32"
                    d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"></path>
                  <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"
                    d="M320 320L192 192m0 128l128-128"></path>
                </svg>
              </button>
              <div class="dashboard-main-product-info d-flex align-center justify-between flex-sm-col gap-32">
                <div class="dashboard-product-image">
                  <img src="${product.image}" class="product-image w-100 h-100">
                </div>
                <div class="d-flex flex-col gap-16 justify-center align-center">
                  <h2 class="product-name">${product.name}</h2>
                  <div class="dashboard-product-count d-flex align-center gap-8 w-100 justify-center">
                    <button type="button" class="counter-btn increaser-btn h-100 cursor-pointer">+</button>
                    <div class="counter-input w-20 h-100">
                      <input class="w-100 h-100" type="number" max="20" data-productid="${product.id}" data-userid="${product.userId}" value="${product.count}">
                    </div>
                    <button type="button" class="counter-btn decrease-btn h-100 cursor-pointer">-</button>
                  </div>
                </div>
                <div class="dashboard-product-price">
                  <span class="product-price">${Number(product.price * product.count).toLocaleString('fa-IR')}</span>
                  <span>تومان</span>
                </div>
              </div>`);
    })
    totalPriceBasket(products)
    productCounter(products)
  }
}
//!Product Counter
const productCounter = (products) => {
  const dashboardProductCount = document.querySelectorAll('.dashboard-product-count');
  let increaserButton;
  let counterInput;
  let decreaserButton;
  let currentCount;

  const minValue = 1;
  const maxValue = 20;

  counterInput = document.querySelectorAll('.counter-input input').forEach((input) => {
    input.addEventListener('change', (event) => {
      currentCount = Number(event.target.value)
      if (currentCount > minValue && currentCount < maxValue) {
        updateProductCount(products, event.target.dataset.productid, event.target.dataset.userid, currentCount)
      }
    })
  });

  dashboardProductCount.forEach(counter => {
    increaserButton = counter.querySelector('.increaser-btn')
    decreaserButton = counter.querySelector('.decrease-btn');

    increaserButton.addEventListener('click', () => {
      counterInput = counter.querySelector('.counter-input input');
      currentCount = Number(counterInput.value);
      if (currentCount < maxValue) {
        currentCount += 1;
        counterInput.value = currentCount;
        updateProductCount(products, counterInput.dataset.productid, counterInput.dataset.userid, currentCount);
      }
    });

    decreaserButton.addEventListener('click', (event) => {
      counterInput = counter.querySelector('.counter-input input');
      currentCount = Number(counterInput.value);
      if (currentCount > minValue) {
        currentCount -= 1;
        counterInput.value = currentCount;
        updateProductCount(products, counterInput.dataset.productid, counterInput.dataset.userid, currentCount)
      }
    })
  });
}
//!Update Count
const updateProductCount = async (products, productId, userId, newCount) => {
  const findProduct = products.find(product => {
    return Number(product.id) === Number(productId) && Number(product.userId) === Number(userId)
  })
  if (findProduct) {
    try {
      await axios.put(`http://localhost:3000/shoppingCart/${productId}?userId=${userId}`, {
        id: productId,
        userId: userId,
        name: findProduct.name,
        image: findProduct.image,
        price: findProduct.price,
        count: newCount,
      })
    }
    catch (error) {
      alert('مشکلی پیش امده است  لطفا صبور باشید🙏')
    }
  }
}
//! Delete Product From Cart
const deleteProductFromCart = (productId, userId, productName) => {
  Swal.fire({
    title: 'ایا مطمئن هستید',
    text: `${productName} از سبد خرید شما حذف شود؟`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: "#28887a",
    cancelButtonColor: '#d33',
    cancelButtonText: 'خیر',
    confirmButtonText: 'بله',
  }).then(async result => {
    if (result.isConfirmed) {
      await axios.delete(`http://localhost:3000/shoppingCart/${productId}`, {
        params: { userId },
      });
      Swal.fire({
        title: "حذف شد",
        text: `${productName} از سبد خرید شما حذف شد`,
        icon: 'success',
      })
    }
  })
};
//! Total Price Basket
const totalPriceBasket = (products) => {
  let total = products.reduce(function (prev, current) {
    console.log('prev', prev)
    console.log('current', current)
    return prev + current.price*current.count
  }, 0)
  totalPriceNumber.innerHTML = Number(total).toLocaleString('fa-IR')
}

ordersBtn.addEventListener('click', () => {
  dashboardMain.classList.replace('d-none', 'd-block')
}, { once: true });
showProducts();


exitBtn.addEventListener('click', () => {
  location.href = 'index.html';
});