import { useRef, useState } from "react";
import { primaryButton } from "../lib/ui.js";

const EMPTY = { name: "", email: "", subject: "", message: "", company: "" };

// Deliberately loose: the job is to catch typos, not to police what a valid
// address looks like. Anything stricter rejects real people.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Please tell us your name.";
  } else if (values.name.trim().length < 2) {
    errors.name = "That looks a little short for a name.";
  }

  if (!values.email.trim()) {
    errors.email = "We need an email address to write back to.";
  } else if (!EMAIL.test(values.email.trim())) {
    errors.email = "That address does not look right — check for a typo.";
  }

  if (!values.subject.trim()) {
    errors.subject = "Give your message a subject so it reaches the right person.";
  }

  if (!values.message.trim()) {
    errors.message = "Your message is empty.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Tell us a little more — a sentence or two is plenty.";
  }

  return errors;
}

const fieldClasses =
  "mt-2 w-full rounded-lg border border-purple-900/15 bg-off-white px-4 py-3 text-base text-charcoal transition-colors placeholder:text-grey-500/70 focus-visible:border-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500";

const labelClasses = "block text-sm font-semibold text-purple-900";

export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle");
  const formRef = useRef(null);

  const update = (field) => (event) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    // Only start correcting in real time once they have tried to send, so
    // errors never appear while someone is still typing their first answer.
    if (submitted) setErrors(validate(next));
  };

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);

    const found = validate(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      setStatus("idle");
      formRef.current?.elements[firstInvalid]?.focus();
      return;
    }

    // The honeypot is invisible to people and irresistible to bots. If it has
    // anything in it, act as though everything went fine and drop the message.
    if (values.company.trim()) {
      setStatus("sent");
      return;
    }

    // TODO: wire up submission. Nothing is sent yet — pick a service first
    // (a Vercel function with Resend, Formspree, Web3Forms) and replace this
    // block with the real call. Two things it must do per CLAUDE.md:
    //   1. validate and sanitise the input server-side as well as here;
    //   2. keep every key in a Vercel environment variable, never in source.
    // Until then the form deliberately tells the visitor it did not send,
    // rather than pretending it did.
    setStatus("not-configured");
  }

  const errorId = (field) => (errors[field] ? `${field}-error` : undefined);

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-10">
      {/* Honeypot. Hidden from view and from screen readers, skipped by Tab. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="company">Company (leave this blank)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={update("company")}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={update("name")}
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errorId("name")}
            className={`${fieldClasses} ${errors.name ? "border-pink-500" : ""}`}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-sm text-purple-700">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClasses}>
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={update("email")}
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errorId("email")}
            className={`${fieldClasses} ${errors.email ? "border-pink-500" : ""}`}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-purple-700">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="subject" className={labelClasses}>
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={values.subject}
          onChange={update("subject")}
          aria-invalid={errors.subject ? "true" : undefined}
          aria-describedby={errorId("subject")}
          className={`${fieldClasses} ${errors.subject ? "border-pink-500" : ""}`}
        />
        {errors.subject && (
          <p id="subject-error" className="mt-2 text-sm text-purple-700">
            {errors.subject}
          </p>
        )}
      </div>

      <div className="mt-6">
        <label htmlFor="message" className={labelClasses}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={values.message}
          onChange={update("message")}
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errorId("message")}
          className={`${fieldClasses} resize-y ${errors.message ? "border-pink-500" : ""}`}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-sm text-purple-700">
            {errors.message}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className={primaryButton}>
          Send message
        </button>
        <p className="text-sm text-grey-500">
          We usually reply within two working days.
        </p>
      </div>

      <div aria-live="polite">
        {status === "not-configured" && (
          <p className="mt-6 rounded-lg border border-dashed border-purple-900/20 bg-pink-100/50 px-4 py-3 text-sm leading-relaxed text-purple-900">
            <strong className="font-semibold">Not sent yet.</strong> Sending is
            not connected on this site while we finish building it, so nothing
            has reached us. Please call or email us using the details above and
            we will pick it up straight away.
          </p>
        )}
      </div>
    </form>
  );
}
