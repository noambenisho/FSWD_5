import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import styles from '../pages/Home.module.css';   // ← reuse same module

export default function InfoPanel() {
  const { activeUser } = useAuth();
  const [showPass, setShowPass] = useState(false);

  if (!activeUser) return null;

  const company =
    typeof activeUser.company === 'object'
      ? activeUser.company?.name
      : activeUser.company;

  const address =
    typeof activeUser.address === 'object'
      ? [activeUser.address?.street, activeUser.address?.suite, activeUser.address?.city]
          .filter(Boolean)
          .join(', ')
      : activeUser.address;

  return (
    <div className={styles.infoWrapper}>
      <h3>User Information</h3>

      <div className={styles.infoGrid}>
        <Field label="Full Name" value={activeUser.name} />
        <Field label="Username"  value={activeUser.username} />
        <Field label="Email"     value={activeUser.email} />
        <Field label="Phone"     value={activeUser.phone} />
        <Field label="Company"   value={company} />
        <Field label="Address"   value={address} />
        <Field label="User ID"   value={activeUser.id} />
        <Field
          label="Password"
          value={showPass ? activeUser.website : '********'}
        />
      </div>

      <button
        className={styles.revealBtn}
        onClick={() => setShowPass((p) => !p)}
      >
        {showPass ? 'Hide Password' : 'Show Password'}
      </button>
    </div>
  );
}

/* small helper */
function Field({ label, value }) {
  return (
    <div>
      <div className={styles.fieldLabel}>{label}</div>
      <div className={styles.fieldValue}>{value || 'N/A'}</div>
    </div>
  );
}
