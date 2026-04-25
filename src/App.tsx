import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import Layout from "./Layout.tsx";
import Home from "./pages/home.tsx";
import "./App.css";
import AuthLayout from "./pages/auth/AuthLayout.tsx";
import VerifyEmail from "./pages/auth/verify.tsx";
import DashboardLayout from "./pages/dashboard/DashboardLayout.tsx";
import MyShopsPage from "./pages/dashboard/shops/myShops.tsx";
import CreateShopPage from "./pages/dashboard/shops/createShop.tsx";
import ShopPage from "./pages/dashboard/shops/shop.tsx";
import EditShopPage from "./pages/dashboard/shops/editShop.tsx";
import ClerkSignup from "./pages/auth/clerkSignup.tsx";
import ClerkSignin from "./pages/auth/clerkSignin.tsx";
import { Show } from "@clerk/react";
import CreateProductPage from "./pages/dashboard/products/createProduct.tsx";
import MyProductsPage from "./pages/dashboard/products/myProducts.tsx";
import EditProductPage from "./pages/dashboard/products/editProduct.tsx";
import ProductPage from "./pages/dashboard/products/product.tsx";
import CartPage from "./pages/cart.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="cart" element={<CartPage />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<ClerkSignup />} />
        <Route path="login" element={<ClerkSignin />} />
        <Route path="register" element={<ClerkSignup />} />
        <Route path="register/verify" element={<VerifyEmail />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <Show when="signed-in">
            <DashboardLayout />
          </Show>
        }
      >
        <Route index element={<MyShopsPage />} />
        <Route path="shops" element={<MyShopsPage />} />
        <Route path="shops/create" element={<CreateShopPage />} />
        <Route path="shops/:id" element={<ShopPage />} />
        <Route path="shops/:id/edit" element={<EditShopPage />} />
        <Route path="products" element={<MyProductsPage />} />
        <Route path="products/create" element={<CreateProductPage />} />
        <Route path="products/:id" element={<ProductPage />} />
        <Route path="products/:id/edit" element={<EditProductPage />} />
      </Route>
    </>,
  ),
);

export default function App() {
  return <RouterProvider router={router} />;
}
