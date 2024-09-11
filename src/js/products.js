let slideWrapp = document.querySelector(".slide-wrapp");
const filterProductsElems = document.querySelectorAll('.filter-products');
const apiBaseUrlProducts = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : 'https://copperdishes.liara.run/api'

// ! Swiper Products
const swiperProducts = new Swiper('.swiper-products', {
  slidesPerView: 1,
  spaceBetween: 20,
  grabCursor: true,
  breakpoints: {
    300: {
      slidesPerView: 1,
    },
    576: {
      slidesPerView: 2
    },
    767: {
      slidesPerView: 3,
    },
    992: {
      slidesPerView: 3,
      grid: {
        rows: 2,
      },
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
  },
});
const getProducts = async () => {
  return await axios({ url: `${apiBaseUrlProducts}/products` }).then(res => res.data).then(data => data);
}

const displayProductsList = async (allProducts) => {
  slideWrapp.innerHTML = '';
  let fragment = document.createDocumentFragment();
  let slide;
  allProducts.forEach(product => {
    slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
            <div class="swiper-slide">
              <div class="product d-flex flex-col gap-16">
                <img src="${product.images[0]}" alt="محصولات" class="w-100"/>
                <div class="product-infos d-flex flex-col gap-16">
                  <div class="product-title d-flex align-center justify-between">
                    <span>${product.name}</span>
                  </div>
                  <div class="product-price">${Number(product.price).toLocaleString('fa-IR')}</div>
                  <div class="product-more-info">
                    <a href="product.html?id=${product._id}" class="d-flex justify-center btn-more-info w-100 cursor-pointer">بیشتر</a>
                  </div>
                </div>
              </div>
              </div>`

    fragment.appendChild(slide);
  });
  slideWrapp.appendChild(fragment);
}

// ! Sort Products By Newest 
const sortedProducts = async () => {
  let products = await getProducts();
  let filteredProductsByNewest = products.filter(product => {
    return product.releaseDate > '2024-01-10' && product.releaseDate < '2024-10-30'
  });
  if (filteredProductsByNewest) {
    filteredProductsByNewest.sort((a, b) => {
      const dateA = new Date(a.releaseDate)
      const dateB = new Date(b.releaseDate)
      return dateA - dateB;
    });
    displayProductsList(filteredProductsByNewest);
  }
}

// ! Filtered Products By Best Sellers
const topSellingProduts = async () => {
  let products = await getProducts();
  const filteredTopSellingProducts = products.filter(product => {
    return product.salesCount > 20
  });
  if (filteredTopSellingProducts) {
    let sortBestSellers = filteredTopSellingProducts.sort((a, b) => b.salesCount - a.salesCount)
    displayProductsList(sortBestSellers)
  }
}

// ! Sort Products By Most Visited
const filterByMostVisited = async () => {
  let products = await getProducts();
  let filteredProductsByMostVisited = products.filter(product => {
    return product.views > 1000
  })
  if (filteredProductsByMostVisited) {
    let sortMostVisited = filteredProductsByMostVisited.sort((a, b) => b.views - a.views)
    displayProductsList(sortMostVisited)
  }
}
// ! Show All Products
const showAllProducts = async () => {
  let products = await getProducts();
  displayProductsList(products)
}
// ! Filter Buttons
const filterButtons = () => {
  let prevActive;
  filterProductsElems.forEach(elem => {
    elem.addEventListener('click', (event) => {
      prevActive = elem.querySelector('.active');
      prevActive.classList.remove('active');

      event.target.classList.add('active');
    });
    elem.querySelector('.all-products').addEventListener('click', () => {
      showAllProducts();
    })
    elem.querySelector('.popular').addEventListener('click', () => {
      filterByMostVisited()
    })
    elem.querySelector('.newest').addEventListener('click', () => {
      sortedProducts();
    })
    elem.querySelector('.best-seller').addEventListener('click', () => {
      topSellingProduts()
    })
  });
}

window.addEventListener('load', () => {
  filterButtons();
  showAllProducts();
})