import React from "react";
import { useRef } from "react";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_d57uwnm",
        "template_iftud8l",
        form.current,
        "PLR7s5zu7qPDgy3PF"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );

    toast.success("Message sent!");

    form.current.reset();
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mt-5">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Phone</h5>
                <p className="card-text">+91 7666255931</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4 mt-5">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Email</h5>
                <p className="card-text">tomatochallenge@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4 mt-5">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Address</h5>
                <p className="card-text">VIIT Pune</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <form ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input type="text" name="from_name" />
      <label>Email</label>
      <input type="email" name="from_email" />
      <label>Message</label>
      <textarea name="message" />
      <input type="submit" value="Send" />
    </form> */}

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h2 className="text-center mb-4">Get in Touch</h2>
            <form ref={form} onSubmit={sendEmail}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  name="from_name"
                  placeholder="Your Name"
                  className="form-control"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Phone Number
                </label>
                <input
                  type="mail"
                  name="from_email"
                  className="form-control"
                  placeholder="Your Number"
                  pattern="[0-9]{10}"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="3"
                  placeholder="Your Message"
                  autoComplete="off"
                  required
                ></textarea>
              </div>
              <div className="form-group form-button">
                <input type="submit" value="Send" className="btn btn-primary" />
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Contact;
