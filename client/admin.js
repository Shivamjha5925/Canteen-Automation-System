const ordersContainer = document.getElementById("orders");
const API_BASE_URL = 'http://localhost:5000';

fetch(`${API_BASE_URL}/orders`)
//`₹${item.price}`

// Fetch and display orders
fetch('http://localhost:5000/orders')
  .then(response => response.json())
  .then(data => {
    if (data.length > 0) {
      data.forEach(order => {
        const orderElement = document.createElement("div");
        orderElement.classList.add("order");
        orderElement.innerHTML = `
  <p>Order ID: ${order.orderNumber}</p>  <!-- Updated to display orderNumber -->
  <p>Total Price: ₹${order.totalPrice}</p>
  <p>Status: <span id="status-${order._id}">${order.orderStatus}</span></p>
  <button onclick="updateOrderStatus('${order._id}', 'in-progress')">Mark as In Progress</button>
  <button onclick="updateOrderStatus('${order._id}', 'completed')">Mark as Completed</button>
  <button onclick="updateOrderStatus('${order._id}', 'cancelled')">Mark as Cancelled</button>
  <hr>
`;


        ordersContainer.appendChild(orderElement);
      });
    } else {
      ordersContainer.innerHTML = "<p>No orders found.</p>";
    }
  })
  .catch(err => console.error('Error fetching orders:', err));


// Function to update order status
function updateOrderStatus(orderId, status) {
  console.log(`Updating Order ID: ${orderId} to status: ${status}`);
  fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, { // Use the base URL here too!
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
  })
  .then(response => {
      if (!response.ok) {
          return response.text().then(text => { throw new Error(text) })
      }
      return response.json();
  })
  .then(data => {
      console.log("Response from server:", data); // Very helpful for debugging
      if (data && data._id) { // Check if data and data._id exist
          const statusSpan = document.getElementById(`status-${data._id}`);
          if (statusSpan) { // Check if the element exists
              statusSpan.textContent = data.orderStatus;
              alert(`Order ${data._id} updated to ${data.orderStatus}`);
          } else {
              console.error("Status span element not found:", `status-${data._id}`);
              alert("Failed to update order status on page. Please refresh.");
          }
      } else {
         alert('Failed to update order status. Please check the console for errors.');
      }
  })
  .catch(error => console.error('Error:', error));
}