import { useEffect, useState } from "react";

function Checkout({ cart, total, setCart, setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD"
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  const token = localStorage.getItem("token");

  // Login check
  
if (!token) {
  setPage("login");
  return;
}
  // Load saved profile
  fetch("https://food-ordering-backend-9xyo.onrender.com/api/profile", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.user) {
        setForm((previousForm) => ({
          ...previousForm,
          name: data.user.name || "",
          email: data.user.email || "",
          mobile: data.user.mobile || "",
          address: data.user.address || "",
          city: data.user.city || "",
          pincode: data.user.pincode || ""
        }));
      }
    })
    .catch((error) => {
      console.log("PROFILE ERROR:", error);
    });
}, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

    async function placeOrder(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Login check
    if (!token) {
      setMessage(
        "Please login/register before placing an order."
      );

      setTimeout(() => {
        setPage("login");
      }, 1500);

      return;
    }

    // Form validation
    if (
      !form.name ||
      !form.email ||
      !form.mobile ||
      !form.address ||
      !form.city ||
      !form.pincode
    ) {
      setMessage("Please fill all fields");
      return;
    }

    // Cart check
    if (cart.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://food-ordering-backend-9xyo.onrender.com/api/orders",{
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            customerName: form.name,
            email: form.email,
            mobile: form.mobile,
            address: form.address,
            city: form.city,
            pincode: form.pincode,
            paymentMethod: form.paymentMethod,
            items: cart,
            total: total
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Order placed successfully! 🎉"
        );

        setCart([]);

        setTimeout(() => {
          setPage("home");
        }, 1500);

      } else {
        setMessage(
          data.message || "Order failed"
        );
      }

    } catch (error) {
      console.log("ORDER ERROR:", error);

      setMessage(
        "Backend se connection nahi ho raha"
      );
    }

    setLoading(false);
  }

  return (
    <div className="form-box">
      <h2>Checkout</h2>

      <h3>Order Total: ₹{total}</h3>

      <form onSubmit={placeOrder}>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Delivery Address"
          value={form.address}
          onChange={handleChange}
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
        />
        
<div className="payment-method">
  <h3>Payment Method</h3>

  <label>
    <input
      type="radio"
      name="paymentMethod"
      value="COD"
      checked={form.paymentMethod === "COD"}
      onChange={handleChange}
    />
    💵 Cash on Delivery
  </label>

  <label>
    <input
      type="radio"
      name="paymentMethod"
      value="Online"
      checked={form.paymentMethod === "Online"}
      onChange={handleChange}
    />
    💳 Online Payment
  </label>
</div>    
        <button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>

      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Checkout;
