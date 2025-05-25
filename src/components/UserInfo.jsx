import styles from "../styles/UserInfo.module.css";

export default function UserInfo({ user }) {
  if (!user) return null;

  const { name, email, phone, username, website, address, company } = user;

  return (
    <div className={styles.infoBox}>
      <h3>User Information</h3>
      <p><strong>Full Name:</strong> {name}</p>
      <p><strong>Username:</strong> {username}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Phone:</strong> {phone}</p>
      <p><strong>Password (website):</strong> {website}</p>

      {address && (
        <>
          <h4>Address</h4>
          <p><strong>Street:</strong> {address.street}</p>
          <p><strong>Suite:</strong> {address.suite}</p>
          <p><strong>City:</strong> {address.city}</p>
          <p><strong>Zip Code:</strong> {address.zipcode}</p>
        </>
      )}

      {company && (
        <>
          <h4>Company</h4>
          <p><strong>Name:</strong> {company.name}</p>
          <p><strong>Catch Phrase:</strong> {company.catchPhrase}</p>
          <p><strong>BS:</strong> {company.bs}</p>
        </>
      )}
    </div>
  );
}
