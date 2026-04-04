import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { Layout } from "./components/Layout";
import { FavoritesPage } from "./pages/FavoritePage";
import { LoginPage } from "./pages/LoginPage";
import { NewArrivalsPage } from "./pages/NewArrivalsPage";
import { SalePage } from "./pages/SalePage";
import { DealsPage } from "./pages/DealsPage";
import { BrandsPage } from "./pages/BrandsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "shop", Component: ShopPage },
      { path: "product/:id", Component: ProductDetailPage },
      { path: "cart", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "favorites", Component: FavoritesPage },
      { path: "new-arrivals", Component: NewArrivalsPage },
      { path: "brands", Component: BrandsPage },
      { path: "sale", Component: SalePage },
      { path: "deals", Component: DealsPage },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
]);
