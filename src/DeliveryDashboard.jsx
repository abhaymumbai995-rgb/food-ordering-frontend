import { useEffect, useState } from "react";

const ORDERS_URL =
  "https://food-ordering-backend-9xyo.onrender.com/api/admin/orders";

function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("Loading deliveries...");

  useEffect(() => {
    fetch(ORDERS_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setMessage(data.message || "Unable to load deliveries.");
          return;
        }

        const activeOrders = data.filter((order) =>
          ["Confirmed", "Preparing", "Out for Delivery"].includes(
            order.status
          )
        );

        setOrders(activeOrders);
        setMessage(
          activeOrders.length === 0 ? "No active deliveries right now." : ""
        );
      })
      .catch(() => {
        setMessage("Unable to connect to the delivery service.");
      });
  }, []);

  return (
    <section className="orders-box">
      <h2>🛵 Delivery Dashboard</h2>
      {message && <p>{message}</p>}

      {orders.map((order) => (
        <article className="order-card delivery-order-card" key={order._id}>
          <div className="delivery-order-header">
            <div>
              <h3>Order #{order._id.slice(-6)}</h3>
              {order.createdAt && (
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              )}
            </div>
            <span className="delivery-total">₹{order.total}</span>
          </div>

          <div className="delivery-user-details">
            <h4>Delivery Details</h4>
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Mobile:</strong> {order.mobile || "Not provided"}</p>
            <p>
              <strong>Address:</strong> {order.address}, {order.city} {order.pincode}
            </p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>

          <div className="delivery-items">
            {(order.items || []).map((item, index) => (
              <p key={`${order._id}-${index}`}>
                {item.image} {item.name} × {item.quantity}
              </p>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

export default DeliveryDashboard;
