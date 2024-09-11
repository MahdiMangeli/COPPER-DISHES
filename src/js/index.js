const popularProductWrap = document.querySelector('.popular-product-wrap');
const apiBaseUrlIndex = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://naghshnegar.liara.run/api'

// ! Swiper Popular Product
new Swiper('.swiper-popular', {
  slidesPerView: 3,
  spaceBetween: 10,
  grabCursor: true,
  breakpoints: {
    300: {
      slidesPerView: 1
    },
    576: {
      slidesPerView: 1
    },
    768: {
      slidesPerView: 2
    },
    992: {
      slidesPerView: 3,
    },
  }
});
// ! Swiper Article
new Swiper('.swiper-article', {
  slidesPerView: 'auto',
  grabCursor: true,
  breakpoints: {
    300: {
      slidesPerView: 1,
      spaceBetween: 15,
    },
    576: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 3,
    },
  },
  grabCursor: true,
});

const showProducts = async () => {
  await axios({
    url: `${apiBaseUrlIndex}/products`,
  })
    .then(res => res.data)
    .then(data => {

      data.forEach(product => {
        popularProductWrap.insertAdjacentHTML('beforeend', `
                <div class="swiper-slide d-flex gap-8">
                  <div class="popular-product-slide d-flex flex-col gap-16">
                    <img src="${product.images[0]}" alt="img" class="w-100" />
                    <div class="product-details">
                      <h2 class="product-title">${product.name}</h2>
                      <div class="prodict-price d-flex justify-end">
                    ${Number(product.price).toLocaleString('fa-IR')}
                      </div>
                      <a href="product.html?id=${product._id}">
                      <button class="product-details-more-btn d-flex align-center cursor-pointer gap-8">
                        بیشتر
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                          <path
                            d="M16.2735 0.781318H0.192749V2.67195H2.13936L4.9154 11.1798C5.09002 11.7314 5.41312 12.2093 5.84042 12.5477C6.26771 12.8862 6.77828 13.0688 7.30212 13.0704H14.5808V11.1798H7.30212C7.12819 11.1797 6.9585 11.1198 6.81614 11.0081C6.67379 10.8965 6.56569 10.7386 6.50655 10.5559L6.11723 9.28917H13.9714C14.3387 9.28858 14.6959 9.15453 14.9891 8.90727C15.2822 8.66 15.4954 8.31294 15.5964 7.91846L17.1198 1.98187C17.1542 1.85774 17.1654 1.72701 17.1525 1.59786C17.1396 1.46871 17.1031 1.3439 17.0451 1.23124C16.9871 1.11858 16.909 1.02048 16.8155 0.943068C16.7221 0.865655 16.6153 0.810593 16.502 0.781318C16.4263 0.767555 16.3492 0.767555 16.2735 0.781318ZM13.946 7.39854H5.48246L3.9421 2.67195H15.1478L13.946 7.39854Z"
                            fill="#FFFCFC" />
                        </svg>
                      </button>
                      </a>
                    </div>
                  </div>
                </div>`)
      })
    })
}

showProducts();