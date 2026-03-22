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
import MyTaskPage from "./pages/dashboard/myTasks";
import Task from "./pages/dashboard/task";
import UpdateTaskPage from "./pages/dashboard/updateTask";
import CreateTaskPage from "./pages/dashboard/create";

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
        <Route index element={<MyTaskPage />} />
        <Route path="my-tasks" element={<MyTaskPage />} />
        <Route path="create" element={<CreateTaskPage />} />
        <Route path=":id" element={<Task />} />
        <Route path=":id/update" element={<UpdateTaskPage />} />
      </Route>
    </>,
  ),
);

export default function App() {
  return <RouterProvider router={router} />;
}
