import { useState } from "react";
import type { Product } from "../types";
import { useCart } from "../useCart";
import "../App.css";

export default function ProductCard({ product }: { product: Product }) {
  const [variant, setVariant] = useState(product.variants[0]);
  const { addToCart } = useCart();

  const isOutOfStock = !product.inStock;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, variant);
  };

  return (
    <article className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-card-image"
        />
        {isOutOfStock && (
          <span className="product-card-badge product-card-badge--out">
            Out of stock
          </span>
        )}
      </div>

      <div className="product-card-body">
        <header className="product-card-header">
          <p className="product-card-category">{product.category}</p>
          <h3 className="product-card-title" title={product.name}>
            {product.name}
          </h3>
        </header>

        <p className="product-card-price">${product.price.toFixed(2)}</p>

        <div className="product-card-variant-row">
          <label
            className="product-card-label"
            htmlFor={`variant-${product.id}`}
          >
            Variant
          </label>
          <select
            id={`variant-${product.id}`}
            className="product-card-select"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            disabled={isOutOfStock}
          >
            {product.variants.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="product-card-button"
          disabled={isOutOfStock}
          aria-disabled={isOutOfStock}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
