import { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setMessage("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
      "https://food-ordering-backend-9xyo.onrender.com/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! 🎉");

        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Backend se connection nahi ho raha");
      console.log(error);
    }

    setLoading(false);
  }

  return (
    <div className="form-box">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Name"
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
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
