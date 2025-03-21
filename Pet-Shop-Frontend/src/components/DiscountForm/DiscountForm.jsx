import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { openModal, closeModal } from "../../redux/modalSlice";
import GetDiscountButton from "../Buttons/GetDiscountButton/GetDiscountButton";
import styles from "./DiscountForm.module.css";
import discountImage from "../../assets/images/pets.png";
import API_URL from "../../utils/api";

function DiscountForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [touchedFields, setTouchedFields] = useState({
    name: false,
    phone: false,
    email: false,
  });

  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/sale/send`, {
        name,
        phone,
        email,
      });

      if (response.status === 200) {
        dispatch(
          openModal({
            title: "Success",
            content: ["Your request has been submitted successfully!"],
          })
        );
        setIsSubmitted(true);
        clearForm();
      }
    } catch (error) {
      dispatch(
        openModal({
          title: "Error",
          content:
            "There was an error submitting your request. Please try again later.",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isNameValid = () => /^[A-Za-z\s]+$/.test(name);
  const isPhoneValid = () => /^\d{10,15}$/.test(phone);
  const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = () => isNameValid() && isPhoneValid() && isEmailValid();

  const clearForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setTouchedFields({
      name: false,
      phone: false,
      email: false,
    });
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    clearForm();
  };

  const handleInputChange = (field, value) => {
    if (field === "name") setName(value);
    if (field === "phone") setPhone(value.replace(/\D/g, ""));
    if (field === "email") setEmail(value);

    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  return (
    <div className="globalContainer">
      <div className={styles.discountFormContainer}>
        <h2>5% off on the first order</h2>
        <div className={styles.formContainer}>
          <div className={styles.imageContainer}>
            <img
              src={discountImage}
              alt="Discount"
              className={styles.discountImage}
            />
          </div>
          <div className={styles.formContent}>
            <form onSubmit={handleSubmit} className={styles.formGroupBox}>
              <div className={styles.formGroup}>
                <label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Name"
                    onChange={(e) => handleInputChange("name", e.target.value)}
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
                    value={phone}
                    placeholder="Phone number"
                    onChange={(e) => handleInputChange("phone", e.target.value)}
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
                    value={email}
                    placeholder="Email"
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    aria-invalid={!isEmailValid()}
                  />
                  {touchedFields.email && !isEmailValid() && (
                    <div className={styles.tooltip}>
                      Please enter a valid email address with the @ symbol.
                    </div>
                  )}
                </label>
              </div>
              <GetDiscountButton
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting || isSubmitted}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscountForm;
