import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("Loading orders...");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchOrders = () => {
    const token = localStorage.getItem("token");

    fetch("https://food-ordering-backend-9xyo.onrender.com/api/admin/orders",{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
          setMessage(
            data.length === 0 ? "No orders found" : ""
          );
        } else {
          setMessage(
            data.message || "Failed to get orders"
          );
        }
      })
      .catch((error) => {
        console.log(error);
        setMessage(
          "Backend se connection nahi ho raha"
        );
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==================== UPDATE STATUS ====================

  const updateStatus = (orderId, status) => {
    fetch(
     `https://food-ordering-backend-9xyo.onrender.com/api/orders/${orderId}/status` ,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(
            "token"
          )}`
        },

        body: JSON.stringify({ status })
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.order) {
          setOrders((previousOrders) =>
            previousOrders.map((order) =>
              order._id === orderId
                ? data.order
                : order
            )
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ==================== SEARCH + FILTER ====================

  const filteredOrders = orders.filter((order) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      order.customerName
        ?.toLowerCase()
        .includes(searchText) ||

      order.email
        ?.toLowerCase()
        .includes(searchText) ||

      order._id
        ?.toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="orders-box">

      <h2>🛠️ Admin Orders</h2>

      {message && <p>{message}</p>}

      {/* ==================== SEARCH ==================== */}

      <input
        type="text"
        className="search-box"
        placeholder="🔍 Search order / customer / email..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* ==================== STATUS FILTER ==================== */}

      <div className="categories">

        <button
          onClick={() =>
            setStatusFilter("All")
          }
        >
          All
        </button>

        <button
          onClick={() =>
            setStatusFilter("Placed")
          }
        >
          Placed
        </button>

        <button
          onClick={() =>
            setStatusFilter("Confirmed")
          }
        >
          Confirmed
        </button>

        <button
          onClick={() =>
            setStatusFilter("Preparing")
          }
        >
          Preparing
        </button>

        <button
          onClick={() =>
            setStatusFilter("Out for Delivery")
          }
        >
          Out for Delivery
        </button>

        <button
          onClick={() =>
            setStatusFilter("Delivered")
          }
        >
          Delivered
        </button>
        <button
  onClick={() =>
    setStatusFilter("Cancelled")
  }
>
  Cancelled
</button>

      </div>

      {/* ==================== ORDERS ==================== */}

      {filteredOrders.length === 0 ? (

        <p>
          No matching orders found
        </p>

      ) : (

        filteredOrders.map((order) => (

          <div
            className="order-card"
            key={order._id}
          >

            <h3>
              Order #{order._id.slice(-6)}
            </h3>

            {/* DATE & TIME */}

            {order.createdAt && (
              <p>
                <strong>🕐 Date:</strong>{" "}
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>
            )}

            <p>
              <strong>Customer:</strong>{" "}
              {order.customerName}
            </p>
<p>
  <strong>Email:</strong>{" "}
  {order.email}
</p>

<p>
  <strong>📱 Mobile:</strong>{" "}
  {order.mobile || "Not provided"}
</p>

<p>
  <strong>🏠 Address:</strong>{" "}
  {order.address}
</p>

<p>
  <strong>🏙️ City:</strong>{" "}
  {order.city || "Not provided"}
</p>

<p>
  <strong>📮 Pincode:</strong>{" "}
  {order.pincode || "Not provided"}
</p>

<p>
  <strong>💵 Payment Method:</strong>{" "}
  {order.paymentMethod || "COD"}
</p>

<p>
  <strong>⏳ Payment Status:</strong>{" "}
  {order.paymentStatus || "Pending"}
</p>
            
<div className="order-status-display">
  <strong>Delivery Status:</strong>

  <p>
    {order.status === "Placed" && "📦 Order Placed"}
    {order.status === "Confirmed" && "✅ Order Confirmed"}
    {order.status === "Preparing" && "👨‍🍳 Food is Preparing"}
    {order.status === "Out for Delivery" && "🛵 Out for Delivery"}
    {order.status === "Delivered" && "🎉 Order Delivered"}
    {order.status === "Cancelled" && "❌ Order Cancelled"}
  </p>
</div>

            <h4>Items:</h4>

            {order.items.map(
              (item, index) => (
                <p key={index}>
                  {item.image}{" "}
                  {item.name} ×{" "}
                  {item.quantity} — ₹
                  {item.price *
                    item.quantity}
                </p>
              )
            )}

            <h3>
              Total: ₹{order.total}
            </h3>

            {/* STATUS UPDATE */}

            <div className="status-control">
<h4>🚚 Update Delivery Status</h4>
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(
                    order._id,
                    e.target.value
                  )
                }
              >

                <option value="Placed">
                  Placed
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Preparing">
                  Preparing
                </option>

                <option value="Out for Delivery">
                  Out for Delivery
                </option>

                <option value="Delivered">
                  Delivered
                </option>
                <option value="Cancelled">
  Cancelled
</option>

              </select>

            </div>

            <hr />

          </div>

        ))

      )}

    </div>
  );
}

export default AdminOrders;
