document.addEventListener("DOMContentLoaded", function () {
  // Sample product data - replace with your actual products
  const products = [
    {
      id: 1,
      name: "Rolex Daytona",
      category: "watches",
      price: 15000,
      image: "images/products/rolex.png",
    },
    {
      id: 2,
      name: "Ferrari 488 GTB",
      category: "cars",
      price: 250000,
      image: "images/products/ferrari.png",
    },
    // Add more products here...
  ];

  // DOM Elements
  const productsGrid = document.getElementById("products-grid");
  const cartItems = document.getElementById("cart-items");
  const dailyIncomeInput = document.getElementById("daily-income");
  const usdTotal = document.querySelector(".usd-total");
  const solTotal = document.querySelector(".sol-total");
  const daysCounter = document.getElementById("days-counter");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // State
  let cart = [];
  let solPrice = 0;
  let currentFilter = "all";

  // Initialize
  renderProducts();
  updateCartDisplay();

  // Event Listeners
  dailyIncomeInput.addEventListener("input", updateDaysCalculation);

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.dataset.category;
      renderProducts();
    });
  });

  // Functions
  function renderProducts() {
    productsGrid.innerHTML = "";

    const filteredProducts =
      currentFilter === "all"
        ? products
        : products.filter((p) => p.category === currentFilter);

    filteredProducts.forEach((product) => {
      const solValue =
        solPrice > 0 ? (product.price / solPrice).toFixed(2) : "--";

      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.dataset.category = product.category;
      productCard.dataset.price = product.price;

      productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">
                        <span class="usd-price">$${product.price.toLocaleString()}</span>
                        <span class="sol-price">◎${solValue}</span>
                    </div>
                    <button class="add-to-dream" data-id="${
                      product.id
                    }">Add to Dream</button>
                </div>
            `;

      productsGrid.appendChild(productCard);
    });

    // Add event listeners to the new buttons
    document.querySelectorAll(".add-to-dream").forEach((button) => {
      button.addEventListener("click", addToCart);
    });
  }

  function addToCart(e) {
    const productId = parseInt(e.target.dataset.id);
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    // Check if already in cart
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    updateCartDisplay();
    animateAddToCart(e.target);
  }

  function animateAddToCart(button) {
    button.textContent = "Added!";
    button.style.backgroundColor = "#14F195";

    setTimeout(() => {
      button.textContent = "Add to Dream";
      button.style.backgroundColor = "";
    }, 1000);
  }

  function updateCartDisplay() {
    if (cart.length === 0) {
      cartItems.innerHTML =
        '<div class="empty-cart">Your dream is empty... for now</div>';
      usdTotal.textContent = "$0.00";
      solTotal.textContent = "◎0.00";
      daysCounter.textContent = "Start adding items to your dream!";
      return;
    }

    cartItems.innerHTML = "";

    let totalUSD = 0;

    cart.forEach((item) => {
      totalUSD += item.price * item.quantity;
      const solValue = solPrice > 0 ? (item.price / solPrice).toFixed(2) : "--";

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">
                        $${item.price.toLocaleString()} • <span class="sol-price">◎${solValue}</span>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">×</button>
            `;

      cartItems.appendChild(cartItem);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", removeFromCart);
    });

    // Update totals
    usdTotal.textContent = `$${totalUSD.toLocaleString()}`;

    if (solPrice > 0) {
      const totalSOL = totalUSD / solPrice;
      solTotal.textContent = `◎${totalSOL.toFixed(2)}`;
      updateDaysCalculation();
    } else {
      solTotal.textContent = "◎--";
    }
  }

  function removeFromCart(e) {
    const productId = parseInt(e.target.dataset.id);
    cart = cart.filter((item) => item.id !== productId);
    updateCartDisplay();
  }

  function updateDaysCalculation() {
    const dailyIncome = parseFloat(dailyIncomeInput.value) || 0;
    const totalSOL = parseFloat(solTotal.textContent.replace("◎", "")) || 0;

    if (dailyIncome > 0 && totalSOL > 0) {
      const daysNeeded = Math.ceil(totalSOL / dailyIncome);
      daysCounter.innerHTML = `You'll need <span class="sol-gradient">${daysNeeded} days</span> to afford this dream!`;
    } else if (cart.length > 0) {
      daysCounter.textContent = "Enter your daily SOL income to calculate";
    }
  }

  // Update SOL price when received
  window.updateSOLPrice = function (price) {
    solPrice = price;
    document.getElementById(
      "sol-price"
    ).textContent = `1 SOL = $${price.toFixed(2)}`;
    renderProducts();
    updateCartDisplay();
  };
});
