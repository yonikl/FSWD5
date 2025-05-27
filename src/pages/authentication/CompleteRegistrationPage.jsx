import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/AuthPages.module.css";

export default function CompleteRegistrationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [suite, setSuite] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [catchPhrase, setCatchPhrase] = useState("");
  const [bs, setBs] = useState("");

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("activeUser");
    if (!stored) {
      navigate("/register");
    } else {
      setUser(JSON.parse(stored));
    }
  }, [navigate]);

  const handleComplete = async (e) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser = {
      ...user,
      name,
      email,
      phone,
      address: {
        street,
        suite,
        city,
        zipcode,
        geo: {
          lat: "",
          lng: ""
        }
      },
      company: {
        name: companyName,
        catchPhrase,
        bs
      }
    };

    await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    });

    localStorage.setItem("activeUser", JSON.stringify(updatedUser));
    navigate("/home");
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2>Complete Registration</h2>
        <form onSubmit={handleComplete}>
          <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />
          <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <input placeholder="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} required />
          <input placeholder="Suite" value={suite} onChange={(e) => setSuite(e.target.value)} />
          <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
          <input placeholder="Zip Code" value={zipcode} onChange={(e) => setZipcode(e.target.value)} required />
          <input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <input placeholder="Company Catch Phrase" value={catchPhrase} onChange={(e) => setCatchPhrase(e.target.value)} />
          <input placeholder="Company BS" value={bs} onChange={(e) => setBs(e.target.value)} />
          <button type="submit">Save and Continue</button>
        </form>
      </div>
    </div>
  );
}
