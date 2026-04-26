export type DummyProduct = {
  id: string;
  shop_id: string;
  product_name: string;
  product_description?: string;
  product_price: number;
  product_sold: boolean;
  product_date: string;
  product_review_id?: number | null;
};

export const productData: DummyProduct[] = [
  {
    id: "prod-001",
    shop_id: "shop-001",
    product_name: "Classic Cotton T-Shirt",
    product_description: "Premium quality 100% cotton t-shirt available in multiple colors.",
    product_price: 1500,
    product_sold: false,
    product_date: "2026-03-10T08:30:00.000Z",
    product_review_id: null,
  },
  {
    id: "prod-002",
    shop_id: "shop-001",
    product_name: "Slim Fit Jeans",
    product_description: "Comfortable and stylish slim fit denim jeans perfect for casual wear.",
    product_price: 3500,
    product_sold: true,
    product_date: "2026-03-05T14:20:00.000Z",
    product_review_id: 1,
  },
  {
    id: "prod-003",
    shop_id: "shop-001",
    product_name: "Casual Canvas Shoes",
    product_description: "Lightweight canvas shoes ideal for everyday casual adventures.",
    product_price: 2800,
    product_sold: false,
    product_date: "2026-03-15T10:15:00.000Z",
    product_review_id: null,
  },
  {
    id: "prod-004",
    shop_id: "shop-002",
    product_name: "Wireless Bluetooth Speaker",
    product_description: "High quality sound with 12-hour battery life and waterproof design.",
    product_price: 4500,
    product_sold: false,
    product_date: "2026-03-12T09:45:00.000Z",
    product_review_id: null,
  },
  {
    id: "prod-005",
    shop_id: "shop-002",
    product_name: "USB-C Fast Charging Cable",
    product_description: "Durable fast charging cable with 60W power delivery support.",
    product_price: 800,
    product_sold: true,
    product_date: "2026-03-08T11:30:00.000Z",
    product_review_id: 2,
  },
  {
    id: "prod-006",
    shop_id: "shop-002",
    product_name: "Noise Cancelling Earbuds",
    product_description: "True wireless earbuds with active noise cancellation and 24-hour battery.",
    product_price: 6500,
    product_sold: false,
    product_date: "2026-03-14T13:00:00.000Z",
    product_review_id: null,
  },
];
