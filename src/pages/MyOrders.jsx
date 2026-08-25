import { useEffect, useState } from "react";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("Loading orders...");
  const [activeView, setActiveView] = useState({});

  const statusOrder = [
    "Placed",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  const statusData = {
    Placed: {
      icon: "📦",
      title: "Order Placed",
      text: "We've received your order",
    },
    Confirmed: {
      icon: "✓",
      title: "Confirmed",
      text: "Restaurant confirmed your order",
    },
    Preparing: {
      icon: "👨‍🍳",
      title: "Preparing",
      text: "Your food is being prepared",
    },
    "Out for Delivery": {
      icon: "🛵",
      title: "On the way",
      text: "Delivery partner is on the way",
    },
    Delivered: {
      icon: "✓",
      title: "Delivered",
      text: "Enjoy your delicious meal!",
    },
  };

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    if (!email) {
      setMessage("Please login first");
      return;
    }

    fetch(
       `https://food-ordering-backend-9xyo.onrender.com/api/orders?email =${encodeURIComponent(email)}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
          setMessage(data.length ? "" : "No orders found");
        } else {
          setMessage(data.message || "Failed to get orders");
        }
      })
      .catch((error) => {
        console.log(error);
        setMessage("Backend se connection nahi ho raha");
      });
  }, []);

  const changeView = (id, view) => {
    setActiveView((prev) => ({
      ...prev,
      [id]: view,
    }));
  };

  const cancelOrder = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      const response = await fetch(`https://food-ordering-backend-9xyo.onrender.com/api/orders/${id}/cancel`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (data.order) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? data.order : order
          )
        );
      } else {
        alert(data.message || "Order cancel nahi ho raha");
      }
    } catch (error) {
      console.log(error);
      alert("Order cancel nahi ho raha");
    }
  };

  function Tracking({ order }) {
    const currentIndex = statusOrder.indexOf(order.status);

    const progress =
      currentIndex <= 0
        ? 0
        : (currentIndex / (statusOrder.length - 1)) * 100;

    const current =
      statusData[order.status] || statusData.Placed;

    return (
      <div className="tracking-panel">

        <div className="tracking-current">

          <div className="tracking-current-icon">
            {current.icon}
          </div>

          <div className="tracking-current-text">
            <span>ORDER STATUS</span>
            <h4>{current.title}</h4>
            <p>{current.text}</p>
          </div>

          <div className="live-badge">
            <i></i>
            LIVE
          </div>

        </div>

        <div className="tracking-timeline">

          <div className="timeline-base"></div>

          <div
            className="timeline-fill"
            style={{
              width: `${progress}%`,
            }}
          ></div>

          {statusOrder.map((status, index) => {

            const completed =
              index < currentIndex;

            const active =
              index === currentIndex;

            return (
              <div
                key={status}
                className={`timeline-step
                  ${completed ? "completed" : ""}
                  ${active ? "active" : ""}
                `}
              >

                <div className="timeline-dot">

                  {completed && "✓"}

                  {active &&
                    status === "Preparing" &&
                    "👨‍🍳"}

                  {active &&
                    status === "Out for Delivery" &&
                    "🛵"}

                  {active &&
                    status === "Placed" &&
                    "📦"}

                  {active &&
                    status === "Confirmed" &&
                    "✓"}

                  {active &&
                    status === "Delivered" &&
                    "✓"}

                </div>

                <small>
                  {status === "Out for Delivery"
                    ? "On Way"
                    : status}
                </small>

              </div>
            );
          })}

        </div>

        {order.status === "Out for Delivery" && (
          <div className="delivery-moving">

            <div className="road">
              <span className="moving-bike">
                🛵
              </span>
            </div>

            <div className="delivery-text">
              <strong>Your food is on the way</strong>
              <span>Delivery partner is moving towards you</span>
            </div>

          </div>
        )}

      </div>
    );
  }
  function Details({ order }) {

    const calculatedTotal =
      order.items?.reduce((sum, item) => {
        const quantity = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;

        return sum + price * quantity;
      }, 0) || 0;

    return (
      <div className="order-details-wrapper">

        <div className="details-panel">

          <div className="detail-row">
            <span>🆔 Order ID</span>
            <strong>#{order._id}</strong>
          </div>

          <div className="detail-row">
            <span>📅 Order Date</span>
            <strong>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "Today"}
            </strong>
          </div>

          <div className="detail-row">
            <span>📱 Mobile</span>
            <strong>
              {order.mobile || "Not provided"}
            </strong>
          </div>

          <div className="detail-row">
            <span>💳 Payment</span>
            <strong>
              {order.paymentMethod || "COD"}
            </strong>
          </div>

          <div className="detail-row address-row">
            <span>🏠 Delivery Address</span>

            <strong>
              {[
                order.address,
                order.city,
                order.pincode,
              ]
                .filter(Boolean)
                .join(", ") || "Not provided"}
            </strong>
          </div>

        </div>


        {/* ORDER ITEMS */}

        <div className="order-items-details">

          <h4>🍽️ Order Items</h4>

          {order.items?.map((item, index) => {

            const quantity =
              Number(item.quantity) || 1;

            const unitPrice =
              Number(item.price) || 0;

            const itemTotal =
              quantity * unitPrice;

            return (
              <div
                className="order-detail-item"
                key={index}
              >

                <div className="order-detail-food">

                  <div className="order-detail-image">
                    {item.image || "🍔"}
                  </div>

                  <div>

                    <strong>
                      {item.name || "Food Item"}
                    </strong>

                    <span>
                      ₹{unitPrice} × {quantity}
                    </span>

                  </div>

                </div>

                <strong>
                  ₹{itemTotal}
                </strong>

              </div>
            );
          })}

        </div>


        {/* TOTAL */}

        <div className="order-total-details">

          <span>Total Amount</span>

          <strong>
            ₹{calculatedTotal}
          </strong>

        </div>

      </div>
    );
  }
  
  return (
    <div className="orders-box">

      <div className="orders-title">

        <div>
          <h2>My Orders</h2>
          <p>Track your food delivery</p>
        </div>

        <span className="order-count">
          {orders.length} Orders
        </span>

      </div>

      {message && (
        <div className="orders-message">
          {message}
        </div>
      )}

      <div className="my-orders-list">

        {orders.map((order) => {

          const view =
            activeView[order._id] || "tracking";

          const canCancel =
            order.status === "Placed" ||
            order.status === "Confirmed";

          return (
            <div
              className="premium-order-card"
              key={order._id}
            >

              {/* HEADER */}

              <div className="premium-card-header">

                <div className="order-main-info">

                  <div className="order-box-icon">
                    📦
                  </div>

                  <div>
                    <small>ORDER</small>

                    <h3>
                      #{order._id.slice(-6)}
                    </h3>

                    <span>
                      {order.items?.length || 0} items
                    </span>
                  </div>

                </div>

                <div className="order-money">

                  <small>Total</small>

                  <strong>
                    ₹{order.total}
                  </strong>

                </div>

              </div>


              {/* ITEM PREVIEW */}

              <div className="order-item-preview">

                <div className="preview-food">

                  <span>
                    {order.items?.[0]?.image || "🍔"}
                  </span>

                  <div>
                    <strong>
                      {order.items?.[0]?.name ||
                        "Food Order"}
                    </strong>

                    {order.items?.length > 1 && (
                      <small>
                        +{order.items.length - 1} more items
                      </small>
                    )}
                  </div>

                </div>

                <span className="order-date">
                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleDateString()
                    : "Today"}
                </span>

              </div>


              {/* CONTENT - SAME CARD */}

              <div className="premium-card-content">

                {view === "tracking" ? (
                  <Tracking order={order} />
                ) : (
                  <Details order={order} />
                )}

              </div>


              {/* BUTTON BAR */}

              <div className="premium-action-bar">

                <button
                  className={
                    view === "tracking"
                      ? "premium-action active"
                      : "premium-action"
                  }
                  onClick={() =>
                    changeView(
                      order._id,
                      "tracking"
                    )
                  }
                >
                  <span>🚚</span>
                  Tracking
                </button>

                <button
                  className={
                    view === "details"
                      ? "premium-action active"
                      : "premium-action"
                  }
                  onClick={() =>
                    changeView(
                      order._id,
                      "details"
                    )
                  }
                >
                  <span>👤</span>
                  Details
                </button>

                {canCancel && (
                  <button
                    className="premium-cancel"
                    onClick={() =>
                      cancelOrder(order._id)
                    }
                  >
                    ✕ Cancel
                  </button>
                )}

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}

export default MyOrders;
