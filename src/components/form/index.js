import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import emailjs from "emailjs-com";

const FormComponent = (dataArray) => {
  const formD = useRef();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const sendEmail = (e) => {
    e.preventDefault();

    const screenshotData = localStorage.getItem("screenshotImage");
    console.log("data", screenshotData);
    console.log("type:", typeof screenshotData);

    const templateParams = {
      username: formD.current.username.value,
      email: formD.current.email.value,
      phone: formD.current.phone.value,
      screenshot: screenshotData,
    };

    emailjs
      .send(
        "service_txkewbm",
        "template_fkq3ceq",
        templateParams,

        "xIzQcA4VMFWJoSOGf"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  useEffect(() => {
    // Remove the screenshot data from local storage after sending the email
    localStorage.removeItem("screenshotImage");
  }, []);

  const { username, email, phone } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format the phone number as "123 456 789"
    if (name === "phone") {
      const phoneNumbers = value.replace(/\D/g, "").substring(0, 9);
      const formattedPhone = phoneNumbers.replace(
        /(\d{3})(\d{3})(\d{3})/,
        "$1 $2 $3"
      );
      setFormData({
        ...formData,
        [name]: formattedPhone,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  return (
    <div className="form-container">
      <form ref={formD} onSubmit={sendEmail} className="form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Vaše jméno
          </label>
          <input
            type="text"
            className="form-input"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            E-mail
          </label>
          <input
            type="email"
            className="form-input"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Telefon
          </label>
          <input
            type="text"
            className="form-input"
            id="phone"
            name="phone"
            value={phone}
            onChange={handleChange}
            placeholder="776 024 456"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Odeslat poptávku
        </button>
      </form>
    </div>
  );
};

export default FormComponent;
