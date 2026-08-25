import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./AdminOrders";
import AdminDashboard from "./AdminDashboard";
import AdminFood from "./AdminFood";
import FoodDetails from "./pages/FoodDetails";
import Profile from "./pages/Profile";
import DeliveryDashboard from "./DeliveryDashboard";

function App() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState(() => {
  const email = localStorage.getItem("userEmail");

  if (!email) return [];

  const savedCart = localStorage.getItem(`cart_${email}`);

  return savedCart ? JSON.parse(savedCart) : [];
});
const [wishlist, setWishlist] = useState(() => {
  const email = localStorage.getItem("userEmail");

  if (!email) return [];

  const savedWishlist = localStorage.getItem(`wishlist_${email}`);

  return savedWishlist ? JSON.parse(savedWishlist) : [];
});
useEffect(() => {
  const email = localStorage.getItem("userEmail");

  if (email) {
    localStorage.setItem(`cart_${email}`, JSON.stringify(cart));
    
  }
}, [cart]);
useEffect(() => {
  const email = localStorage.getItem("userEmail");

  if (email) {
    localStorage.setItem(
      `wishlist_${email}`,
      JSON.stringify(wishlist)
    );
  }
}, [wishlist]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState("home");
  const [selectedFood, setSelectedFood] = useState(null);

// ================= FAVOURITES =================
// ================= FAVOURITES =================

const [favourites, setFavourites] = useState(() => {
  const email = localStorage.getItem("userEmail");

  if (!email) return [];

  const saved = localStorage.getItem(
    `favourites_${email}`
  );

  return saved ? JSON.parse(saved) : [];
});

function loadUserFavourites() {
  const email = localStorage.getItem("userEmail");

  if (!email) {
    setFavourites([]);
    return;
  }

  const saved = localStorage.getItem(
    `favourites_${email}`
  );

  setFavourites(saved ? JSON.parse(saved) : []);
}

useEffect(() => {
  const email = localStorage.getItem("userEmail");

  if (email) {
    localStorage.setItem(
      `favourites_${email}`,
      JSON.stringify(favourites)
    );
  }
}, [favourites]);

function isFavourite(foodId) {
  return favourites.some(
    (food) => food._id === foodId
  );
}

function toggleFavourite(food) {
  setFavourites((current) => {
    const alreadyFavourite = current.some(
      (item) => item._id === food._id
    );

    if (alreadyFavourite) {
      return current.filter(
        (item) => item._id !== food._id
      );
    }

    return [...current, food];
  });
}

  // Get foods from MongoDB through backend
  // Get foods from MongoDB through backend
useEffect(() => {
  fetch("https://food-ordering-backend-9xyo.onrender.com/api/foods")
    .then((response) => {
      console.log("STATUS:", response.status);
      return response.json();
    })
    .then((data) => {
      console.log("FOODS:", data);

      if (Array.isArray(data)) {
        setFoods(data);
      } else {
        console.log("Food data array nahi hai:", data);
        setFoods([]);
      }
    })
    .catch((error) => {
      console.log("Food fetch error:", error);
    });
}, []);

function addToCart(food) {
  setCart((currentCart) => {
    const existingItem = currentCart.find(
      (item) => item.name === food.name
    );

    if (existingItem) {
      return currentCart.map((item) =>
        item.name === food.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...currentCart, { ...food, quantity: 1 }];
  });
}
  

  function increaseQuantity(name) {
    setCart(
      cart.map((item) =>
        item.name === name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(name) {
    setCart(
      cart
        .map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(name) {
    setCart(cart.filter((item) => item.name !== name));
  }
  function toggleWishlist(food) {
  setWishlist((currentWishlist) => {
    const alreadyFavorite = currentWishlist.some(
      (item) => item._id === food._id
    );

    if (alreadyFavorite) {
      return currentWishlist.filter(
        (item) => item._id !== food._id
      );
    }

    return [...currentWishlist, food];
  });
}
function isInWishlist(foodId) {
  return wishlist.some(
    (item) => item._id === foodId
  );
}
  const filteredFoods = foods.filter((food) => {
  const matchesSearch = food.name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesCategory =
    category === "All" || food.category === category;

  return matchesSearch && matchesCategory;
});
  
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="app">
    <Navbar
  setPage={setPage}
  cartCount={cartCount}
  setCart={setCart}
/>
     {page === "login" && (
  <Login
    setPage={setPage}
    setCart={setCart}
    loadUserFavourites={loadUserFavourites}
  />
)} 

{page === "register" && <Register />}

{page === "profile" && (
  <Profile setPage={setPage} />
)}

{page === "orders" && <MyOrders />}
{page === "favourites" && (
  <div className="favourites-page">

    <h1>❤️ My Favourites</h1>

    {favourites.length === 0 ? (
      <div className="empty-favourites">
        <div className="empty-heart">♡</div>

        <h2>No Favourite Foods Yet</h2>

        <p>
          Save your favourite foods here and
          order them anytime.
        </p>

        <button onClick={() => setPage("home")}>
          🍔 Explore Food
        </button>
      </div>
    ) : (
      <div className="food-list">

        {favourites.map((food) => (
          <div
            className="food-card"
            key={food._id}
          >

            <button
  type="button"
  className="favourite-btn active"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite(food);
  }}
>
  ❤️
</button>

            <div className="food-image">
              {food.image}
            </div>

            <h3>{food.name}</h3>

            <p>₹{food.price}</p>
<button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(food);
  }}
>
  🛒 Add to Cart
</button>
            
          </div>
        ))}

      </div>
    )}

  </div>
)}
{page === "deliverydashboard" &&
  localStorage.getItem("userRole") === "delivery" && (
    <DeliveryDashboard />
  )}
      {page === "admindashboard" &&
  localStorage.getItem("userRole") === "admin" && (
    <AdminDashboard />
)}
{page === "adminfood" &&
  localStorage.getItem("userRole") === "admin" && (
    <AdminFood />
)}
      {page === "adminorders" &&
  localStorage.getItem("userRole") === "admin" && (
    <AdminOrders />
)}

{page === "food-details" && (
  <FoodDetails
    food={selectedFood}
    addToCart={addToCart}
    setPage={setPage}
  />
)}

      {page === "cart" && (
  <div className="cart-box">
    {cart.length === 0 ? (
      <p>Cart is empty</p>
    ) : (
      <>
        {cart.map((item) => (
          <div className="cart-item" key={item._id}>
            <h3>
              {item.image} {item.name}
            </h3>

            <p>₹{item.price}</p>

            <button onClick={() => decreaseQuantity(item.name)}>
              −
            </button>

            <span> {item.quantity} </span>

            <button onClick={() => increaseQuantity(item.name)}>
              +
            </button>

            <button onClick={() => removeItem(item.name)}>
              Remove
            </button>
          </div>
        ))}

        <h2>Total: ₹{total}</h2>

        <button onClick={() => setPage("checkout")}>
          Proceed to Checkout
        </button>
      </>
    )}
  </div>
)}
  
      {page === "checkout" && (
  <Checkout
    cart={cart}
    total={total}
    setCart={setCart}
    setPage={setPage}
  />
)}
{page === "home" && (
  <>
    {/* ================= HERO SECTION ================= */}

    <section className="hero-section">

      <div className="hero-content">

        <p className="hero-badge">
          🔥 Fresh & Delicious
        </p>

        <h1>
          Delicious Food,
          <br />
          Delivered Fast 🚀
        </h1>

        <p className="hero-text">
          Order your favourite food from FoodApp.
          Fresh, tasty and affordable food delivered
          straight to your door.
        </p>

        <div className="hero-buttons">

          <button
            onClick={() =>
              document
                .getElementById("food-menu")
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            🍔 Order Now
          </button>

          <button
            className="hero-secondary-button"
            onClick={() =>
              document
                .getElementById("food-menu")
                ?.scrollIntoView({
                  behavior: "smooth"
                })
            }
          >
            🔎 Explore Menu
          </button>

        </div>

      </div>

      <div className="hero-food">
        🍕
      </div>

    </section>

    {/* ================= CART COUNT ================= */}
    
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />

          {/* Categories */}
          
          <div className="categories">
  <button onClick={() => setCategory("All")}>
    All
  </button>

  <button onClick={() => setCategory("Pizza")}>
    Pizza
  </button>

  <button onClick={() => setCategory("Burger")}>
    Burger
  </button>

  <button onClick={() => setCategory("Biryani")}>
    Biryani
  </button>

  <button onClick={() => setCategory("Noodles")}>
    Noodles
  </button>
</div>
         
          {/* Food Cards */}
          {/* Food Cards */}
<div id="food-menu" className="food-list">

  {filteredFoods.map((food) => (

    <div
      className="food-card"
      key={food._id}
      onClick={() => {
        setSelectedFood(food);
        setPage("food-details");
      }}
    >

      <button
        className={`favourite-btn ${
          isFavourite(food._id) ? "active" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavourite(food);
        }}
      >
        {isFavourite(food._id) ? "❤️" : "♡"}
      </button>

      <div className="food-image">
        {food.image}
      </div>

      <h3>{food.name}</h3>

      <p>₹{food.price}</p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          addToCart(food);
        }}
      >
        Add to Cart
      </button>

    </div>

  ))}

</div>
{/* ================= SPECIAL OFFER ================= */}

<section className="special-offer">

  <div>
    <p className="offer-small">🔥 TODAY'S SPECIAL</p>

    <h2>Hungry? We've Got You Covered! 🍕</h2>

    <p>
      Enjoy delicious food at amazing prices.
      Order your favourite meal today!
    </p>

    <button
      onClick={() =>
        document
          .getElementById("food-menu")
          ?.scrollIntoView({
            behavior: "smooth"
          })
      }
    >
      🍔 Order Now
    </button>
  </div>

  <div className="offer-emoji">
    🍕🍔
  </div>

</section>


{/* ================= WHY CHOOSE US ================= */}

<section className="why-section">

  <h2>⭐ Why Choose FoodApp?</h2>

  <p className="section-subtitle">
    Everything you need for a great food experience.
  </p>

  <div className="why-grid">

    <div className="why-card">
      <div>🚚</div>
      <h3>Fast Delivery</h3>
      <p>
        Get your favourite food delivered quickly
        to your doorstep.
      </p>
    </div>

    <div className="why-card">
      <div>🍽️</div>
      <h3>Fresh Food</h3>
      <p>
        Fresh and delicious food prepared
        with quality ingredients.
      </p>
    </div>

    <div className="why-card">
      <div>💰</div>
      <h3>Best Prices</h3>
      <p>
        Delicious meals at affordable prices
        for everyone.
      </p>
    </div>

    <div className="why-card">
      <div>🔒</div>
      <h3>Secure Ordering</h3>
      <p>
        Your account and order information
        stays protected.
      </p>
    </div>

  </div>

</section>
{/* ================= CUSTOMER REVIEWS ================= */}

<section className="reviews-section">

  <h2>💬 What Our Customers Say</h2>

  <p className="section-subtitle">
    Loved by food lovers ❤️
  </p>

  <div className="reviews-grid">

    <div className="review-card">
      <div className="review-stars">
        ⭐⭐⭐⭐⭐
      </div>

      <p>
        "Food was very tasty and delivery was
        super fast. I really enjoyed it!"
      </p>

      <h3>👤 Rahul</h3>
      <span>Happy Customer</span>
    </div>


    <div className="review-card">
      <div className="review-stars">
        ⭐⭐⭐⭐⭐
      </div>

      <p>
        "The food quality was excellent and
        the prices were also very reasonable."
      </p>

      <h3>👤 Priya</h3>
      <span>Happy Customer</span>
    </div>


    <div className="review-card">
      <div className="review-stars">
        ⭐⭐⭐⭐⭐
      </div>

      <p>
        "Very easy to order and the food arrived
        fresh and hot. Highly recommended!"
      </p>

      <h3>👤 Aman</h3>
      <span>Happy Customer</span>
    </div>

  </div>

</section>
{/* ================= ORDER CTA ================= */}

<section className="order-cta">

  <div className="cta-content">

    <p className="cta-badge">
      🍔 READY TO ORDER?
    </p>

    <h2>
      Your Favourite Food
      <br />
      Is Just One Click Away! 🚀
    </h2>

    <p>
      Choose your favourite meal and enjoy
      delicious food at your doorstep.
    </p>

    <button
      onClick={() =>
        document
          .getElementById("food-menu")
          ?.scrollIntoView({
            behavior: "smooth"
          })
      }
    >
      🍕 Order Your Food
    </button>

  </div>

  <div className="cta-emoji">
    🍕🍔🍛
  </div>

</section>

{/* ================= FOOTER ================= */}

<footer className="footer">

  <div className="footer-grid">

    <div className="footer-about">
      <h2>🍔 FoodApp</h2>

      <p>
        Delicious food, fresh ingredients and
        fast delivery — all in one place.
      </p>
    </div>

    <div className="footer-links">
  <h3>Quick Links</h3>

  <button
    onClick={() => {
      setPage("home");
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }}
  >
    🏠 Home
  </button>

  <button
    onClick={() => {
      setPage("cart");
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }}
  >
    🛒 Cart
  </button>

  {localStorage.getItem("userEmail") && (
    <button
      onClick={() => {
        setPage("orders");
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }}
    >
      📦 My Orders
    </button>
  )}
</div>

    <div className="footer-help">
      <h3>Help & Support</h3>

      <p>📞 Contact Us</p>
      <p>📧 support@foodapp.com</p>
      <p>🕐 10 AM - 10 PM</p>
    </div>

    <div className="footer-social">
      <h3>Follow Us</h3>

      <div className="social-icons">
        <span>📘</span>
        <span>📸</span>
        <span>🐦</span>
        <span>▶️</span>
      </div>
    </div>

  </div>

  <hr />

  <div className="footer-bottom">
  <p>© 2026 FoodApp. All Rights Reserved.</p>

  <p>Made with ❤️ for food lovers</p>
</div>

</footer>

  </>
)}

</div>
);
}

export default App;
