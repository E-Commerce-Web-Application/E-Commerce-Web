import axios from "axios";

export type Shop = {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  location: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: number;
  shop_id: string;
  product_name: string;
  product_description?: string | null;
  product_price: number;
  product_sold?: boolean;
  product_review_id?: number | null;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  shopId?: string;
};

export type Cart = {
  userId: string;
  items: CartItem[];
  totalAmount: number;
};

const shopApi = axios.create({
  baseURL:
    (import.meta.env.VITE_SHOP_SERVICE_URL as string) ||
    (import.meta.env.VITE_SERVER as string),
  headers: { "Content-Type": "application/json" },
});

const productApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCT_SERVICE_URL as string,
  headers: { "Content-Type": "application/json" },
});

const reviewApi = axios.create({
  baseURL: import.meta.env.VITE_REVIEW_SERVICE_URL as string,
  headers: { "Content-Type": "application/json" },
});

const cartApi = axios.create({
  baseURL: import.meta.env.VITE_CART_SERVICE_URL as string,
  headers: { "Content-Type": "application/json" },
});

export async function getAllShops() {
  const res = await shopApi.get("/shops/");
  return (res.data?.shops ?? []) as Shop[];
}

export async function getShopById(id: string) {
  const res = await shopApi.get(`/shops/${id}`);
  return {
    shop: res.data?.shop as Shop,
    products: (res.data?.products ?? []) as Product[],
    reviews: (res.data?.reviews ?? []) as Review[],
  };
}

export async function createShop(payload: {
  owner_id: string;
  name: string;
  description: string;
  location: string;
  email: string;
  phone: string;
}) {
  const res = await shopApi.post("/shops/", payload);
  return res.data?.shop as Shop;
}

export async function updateShop(
  id: string,
  payload: Partial<{
    name: string;
    description: string;
    location: string;
    email: string;
    phone: string;
  }>,
) {
  const res = await shopApi.patch(`/shops/${id}`, payload);
  return res.data?.shop as Shop;
}

export async function deleteShop(id: string) {
  await shopApi.delete(`/shops/${id}`);
}

export async function getAllProducts() {
  const res = await productApi.get("/products/");
  return (res.data ?? []) as Product[];
}

export async function getProductById(productId: string | number) {
  const res = await productApi.get(`/products/${productId}`);
  return res.data as Product;
}

export async function getProductsByShopId(shopId: string) {
  const res = await productApi.get(`/products/shop/${shopId}`);
  return (res.data ?? []) as Product[];
}

export async function createProduct(payload: {
  shop_id: string;
  product_name: string;
  product_description?: string;
  product_price: number;
  product_sold?: boolean;
  product_review_id?: number | null;
}) {
  const res = await productApi.post("/products/", payload);
  return res.data as Product;
}

export async function updateProduct(
  productId: string,
  payload: Partial<{
    shop_id: string;
    product_name: string;
    product_description: string;
    product_price: number;
    product_sold: boolean;
    product_review_id: number | null;
  }>,
) {
  const res = await productApi.patch(`/products/${productId}`, payload);
  return res.data as Product;
}

export async function deleteProduct(productId: string) {
  await productApi.delete(`/products/${productId}`);
}

export async function getReviewsByProductId(productId: string | number) {
  const res = await reviewApi.get(`/reviews/${productId}`);
  return (res.data ?? []) as Review[];
}

export async function createReview(payload: {
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
}) {
  const res = await reviewApi.post("/reviews", payload);
  return res.data as Review;
}

export async function deleteReview(reviewId: string) {
  await reviewApi.delete(`/reviews/${reviewId}`);
}

export async function getCartByUserId(userId: string) {
  const res = await cartApi.get(`/cart?user_id=${encodeURIComponent(userId)}`);
  return res.data as Cart;
}

export async function addToCart(payload: {
  user_id: string;
  item: {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    shop_id?: string;
  };
}) {
  const res = await cartApi.post("/cart/add", payload);
  return res.data as Cart;
}

export async function updateCartItemQty(payload: {
  user_id: string;
  product_id: string;
  quantity: number;
}) {
  const res = await cartApi.patch(
    `/cart/update/${payload.product_id}?user_id=${encodeURIComponent(payload.user_id)}`,
    { quantity: payload.quantity },
  );
  return res.data as Cart;
}

export async function removeFromCart(userId: string, productId: string) {
  const res = await cartApi.delete(
    `/cart/remove/${productId}?user_id=${encodeURIComponent(userId)}`,
  );
  return res.data as Cart;
}

export async function clearCart(userId: string) {
  const res = await cartApi.delete(`/cart/clear?user_id=${encodeURIComponent(userId)}`);
  return res.data;
}