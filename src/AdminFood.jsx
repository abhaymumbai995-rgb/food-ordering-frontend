import { useEffect, useState } from "react";

function AdminFood() {
  const [foods, setFoods] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Pizza");
  const [image, setImage] = useState("");

  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const token = localStorage.getItem("token");

  // ==================== GET FOODS ====================

  async function loadFoods() {
    try {
      const response = await fetch(
        "https://food-ordering-backend-9xyo.onrender.com/api/foods"
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setFoods(data);
      }
    } catch (error) {
      console.log("Food load error:", error);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  // ==================== ADD / EDIT FOOD ====================

  async function saveFood(e) {
    e.preventDefault();

    if (!name || !price || !category || !image) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const url = editId
        ? `https://food-ordering-backend-9xyo.onrender.com/api/foods/${editId}`
        : "https://food-ordering-backend-9xyo.onrender.com/api/foods";

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
          name,
          price: Number(price),
          category,
          image
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          editId
            ? "Food updated successfully! ✅"
            : "Food added successfully! ✅"
        );

        clearForm();
        loadFoods();
      } else {
        setMessage(data.message || "Operation failed");
      }

    } catch (error) {
      console.log(error);
      setMessage("Backend se connection nahi ho raha");
    }
  }

  // ==================== EDIT ====================

  function editFood(food) {
    setEditId(food._id);
    setName(food.name);
    setPrice(food.price);
    setCategory(food.category);
    setImage(food.image);
    setMessage("");
  }

  // ==================== DELETE ====================

  async function deleteFood(id) {
    const confirmDelete = window.confirm(
      "Kya aap ye food delete karna chahte ho?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://food-ordering-backend-9xyo.onrender.com/api/foods/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Food deleted successfully! ✅");
        loadFoods();
      } else {
        setMessage(data.message || "Delete failed");
      }

    } catch (error) {
      console.log(error);
      setMessage("Backend se connection nahi ho raha");
    }
  }

  // ==================== CLEAR FORM ====================

  function clearForm() {
    setEditId(null);
    setName("");
    setPrice("");
    setCategory("Pizza");
    setImage("");
  }

  // ==================== SEARCH + FILTER ====================

  const filteredFoods = foods.filter((food) => {

    const matchesSearch =
      food.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      food.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="form-box">

      <h2>🍔 Food Management</h2>

      {/* ==================== ADD / EDIT ==================== */}

      <h3>
        {editId ? "✏️ Edit Food" : "➕ Add Food"}
      </h3>

      <form onSubmit={saveFood}>

        <input
          type="text"
          placeholder="Food name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="Pizza">Pizza</option>
          <option value="Burger">Burger</option>
          <option value="Biryani">Biryani</option>
          <option value="Noodles">Noodles</option>
        </select>

        <input
          type="text"
          placeholder="Food emoji/image"
          value={image}
          onChange={(e) =>
            setImage(e.target.value)
          }
        />

        <button type="submit">
          {editId ? "Update Food" : "Add Food"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={clearForm}
          >
            Cancel
          </button>
        )}

      </form>

      {message && <p>{message}</p>}

      {/* ==================== FOOD LIST ==================== */}

      <h3>📋 Food List</h3>

      {/* SEARCH */}

      <input
        type="text"
        className="search-box"
        placeholder="🔍 Search food..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* CATEGORY FILTER */}

      <div className="categories">

        <button
          onClick={() =>
            setCategoryFilter("All")
          }
        >
          All
        </button>

        <button
          onClick={() =>
            setCategoryFilter("Pizza")
          }
        >
          Pizza
        </button>

        <button
          onClick={() =>
            setCategoryFilter("Burger")
          }
        >
          Burger
        </button>

        <button
          onClick={() =>
            setCategoryFilter("Biryani")
          }
        >
          Biryani
        </button>

        <button
          onClick={() =>
            setCategoryFilter("Noodles")
          }
        >
          Noodles
        </button>

      </div>

      {/* FOOD CARDS */}

      <div className="admin-food-list">

        {filteredFoods.length === 0 ? (

          <p>No matching food found</p>

        ) : (

          filteredFoods.map((food) => (

            <div
              className="admin-food-card"
              key={food._id}
            >

              <div className="admin-food-image">
                {food.image}
              </div>

              <h3>{food.name}</h3>

              <p>₹{food.price}</p>

              <p>
                Category: {food.category}
              </p>

              <button
                onClick={() =>
                  editFood(food)
                }
              >
                ✏️ Edit
              </button>

              <button
                onClick={() =>
                  deleteFood(food._id)
                }
              >
                🗑️ Delete
              </button>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default AdminFood;
