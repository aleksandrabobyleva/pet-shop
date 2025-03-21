import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { openModal, closeModal } from "../../redux/modalSlice";
import { removeItem, clearCart, updateQuantity } from "../../redux/cartSlice";
import Counter from "../../components/Counter/Counter";
import OrderButton from "../../components/Buttons/OrderButton/OrderButton";
import styles from "./CartPage.module.css";
import API_URL from "../../utils/api";

function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [touchedFields, setTouchedFields] = useState({
    name: false,
    phone: false,
    email: false,
  });

  useEffect(() => {
    if (isSubmitted) {
      clearForm();
      setIsSubmitted(false);
    }
  }, [isSubmitted]);

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.discont_price || item.price) * item.quantity,
    0
  );
  const formatPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(totalPrice);

  const handleQuantityChange = (id, newQuantity) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "phone") setPhone(value.replace(/\D/g, ""));
    if (name === "email") setEmail(value);

    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isFormValid() || isSubmitting || isSubmitted) return;

    const orderData = {
      name,
      phone,
      email,
      products: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        title: item.title,
        price: item.price,
        discont_price: item.discont_price || item.price,
        totalPrice: (item.discont_price || item.price) * item.quantity,
      })),
    };

    setIsSubmitting(true);
    setError(null);

    axios
      .post("http://localhost:3333/order/send", orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
       
        console.log("Order placed successfully:", response.data);
        dispatch(
          openModal({
            title: "Congratulations!",
            content: [
              "Your order has been successfully placed on the website.",
              "A manager will contact you shortly to confirm your order.",
            ],
          })
        );
        setIsSubmitted(true);
      })
      .catch((error) => {
       
        console.error("Error placing order:", error);
        setError("An error occurred while placing your order. Please try again later.");
      })
      .finally(() => {
        setIsSubmitting(false); 
      });
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    setIsSubmitted(true);
  };

  const clearForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setTouchedFields({
      name: false,
      phone: false,
      email: false,
    });
    dispatch(clearCart()); 
  };

 
  const isNameValid = () => /^[A-Za-z\s]+$/.test(name);
  const isPhoneValid = () => /^\d{10,15}$/.test(phone);
  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = () => isNameValid() && isPhoneValid() && isEmailValid();

  if (error) return <div className="errorMessage">{error}</div>;

  if (cartItems.length === 0)
    return (
      <div className="globalContainer">
        <div className={styles.cartPageBlock}>
          <div className="titleBlock">
            <h2>Shopping cart</h2>
            <div className="titleBlockLine"></div>
            <Link to="/products" className="titleBlockButton">
              Back to the store
            </Link>
          </div>
          <div className={styles.emptyCart}>
            <p>Looks like you have no items in your basket currently.</p>
            <Link to="/products" className={styles.continueShoppingButton}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="globalContainer">
      <div className={styles.cartPageBlock}>
        <div className="titleBlock">
          <h2>Shopping cart</h2>
          <div className="titleBlockLine"></div>
          <Link to="/products" className="titleBlockButton">
            Back to the store
          </Link>
        </div>

        <div className={styles.cartContent}>
          <div className={styles.cartDetails}>
            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.productImageContainer}>
                    <img
                      src={`${API_URL}${item.image}`}
                      alt={item.title}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.cartItemDetails}>
                    <h3 className={styles.cartItemTitle} title={item.title}>
                      {item.title}
                    </h3>
                    <div className={styles.cartItemPrice}>
                      <div className={styles.cartItemCounter}>
                        <Counter
                          quantity={item.quantity}
                          setQuantity={(newQuantity) =>
                            handleQuantityChange(item.id, newQuantity)
                          }
                        />
                      </div>
                      <div className={styles.priceBox}>
                        {item.discont_price ? (
                          <>
                            <p className={styles.discountPrice}>
                              ${item.discont_price * item.quantity}
                            </p>
                            <p className={styles.originalPrice}>
                              ${item.price * item.quantity}
                            </p>
                          </>
                        ) : (
                          <p className={styles.originalPriceLarge}>
                            ${item.price * item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={() => dispatch(removeItem({ id: item.id }))}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M18 6L6 18"
                          stroke=" #282828"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6 6L18 18"
                          stroke="#282828"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.orderDetails}>
            <h3>Order details</h3>
            <p className={styles.itemsCount}>{totalQuantity} items</p>
            <div className={styles.totalPrice}>
              <span className={styles.totalPriceTitle}>Total</span>
              <span className={styles.totalPriceSumme}>{formatPrice}</span>
            </div>

            <div className={styles.formContent}>
              <form onSubmit={handlePlaceOrder} className={styles.formGroupBox}>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      placeholder="Name"
                      onChange={handleInputChange}
                      required
                      aria-invalid={!isNameValid()}
                    />
                    {touchedFields.name && !isNameValid() && (
                      <div className={styles.tooltip}>
                        Only Latin letters are allowed.
                      </div>
                    )}
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="tel"
                      name="phone"
                      value={phone}
                      placeholder="Phone number"
                      onChange={handleInputChange}
                      required
                      aria-invalid={!isPhoneValid()}
                    />
                    {touchedFields.phone && !isPhoneValid() && (
                      <div className={styles.tooltip}>
                        Only digits are allowed. Enter 10-15 digits.
                      </div>
                    )}
                  </label>
                </div>
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      placeholder="Email"
                      onChange={handleInputChange}
                      required
                      aria-invalid={!isEmailValid()}
                    />
                    {touchedFields.email && !isEmailValid() && (
                      <div className={styles.tooltip}>
                        Please enter a valid email address.
                      </div>
                    )}
                  </label>
                </div>
                <div className={styles.submitButton}>
                  <OrderButton
                    text="Place Order"
                    isSubmitting={isSubmitting}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
