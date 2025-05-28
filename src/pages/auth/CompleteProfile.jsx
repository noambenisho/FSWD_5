import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UsersService } from "../../api/UsersService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./CompleteProfile.module.css";

export default function CompleteProfile() {
  const { login, activeUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState({
    name: "",
  });

  const [address, setAddress] = useState({
    street: "",
    city: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const patch = {
        name,
        email,
        phone,
        company: {
          name: company.name,
        },
        address: {
          street: address.street,
          city: address.city,
        },
      };

      const updatedUser = await UsersService.patch(activeUser.id, patch);

      login(updatedUser);
      navigate("/home");

    } catch (err) {
      console.error(err + " - " + "Failed to update user");
      setError(err.message);
    }
  };

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h2>Complete Your Profile</h2>

        <form onSubmit={handleSubmit} className={styles.formCard}>
          <div className={styles.field}>
            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <input
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <input
              name="company"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              placeholder="Company Name"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <input
              name="city"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              placeholder="City"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <input
              name="street"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              placeholder="Street"
              className={styles.input}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryBtn}>
              Save and Continue
            </button>
          </div>

        </form>
      </section>
    </main>
  );
}
