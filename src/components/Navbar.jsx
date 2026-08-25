import { useEffect, useState } from "react";

function Navbar({
  setPage,
  cartCount,
  setCart,
  setFavourites
}) { 
  const [menuOpen, setMenuOpen] = useState(false);

useEffect(() => {
  if (menuOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [menuOpen]);

  const isLoggedIn = localStorage.getItem("userEmail");
  const isAdmin =
    localStorage.getItem("userRole") === "admin";

  const isDelivery =
    localStorage.getItem("userRole") === "delivery";

  const goToPage = (page) => {
  setMenuOpen(false);
  setPage(page);
};
const logout = () => {
  // Menu immediately close
  setMenuOpen(false);

  // Clear user data
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");

  // Clear cart & favourites
  setCart([]);
  setFavourites([]);

  // Go to login
  setPage("login");
};
  
  return (
    <>
      <nav className="navbar">

        <h2>🍔 FoodApp</h2>

        {/* CART */}
        <button
          className={`navbar-cart ${
            cartCount > 0 ? "cart-active" : ""
          }`}
          onClick={() => setPage("cart")}
        >
          🛒

          {cartCount > 0 && (
            <span className="navbar-cart-count">
              {cartCount}
            </span>
          )}
        </button>

        {/* HAMBURGER */}
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={
            menuOpen ? "Close menu" : "Open menu"
          }
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </nav>

      {/* DARK OVERLAY */}
      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* MOBILE MENU */}
      <div
        className={`mobile-menu ${
          menuOpen ? "open" : ""
        }`}
      >

        <div className="mobile-menu-header">

          <h3>🍔 FoodApp</h3>

          <button
            className="menu-close"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>

        </div>

        <div className="mobile-menu-links">

          {/* HOME */}
          <button
            onClick={() => goToPage("home")}
          >
            🏠 Home
          </button>

          {/* CART */}
          <button
            onClick={() => goToPage("cart")}
          >
            🛒 Cart
          </button>
{/* FAVOURITES */}
<button
  onClick={() => goToPage("favourites")}
>
  ❤️ Favourites
</button>
          {/* MY PROFILE */}
          {isLoggedIn && (
            <button
              onClick={() => goToPage("profile")}
            >
              👤 My Profile
            </button>
          )}

          {/* MY ORDERS */}
          {isLoggedIn && (
            <button
              onClick={() => goToPage("orders")}
            >
              📦 My Orders
            </button>
          )}

          {/* LOGIN / REGISTER */}
          {!isLoggedIn && (
            <>
              <button
                onClick={() => goToPage("login")}
              >
                🔐 Login
              </button>

              <button
                onClick={() => goToPage("register")}
              >
                📝 Register
              </button>
            </>
          )}

          {/* ADMIN MENU */}
          {isAdmin && (
            <>
              <button
                onClick={() =>
                  goToPage("admindashboard")
                }
              >
                📊 Admin Dashboard
              </button>

              <button
                onClick={() =>
                  goToPage("adminorders")
                }
              >
                🛠️ Admin Orders
              </button>

              <button
                onClick={() =>
                  goToPage("adminfood")
                }
              >
                🍔 Food Management
              </button>
            </>
          )}

          {/* DELIVERY MENU */}
          {isDelivery && (
            <button
              onClick={() =>
                goToPage("deliverydashboard")
              }
            >
              🛵 Delivery Dashboard
            </button>
          )}

          {/* LOGOUT */}
          {isLoggedIn && (
            <button
              className="logout-button"
              onClick={logout}
            >
              🚪 Logout
            </button>
          )}

        </div>

      </div>
    </>
  );
}

export default Navbar;
