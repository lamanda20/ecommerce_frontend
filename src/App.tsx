import { useEffect, useMemo, useState } from "react";
import ProductCard from "./components/ProductCard";
import type { Product } from "./types";
import { CartProvider } from "./CartContext";
import { useCart } from "./useCart";
import "./App.css";

const API = import.meta.env.VITE_API_URL;

type View = "products" | "cart";

function CartPage() {
  const { items, totalItems, clearCart, removeFromCart } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Your cart</h1>
        <p className="page-subtitle">
          {totalItems === 0
            ? "Your cart is empty. Add some products to see them here."
            : `You have ${totalItems} item${totalItems > 1 ? "s" : ""} in your cart.`}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="state-card">
          <strong>Your cart is empty</strong>
          <span>Add products from the shop to get started.</span>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Cart items">
            {items.map((item) => (
              <article
                key={`${item.product.id}-${item.variant}`}
                className="cart-item"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-body">
                  <div className="cart-item-header">
                    <h2 className="cart-item-title">{item.product.name}</h2>
                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() =>
                        removeFromCart(item.product.id, item.variant)
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <p className="cart-item-meta">
                    <span>{item.product.category}</span>
                    <span>Variant: {item.variant}</span>
                  </p>
                  <p className="cart-item-meta">
                    <span>Qty: {item.quantity}</span>
                  </p>
                </div>
                <div className="cart-item-price">
                  ${
                    (item.product.price * item.quantity).toFixed(2)
                  }
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary" aria-label="Order summary">
            <h2 className="cart-summary-title">Order summary</h2>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row cart-summary-row-muted">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="cart-summary-total">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button type="button" className="cart-summary-button">
              Continue to checkout
            </button>
            <button
              type="button"
              className="cart-summary-secondary"
              onClick={clearCart}
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </>
  );
}

function AppShell() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [view, setView] = useState<View>("products");
  const { totalItems } = useCart();

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch(`${API}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data || []);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        [p.name, p.category].some((field) =>
          field?.toLowerCase().includes(q)
        )
      );
    }

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, search, category, sortBy]);

  const showProducts = view === "products";

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <button
            type="button"
            className="app-logo-button"
            onClick={() => setView("products")}
          >
            <span className="app-logo">Shopfront</span>
          </button>
          <nav className="app-nav" aria-label="Main navigation">
            <button
              type="button"
              className="app-nav-link"
              onClick={() => setView("products")}
            >
              Home
            </button>
            <button
              type="button"
              className="app-nav-link"
              onClick={() => setView("products")}
            >
              Shop
            </button>
            <button
              type="button"
              className="app-nav-link"
              onClick={() => setView("cart")}
            >
              Cart
              {totalItems > 0 && (
                <span
                  className="app-cart-badge"
                  aria-label={`${totalItems} items in cart`}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {showProducts ? (
          <>
            <header className="page-header">
              <h1 className="page-title">Products</h1>
              <p className="page-subtitle">
                Discover our latest collection. Use search and filters to find
                exactly what you need.
              </p>
            </header>

            <section className="filter-bar" aria-label="Product filters">
              <div className="filter-bar-left">
                <input
                  type="search"
                  className="filter-input"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="filter-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="all">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-bar-right">
                <select
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </section>

            {isLoading && (
              <div className="state-card" role="status" aria-live="polite">
                <span>Loading products...</span>
              </div>
            )}

            {!isLoading && error && (
              <div className="state-card" role="alert">
                <strong>Something went wrong.</strong>
                <span>{error}</span>
              </div>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="state-card">
                <strong>No products found</strong>
                <span>Try adjusting your search or filters.</span>
              </div>
            )}

            {!isLoading && !error && filteredProducts.length > 0 && (
              <section className="product-grid" aria-label="Product list">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </section>
            )}
          </>
        ) : (
          <CartPage />
        )}
      </main>

      <footer className="app-footer">
        <div className="app-footer-inner">
          <span>© {new Date().getFullYear()} Shopfront. All rights reserved.</span>
          <span>Help · Shipping &amp; returns · Terms</span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppShell />
    </CartProvider>
  );
}

export default App;
