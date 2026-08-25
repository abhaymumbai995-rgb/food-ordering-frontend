import { useState } from "react";

function Login({ setPage, setCart, loadUserFavourites }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://food-ordering-backend-9xyo.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await response.json();
       if (response.ok) {
       
  localStorage.setItem("userEmail", data.user.email);
  localStorage.setItem("userRole", data.user.role);
  localStorage.setItem("token", data.token);
  const savedCart = localStorage.getItem(
  `cart_${data.user.email}`
);

setCart(savedCart ? JSON.parse(savedCart) : []);
loadUserFavourites();
setPage("home");
  setMessage(`Welcome, ${data.user.name}! Role: ${data.user.role}`);
}
      
       else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.log(error);
      setMessage("Backend se connection nahi ho raha");
    }

    setLoading(false);
  }

  return (
    <div className="form-box">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
