import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store";
import "./App.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ConnectedModal from "./components/Modal/ConnectedModal";

import HomePage from "./pages/Home/HomePage";
import CategoriesPage from "./pages/Categories/CategoriesPage";
import ProductsByCategoryPage from "./pages/Products/ByCategory/ProductsByCategoryPage";
import AllProductsPage from "./pages/Products/All/AllProductsPage";
import DiscountedProductsPage from "./pages/Products/Discounted/DiscountedProductsPage";
import ProductDetailsPage from "./pages/ProductDetails/ProductDetailsPage";
import CartPage from "./pages/Cart/CartPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";


function App() {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <div className="wrapperContainer">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route
              path="categories/:categoryId"
              element={<ProductsByCategoryPage />}
            />
            <Route path="products" element={<AllProductsPage />} />
            <Route
              path="discounted-products"
              element={<DiscountedProductsPage />}
            />
            <Route path="products/:productId" element={<ProductDetailsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
          <ConnectedModal />
        </div>
      </BrowserRouter>
    </ReduxProvider>
  );
}

export default App;
