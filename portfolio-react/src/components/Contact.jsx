import { useState } from "react";
import Reveal from "./Reveal.jsx";
import SectionHeading from "./SectionHeading.jsx";

const emptyForm = { name: "", email: "", message: "" };

function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setSent(false);
  };

  // Returns an object like { email: "Enter a valid email" }
  const validate = () => {
    const found = {};
    if (!form.name.trim()) found.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = "Please enter a valid email";
    if (form.message.trim().length < 10) found.message = "Message should be at least 10 characters";
    return found;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);

    if (Object.keys(found).length === 0) {
      // No backend in this mini project, so we just show a success message.
      setSent(true);
      setForm(emptyForm);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container contact-layout">
        <div className="contact-copy">
          <SectionHeading
            label="05 / Start a conversation"
            before="Let’s make"
            highlight="something good."
            subtitle="A project, a question, or just a friendly hello—I’d love to hear about it."
          />
          <p className="contact-aside">Have something in mind? Share a few details and let’s take it from there.</p>
        </div>

        <Reveal as="form" className="card contact-form" onSubmit={handleSubmit} noValidate>
          <p className="form-note">This demo validates your note in the browser; it doesn’t send or store submissions.</p>
          <div className="form-field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            {errors.name && <small id="contact-name-error" className="error">{errors.name}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
            />
            {errors.email && <small id="contact-email-error" className="error">{errors.email}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your project"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
            />
            {errors.message && <small id="contact-message-error" className="error">{errors.message}</small>}
          </div>

          <button type="submit" className="btn">
            Check my note
          </button>
          {sent && <p className="success" role="status">Thanks! Your note passed the demo validation.</p>}
        </Reveal>
      </div>
    </section>
  );
}

export default Contact;
