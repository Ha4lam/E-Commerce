const BASE_URL = "https://dummyjson.com/";

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadProducts();

  document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    const category = document.getElementById('categorySelect').value;
    searchProducts(query, category);
  });

  document.getElementById('cart-icon').addEventListener('click', () => {
    document.getElementById('cart').style.transform = 'translateX(0)';
  });
});

async function loadCategories() {
  try {
    const categories = [
      "smartphones",
      "laptops",
      "fragrances",
      "skincare",
      "groceries",
      "home-decoration",
      "furniture",
      "tops",
      "womens-dresses",
      "womens-shoes",
      "mens-shirts",
      "mens-shoes",
      "mens-watches",
      "womens-watches",
      "womens-bags",
      "womens-jewellery",
      "sunglasses",
      "automotive",
      "motorcycle",
      "lighting"
    ];
    const categoryList = document.getElementById('categoryList');
    const categorySelect = document.getElementById('categorySelect');

    categories.forEach(category => {
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.textContent = category;
      listItem.addEventListener('click', () => loadProducts(category));
      categoryList.appendChild(listItem);

      const optionItem = document.createElement('option');
      optionItem.value = category;
      optionItem.textContent = category;
      categorySelect.appendChild(optionItem);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

async function loadProducts(category = '') {
  try {
    showLoading();
    const response = await fetch(`${BASE_URL}products${category ? `/category/${category}` : ''}`);
    const { products } = await response.json();
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'col-md-4 mb-4';
      productDiv.innerHTML = `
        <div class="card h-100">
          <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="price mt-auto mb-0">$${product.price}</p>
            <button class="btn btn-primary mt-2 add-to-cart" onclick="addToCart('${product.id}', '${product.title}', ${product.price}, '${product.thumbnail}')">Add to cart</button>
          </div>
        </div>
      `;
      productList.appendChild(productDiv);
    });
    hideLoading();
  } catch (error) {
    console.error("Error loading products:", error);
    hideLoading();
  }
}

async function searchProducts(query, category) {
  try {
    showLoading();
    const response = await fetch(`${BASE_URL}products/search?q=${query}`);
    const { products } = await response.json();
    const filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    filteredProducts.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.className = 'col-md-4 mb-4';
      productDiv.innerHTML = `
        <div class="card h-100">
          <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="price mt-auto mb-0">$${product.price}</p>
            <button class="btn btn-primary mt-2 add-to-cart" onclick="addToCart('${product.id}', '${product.title}', ${product.price}, '${product.thumbnail}')">Add to cart</button>
          </div>
        </div>
      `;
      productList.appendChild(productDiv);
    });
    hideLoading();
  } catch (error) {
    console.error("Error searching products:", error);
    hideLoading();
  }
}

let cartItems = [];

function addToCart(id, title, price, thumbnail) {
  const existingItem = cartItems.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ id, title, price, thumbnail, quantity: 1 });
  }
  renderCart();
}

function renderCart() {
  const cartBody = document.querySelector('.cart-body');
  cartBody.innerHTML = '';

  if (cartItems.length > 0) {
    cartItems.forEach(item => {
      const cartItemDiv = document.createElement('div');
      cartItemDiv.className = 'cart-item d-flex justify-content-between align-items-center mb-3';
      cartItemDiv.innerHTML = `
        <div class="item-info d-flex align-items-center">
          <img src="${item.thumbnail}" class="cart-item-thumbnail" alt="${item.title}">
          <div>
            <p>${item.title}</p>
            <p>Price: $${item.price} x ${item.quantity} : ${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
        <div class="quantity-controls">
          <button class="btn btn-light" onclick="updateQuantity('${item.id}', 'decrease')">&minus;</button>
          <span class="mx-2">${item.quantity}</span>
          <button class="btn btn-light" onclick="updateQuantity('${item.id}', 'increase')">&plus;</button>
          <button class="remove-item ml-2" onclick="removeFromCart('${item.id}')">&times;</button>
        </div>
      `;
      cartBody.appendChild(cartItemDiv);
    });
  } else {
    const noItemsMessage = document.createElement('p');
    noItemsMessage.textContent = 'No items added to cart!';
    cartBody.appendChild(noItemsMessage);
  }
}

function updateQuantity(id, action) {
  const item = cartItems.find(item => item.id === id);
  if (item) {
    if (action === 'increase') {
      item.quantity++;
    } else if (action === 'decrease') {
      item.quantity--;
      if (item.quantity <= 0) {
        removeFromCart(id);
      }
    }
    renderCart();
  }
}

function removeFromCart(id) {
  cartItems = cartItems.filter(item => item.id !== id);
  renderCart();
}

function closeCart() {
  document.getElementById('cart').style.transform = 'translateX(100%)';
}

function showLoading() {
  document.getElementById('loadingPanel').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loadingPanel').style.display = 'none';
}
