import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { Layout } from "./components/Layout";
import { FavoritesPage } from "./pages/FavoritePage";
import { LoginPage } from "./pages/LoginPage";
import { SalePage } from "./pages/SalePage";
import { BrandsPage } from "./pages/BrandsPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "favorites", element: <FavoritesPage /> },
      { path: "brands", element: <BrandsPage /> },
      { path: "sale", element: <SalePage /> },
      { path: "order-confirmation", element: <OrderConfirmationPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
