import { useEffect, useState } from "react";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [message, setMessage] = useState("Loading dashboard...");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const token = localStorage.getItem("token");

      const ordersResponse = await fetch(
        "https://food-ordering-backend-9xyo.onrender.com/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const ordersData = await ordersResponse.json();

      if (!ordersResponse.ok) {
        setMessage(
          ordersData.message || "Orders load nahi ho rahe"
        );
        return;
      }

      const foodsResponse = await fetch(
        "https://food-ordering-backend-9xyo.onrender.com/api/foods"
      );

      const foodsData = await foodsResponse.json();

      if (!foodsResponse.ok) {
        setMessage(
          foodsData.message || "Foods load nahi ho rahe"
        );
        return;
      }

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setFoods(Array.isArray(foodsData) ? foodsData : []);
      setMessage("");

    } catch (error) {
      console.log("Dashboard error:", error);
      setMessage("Backend se connection nahi ho raha");
    }
  }

  // ==================== BASIC STATS ====================

  const totalOrders = orders.length;

  const totalFoods = foods.length;

  const placedOrders = orders.filter(
    (order) => order.status === "Placed"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  // ==================== TODAY ====================

  const today = new Date();

  const todayOrders = orders.filter((order) => {
    if (!order.createdAt) return false;

    const orderDate = new Date(order.createdAt);

    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  });

  const todayOrderCount = todayOrders.length;

  const todaySales = todayOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  // ==================== PENDING ====================

  const pendingOrders = orders.filter(
    (order) =>
      order.status !== "Delivered"
  ).length;

  // ==================== RECENT ORDERS ====================

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="orders-box">

      <h2>📊 Admin Dashboard</h2>

      {message && <p>{message}</p>}

      {/* ==================== DASHBOARD CARDS ==================== */}

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h3>📦 Total Orders</h3>
          <strong>{totalOrders}</strong>
        </div>

        <div className="dashboard-card">
          <h3>🍔 Total Foods</h3>
          <strong>{totalFoods}</strong>
        </div>

        <div className="dashboard-card">
          <h3>📝 Placed Orders</h3>
          <strong>{placedOrders}</strong>
        </div>

        <div className="dashboard-card">
          <h3>👨‍🍳 Preparing Orders</h3>
          <strong>{preparingOrders}</strong>
        </div>

        <div className="dashboard-card">
          <h3>🚚 Delivered Orders</h3>
          <strong>{deliveredOrders}</strong>
        </div>

        <div className="dashboard-card">
          <h3>💰 Total Revenue</h3>
          <strong>₹{totalRevenue}</strong>
        </div>

        <div className="dashboard-card">
          <h3>📅 Today's Orders</h3>
          <strong>{todayOrderCount}</strong>
        </div>

        <div className="dashboard-card">
          <h3>💵 Today's Sales</h3>
          <strong>₹{todaySales}</strong>
        </div>

        <div className="dashboard-card">
          <h3>⏳ Pending Orders</h3>
          <strong>{pendingOrders}</strong>
        </div>

      </div>

      {/* ==================== RECENT ORDERS ==================== */}

      <div className="recent-orders">

        <h2>🕐 Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p>No recent orders</p>
        ) : (

          recentOrders.map((order) => (

            <div
              className="recent-order-card"
              key={order._id}
            >

              <div>
                <strong>
                  Order #{order._id.slice(-6)}
                </strong>

                <p>
                  👤 {order.customerName}
                </p>
              </div>

              <div>
                <strong>
                  ₹{order.total}
                </strong>

                <p>
                  Status: {order.status}
                </p>
              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;
