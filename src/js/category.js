let slideWrapp = document.querySelector(".slide-wrapp");
let slideWrappBanner = document.querySelector(".slide-wrapp-banner");

const descriptionTitle = document.querySelector('.description-title');
const discriptionHistoryTitle = document.querySelector('.discription-history-title');
const descriptionHistoryProductText = document.querySelector('.description-history-product-text');
const descriptionProductText = document.querySelector('.description-product-text');
const productsCategoryTitle = document.querySelector('.products-category-title');


let currentPage = 1;
let productsPerPage;
//!Swiper Slide Category
const swiperSlideCategory = new Swiper('.swiper-slide-category', {
    slidesPerView: 1,
    spaceBetween: 30,
    autoplay: true,
});

const swiperProductList = new Swiper('.swiper-product-list', {
    slidesPerView: 1,
    spaceBetween: 30,
    breakpoints: {
        300: {
            slidesPerView: 1,
        },
        575: {
            slidesPerView: 2,
        },
        767: {
            slidesPerView: 3,
        },
        992: {
            slidesPerView: 4,
        },
        1199: {
            slidesPerView: 4,
            grid: {
                rows: 2,
            },
        }
    },

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: function (index, className) {
            return `<span class="${className}">${index + 1}</span>`
        }
    }
});

let locationSearch = location.search;
const locationSearchParams = new URLSearchParams(locationSearch);
let categoryIDParams = Number(locationSearchParams.get('id'));

const getCategory = async () => {
    await axios({
        url: 'http://localhost:3000/categories'
    }).then(res => res.data)
        .then(data => {
            console.log(data)
            let findCategoryName = data.find(category => {
                return Number(category.id) === categoryIDParams;
            })
            if (findCategoryName) {
                descriptionTitle.innerHTML = findCategoryName.name;
                productsCategoryTitle.innerHTML = findCategoryName.name;
                discriptionHistoryTitle.innerHTML = findCategoryName.categorieHistory
                descriptionHistoryProductText.innerHTML = findCategoryName.categorieHistoryDescription
                descriptionProductText.innerHTML = findCategoryName.categoryDescription
                findCategoryName.images.forEach(image => {
                  
                    slideWrappBanner.insertAdjacentHTML('beforeend', `
                         <div class="swiper-slide">
                            <div class="image-gategory overflow-hidden">
                                <img src="${image}" class=" w-100">
                            </div>
                        </div>
                        `)
                })
            }

        });
}
getCategory()
const getProducts = async () => {
    await axios({
        url: 'http://localhost:3000/productsCopper',
    })
        .then(res => res.data)
        .then(data => {
            let filteredProductsByCategory = data.filter((product) => {
                return Number(product.category) === categoryIDParams;
            })
            if (filteredProductsByCategory) {
                displayProductsList(filteredProductsByCategory, slideWrapp)
            }
        });
}

const displayProductsList = (allProducts, productsContainer) => {
    productsContainer.innerHTML = '';
    let fragment = document.createDocumentFragment();

    allProducts.forEach(product => {

        let slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="swiper-slide">
              <div class="product-category d-flex flex-col gap-16">
                <img src="${product.images[0]}" alt="محصولات" class="w-100"/>
                <div class="product-infos d-flex flex-col gap-16">
                  <div class="product-title d-flex align-center justify-between">
                    <span>${product.name}</span>
                  </div>
                  <div class="product-price">${Number(product.price).toLocaleString('fa-IR')}</div>
                  <div class="product-more-info">
                    <a href="product.html?id=${product.id}" class="d-flex justify-center btn-more-info w-100 cursor-pointer">بیشتر</a>
                  </div>
                </div>
              </div>
     </div>`
        fragment.appendChild(slide);
    });
    productsContainer.appendChild(fragment);
}

getProducts();