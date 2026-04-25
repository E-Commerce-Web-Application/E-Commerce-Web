import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import Layout from "./Layout";
import Home from "./pages/home";
import "./App.css";
import AuthLayout from "./pages/auth/AuthLayout";
import RegisterPage from "./pages/auth/register";
import LoginPage from "./pages/auth/login";
import VerifyEmail from "./pages/auth/verify";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import MyShopsPage from "./pages/dashboard/shops/myShops";
import CreateShopPage from "./pages/dashboard/shops/createShop";
import ShopPage from "./pages/dashboard/shops/shop";
import EditShopPage from "./pages/dashboard/shops/editShop";
import MyProductsPage from "./pages/dashboard/products/myProducts";
import CreateProductPage from "./pages/dashboard/products/createProduct";
import ProductPage from "./pages/dashboard/products/product";
import EditProductPage from "./pages/dashboard/products/editProduct";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="register/verify" element={<VerifyEmail />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
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
