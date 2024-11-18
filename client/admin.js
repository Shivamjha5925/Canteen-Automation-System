const ordersContainer = document.getElementById("orders");
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
    console.log(`Updating Order ID: ${orderId} to status: ${status}`); // Debug log
    fetch(`http://localhost:5000/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log the response from the server
        if (data._id) {
          document.getElementById(`status-${data._id}`).textContent = data.orderStatus;
          alert(`Order ${data._id} updated to ${data.orderStatus}`);
        } else {
          alert('Failed to update order status');
        }
      })
      .catch(error => console.error('Error:', error));
  }
  