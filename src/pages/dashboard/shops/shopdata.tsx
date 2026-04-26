export type DummyShop = {
  id: string;
  name: string;
  description: string;
  location: string;
  email: string;
  phone: string;
  createdAt: string;
};

export const shopData: DummyShop[] = [
  {
    id: "shop-001",
    name: "Urban Threads",
    description: "Streetwear essentials and limited drops for everyday style.",
    location: "Colombo 03",
    email: "urbanthreads@example.com",
    phone: "+94 77 123 4567",
    createdAt: "2026-01-12T09:30:00.000Z",
  },
  {
    id: "shop-002",
    name: "Gadget Harbor",
    description: "Smart devices, accessories, and home tech at fair prices.",
    location: "Kandy",
    email: "gadgetharbor@example.com",
    phone: "+94 76 987 6543",
    createdAt: "2026-02-03T10:45:00.000Z",
  },
  {
    id: "shop-003",
    name: "Bloom Basket",
    description: "Fresh flowers, curated gift boxes, and custom arrangements.",
    location: "Galle",
    email: "bloombasket@example.com",
    phone: "+94 71 555 1122",
    createdAt: "2026-02-28T14:00:00.000Z",
  },
];
