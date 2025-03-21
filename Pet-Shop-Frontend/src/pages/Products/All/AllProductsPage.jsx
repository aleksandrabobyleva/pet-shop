import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import ProductCard from "../../../components/ProductCard/ProductCard";
import Filter from "../../../components/FilterContainer/Filter/Filter";
import DiscountedItems from "../../../components/FilterContainer/DiscountedItems/DiscountedItems";
import SelectSort from "../../../components/FilterContainer/SelectSort/SelectSort";
import styles from "./AllProductsPage.module.css";
import API_URL from "../../../utils/api";

function AllProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [sortType, setSortType] = useState("default");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/products/all`);
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
        setError("An error occurred fetching data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const minPrice = parseFloat(searchParams.get("minPrice")) || 0;
      const maxPrice = parseFloat(searchParams.get("maxPrice")) || Infinity;
      const includeDiscount = searchParams.get("includeDiscount") === "true";

      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      if (includeDiscount && !product.discont_price) {
        return false;
      }

      return true;
    })

    .sort((a, b) => {
      if (sortType === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortType === "priceHighToLow") {
        return (b.discont_price || b.price) - (a.discont_price || a.price);
      }
      if (sortType === "priceLowToHigh") {
        return (a.discont_price || a.price) - (b.discont_price || b.price);
      }
      if (sortType === "discountPriceHighToLow") {
        return (b.discont_price || b.price) - (a.discont_price || a.price);
      }
      return 0;
    });

  const addToCart = (product) => {
    console.log("Added to cart:", product);
  };

  if (isLoading) {
    return <span style={{ fontSize: "24px" }}> Loading...</span>;
  }

  if (error) return <div className="errorMessage">{error}</div>;

  return (
    <div className="globalContainer">
      <div className={styles.allProductsPage}>
        <Breadcrumbs
          items={[
            { path: "/", label: "Main page" },
            { path: "/categories", label: "All products", isActive: true },
          ]}
        />

        <div className={styles.categoriesPageTitle}>
          <h2>All products</h2>
        </div>
        <div className={styles.filterContainer}>
          <Filter
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
          <DiscountedItems
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
          <div className={styles.selectSort}>
            <span className={styles.sortTitle}>Sorted</span>
            <SelectSort
              sortType={sortType}
              setSortType={setSortType}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
        </div>
        <div className={styles.productsContainer}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllProductsPage;
