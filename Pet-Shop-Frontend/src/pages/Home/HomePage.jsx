import React from "react";

import CheckOutButton from "../../components/Buttons/CheckOutButton/CheckOutButton";
import CategoriesBlock from "../../components/CategoriesBlock/CategoriesBlock";
import DiscountForm from "../../components/DiscountForm/DiscountForm";
import SaleBlock from "../../components/SaleBlock/SaleBlock";
import styles from "./HomePage.module.css";

function HomePage() {
  return (
    <div>
      <div className="globalContainer">
        <div className={styles.contentStyle}>
          <h1>
            Amazing Discounts <br /> on Pets Products!
          </h1>
          <CheckOutButton />
        </div>
      </div>
      <div className={styles.mainBgStyle}></div>

      <CategoriesBlock />
      <DiscountForm />
      <SaleBlock />
    </div>
  );
}

export default HomePage;
