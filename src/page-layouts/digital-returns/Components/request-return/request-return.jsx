/**
 * RequestReturn — entry step where the customer enters order# + email
 * to look up an order before opening the main return form.
 *
 * This step is bypassed when the page is reached with an explicit orderId
 * in the URL (the hook in react-starter handles that branching).
 */
import React, { useState } from "react";
import * as styles from "./request-return.less";
import ReturnsActionButton from "../shared/returns-action-button/returns-action-button";

const isValidEmail = (s) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(String(s || ""));

const RequestReturn = ({ onSubmit = () => {}, isLoading = false }) => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  // CONFIRM is enabled only when both fields are filled and email is valid
  // (Figma: button is in light/disabled state until the form is valid).
  const isFormValid =
    orderNumber.trim().length > 0 &&
    email.trim().length > 0 &&
    isValidEmail(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!orderNumber.trim()) next.orderNumber = "Order number is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!isValidEmail(email)) next.email = "Invalid email address";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      onSubmit({ orderNumber: orderNumber.trim(), email: email.trim() });
    }
  };

  return (
    <div className={styles.requestReturn}>
      <h1 className={styles.title}>Request a return</h1>
      <p className={styles.subtitle}>
        Please enter your order number from the order confirmation email and
        the email address you used when you placed the order.
      </p>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.fieldsCard}>
          <input
            name="orderNumber"
            type="text"
            placeholder="Order number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            disabled={isLoading}
            className={`${styles.fieldInput} ${errors.orderNumber ? styles.error : ""}`}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={`${styles.fieldInput} ${errors.email ? styles.error : ""}`}
          />
        </div>

        <ReturnsActionButton
          type="submit"
          isLoading={isLoading}
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? "Looking up…" : "CONFIRM"}
        </ReturnsActionButton>
      </form>
    </div>
  );
};

export default RequestReturn;
