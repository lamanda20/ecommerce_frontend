const API_URL = import.meta.env.VITE_API_URL as string;

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getCart(cartId: string) {
  const res = await fetch(`${API_URL}/cart`, {
    headers: {
      "x-cart-id": cartId,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addToCart(productId: number, variant?: string) {
  const res = await fetch(`${API_URL}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cart-id": "default",
    },
    body: JSON.stringify({ productId, variant }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}

