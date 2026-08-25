import { useState } from "react";

function FoodDetails({ food, addToCart, setPage }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!food) {
    return (
      <div className="food-details-empty">
        <h2>Food not found</h2>

        <button onClick={() => setPage("home")}>
          ← Back to Home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
  for (let i = 0; i < quantity; i++) {
    addToCart(food);
  }

  setAdded(true);

  setTimeout(() => {
    setAdded(false);
  }, 1500);
};

  return (
    <div className="food-details-page">

      <button
        className="food-back-button"
        onClick={() => setPage("home")}
      >
        ← Back to Home
      </button>

      <div className="food-details-card">

        <div className="food-details-image">
          {food.image}
        </div>

        <div className="food-details-info">

          <p className="food-details-category">
            🍽️ {food.category || "Delicious Food"}
          </p>

          <h1>{food.name}</h1>

          <h2>₹{food.price}</h2>

          <p className="food-details-description">
            Enjoy our delicious {food.name}, prepared with
            fresh ingredients and amazing taste. Perfect for
            satisfying your hunger!
          </p>

          {/* QUANTITY */}
          <div className="food-details-quantity">

            <button
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              onClick={() =>
                setQuantity((q) => q + 1)
              }
            >
              +
            </button>

          </div>

          {/* ADD TO CART */}
          
<button
  className="food-details-cart-button"
  onClick={handleAddToCart}
>
  {added ? "✓ Added to Cart" : "🛒 Add to Cart"}
</button>
        </div>

      </div>

    </div>
  );
}

export default FoodDetails;
