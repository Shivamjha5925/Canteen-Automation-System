const menuContainer = {
  breakfast: document.getElementById("breakfast"),
  fries: document.getElementById("fries"),
  patty: document.getElementById("patty"),
  momo: document.getElementById("momo"),
  burger: document.getElementById("burger"),
  biryani: document.getElementById("biryani"),
  tandoorSnacks: document.getElementById("tandoor-snacks"),
  chinese: document.getElementById("chinese"),
  soups: document.getElementById("soups"),
};
const cartContainer = document.getElementById("cart");
const totalAmount = document.getElementById("totalAmount");

// Initialize Pusher
const pusher = new Pusher('af1de85d6af0f9f6dae9', { cluster: 'ap2' });

// Subscribe to the channel
const channel = pusher.subscribe('order-channel');

// Listen for order updates
channel.bind('order-update', (data) => {
  if (data.status) {
    alert(`Order #${data.orderNumber} is now ${data.status}`);
    console.log(`Order Update: ${data.orderNumber} - ${data.status}`);
  }
});

// Fetch and display menu items
fetch('http://localhost:5000/api/menu')
  .then(response => response.json())
  .then(data => {
    if (data && data.length > 0) {
      data.forEach(item => {
        const menuItem = document.createElement("div");
        menuItem.classList.add("menu-item");
        menuItem.innerHTML = `
          <h3>${item.name}</h3>
          <img src="${item.image}" alt="${item.name}" class="menu-item-image">
          <p>Price: ₹${item.price}</p>
          <button onclick="addToCart(${item.price}, '${item.name}')">Add to Cart</button>
        `;
        
        // Categorize items based on their section
        switch (true) {
          case /Aloo Paratha|Chole Kulche/.test(item.name):
            menuContainer.breakfast.appendChild(menuItem);
            break;
          case /French Fries|Peri Peri Fries/.test(item.name):
            menuContainer.fries.appendChild(menuItem);
            break;
          case /Aloo Patty|Paneer Patty/.test(item.name):
            menuContainer.patty.appendChild(menuItem);
            break;
          case /Veg Steam|Veg Fried|Paneer Steam|Paneer Fried|Chicken Steam|Chicken Fried|Cheese Steam|Cheese Fried/.test(item.name):
            menuContainer.momo.appendChild(menuItem);
            break;
          case /Veg Burger|Paneer Burger|Chicken Burger/.test(item.name):
            menuContainer.burger.appendChild(menuItem);
            break;
          case /Chicken Biryani|Mutton Biryani/.test(item.name):
            menuContainer.biryani.appendChild(menuItem);
            break;
          case /Chicken Tikka|Paneer Tikka|Tandoori Momo veg|Tandoori momo nonveg|Tandoori momo paneer|Afghani Tikka|Afghani momo/.test(item.name):
            menuContainer.tandoorSnacks.appendChild(menuItem);
            break;
          case /Veg Chowmein|Paneer Chowmein|Hakka Noodles|Manchurian Dry|Manchurian Gravy/.test(item.name):
            menuContainer.chinese.appendChild(menuItem);
            break;
          case /Veg Munchow|Chicken Munchow|Hot and Sour|Tomato/.test(item.name):
            menuContainer.soups.appendChild(menuItem);
            break;
        }
      });
    } else {
      Object.values(menuContainer).forEach(container => container.innerHTML = "<p>Menu is currently unavailable.</p>");
    }
  })
  .catch(error => console.error('Error fetching menu:', error));

// Cart and order functionality
let cart = [];
let total = 0;

function addToCart(price, name) {
  cart.push({ name, quantity: 1, price });
  total += price;
  renderCart();
}

function renderCart() {
  cartContainer.innerHTML = "";  // Clear the cart before re-rendering
  cart.forEach((item, index) => {
    const cartItem = document.createElement("li");
    cartItem.innerHTML = `${item.name} - ₹${item.price} <button onclick="removeFromCart(${index})">Remove</button>`;
    cartContainer.appendChild(cartItem);
  });
  totalAmount.textContent = total;
}
function removeFromCart(index) {
  // Remove the item from the cart array
  total -= cart[index].price;  // Subtract the price of the removed item from the total
  cart.splice(index, 1);  // Remove the item by index
  renderCart();  // Re-render the cart after removal
}

function placeOrder() {
  const paymentMethod = document.getElementById("payment-method").value;
  const order = {
    items: cart,
    totalPrice: total,
    paymentMethod: paymentMethod
  };
  fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Order placed successfully!");
      cart = [];
      total = 0;
      renderCart();
    }
  })
  .catch(error => console.error('Error placing order:', error));
}
