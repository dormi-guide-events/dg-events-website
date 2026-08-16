import { useEffect, useRef, useState } from "react";
import { primaryButton } from "../lib/ui.js";
import { telHref } from "../lib/phone.js";

const EMPTY = { name: "", email: "", subject: "", message: "", company: "" };

// Mirrors server/contact/validate.js. The server is the one that counts —
// these exist so someone is told before they hit send, and so the browser
// stops them typing far past the limit in the first place.
const LIMITS = { name: 100, email: 200, subject: 150, message: 2000 };

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
    errors.subject =
      "Give your message a subject so it reaches the right person.";
  }

  if (!values.message.trim()) {
    errors.message = "Your message is empty.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Tell us a little more — a sentence or two is plenty.";
  }

  return errors;
}

const fieldClasses =
  "mt-2 w-full rounded-lg border border-purple-900/15 bg-off-white px-4 py-3 text-base text-charcoal transition-colors placeholder:text-grey-500/70 focus-visible:border-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-60";

const labelClasses = "block text-sm font-semibold text-purple-900";

/**
 * `phone` comes from the siteSettings singleton in Sanity. When that document
 * does not exist yet it is simply absent, and the failure state drops the
 * "call us instead" line rather than inventing a number.
 */
export function ContactForm({ phone, contactEmail }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("idle");
  const [failure, setFailure] = useState(null);
  const formRef = useRef(null);
  const noticeRef = useRef(null);

  const dialable = telHref(phone);

  const update = (field) => (event) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    // Only start correcting in real time once they have tried to send, so
    // errors never appear while someone is still typing their first answer.
    if (submitted) setErrors(validate(next));
  };

  // Move focus to the outcome once it has rendered, so someone using a screen
  // reader or a keyboard is taken to the answer rather than left on the button.
  // An effect rather than a timer or a frame callback: it fires exactly when
  // the notice exists, with no dependence on the tab being visible.
  useEffect(() => {
    if (status === "success" || status === "error") {
      noticeRef.current?.focus();
    }
  }, [status]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    setFailure(null);

    const found = validate(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      setStatus("idle");
      formRef.current?.elements[firstInvalid]?.focus();
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await response.json().catch(() => ({}));

      if (response.ok && body.ok) {
        setValues(EMPTY);
        setErrors({});
        setSubmitted(false);
        setStatus("success");

        return;
      }

      // The server re-validates everything; if it disagrees with us, it wins.
      if (response.status === 400 && body.fields) {
        setErrors(body.fields);
        setStatus("idle");
        formRef.current?.elements[Object.keys(body.fields)[0]]?.focus();
        return;
      }

      setFailure(response.status === 429 ? "rate_limited" : "send_failed");
      setStatus("error");

    } catch {
      // Offline, DNS, blocked request — indistinguishable from here.
      setFailure("network");
      setStatus("error");

    }
  }

  const errorId = (field) => (errors[field] ? `${field}-error` : undefined);
  const busy = status === "submitting";

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-10">
      {/* Honeypot. Hidden from view and from screen readers, skipped by Tab.
          Checked again on the server. */}
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
            maxLength={LIMITS.name}
            disabled={busy}
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
            maxLength={LIMITS.email}
            disabled={busy}
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
          maxLength={LIMITS.subject}
          disabled={busy}
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
          maxLength={LIMITS.message}
          disabled={busy}
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
        <button type="submit" disabled={busy} className={primaryButton}>
          {busy ? "Sending…" : "Send message"}
        </button>
        <p className="text-sm text-grey-500">
          We usually reply within two working days.
        </p>
      </div>

      <div aria-live="polite">
        {status === "success" && (
          <div
            ref={noticeRef}
            tabIndex={-1}
            className="mt-6 rounded-lg border border-purple-900/15 bg-pink-100/60 px-5 py-4"
          >
            <h3 className="font-serif text-lg text-purple-900">
              Thank you — your message is on its way.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-grey-500">
              We have got it and will come back to you within two working days.
              If it is urgent, calling is always faster.
            </p>
          </div>
        )}

        {status === "error" && (
          <div
            ref={noticeRef}
            tabIndex={-1}
            className="mt-6 rounded-lg border border-pink-500/40 bg-pink-100/60 px-5 py-4"
          >
            <h3 className="font-serif text-lg text-purple-900">
              {failure === "rate_limited"
                ? "That is a few messages in a short time"
                : "We could not send that message"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-grey-500">
              {failure === "rate_limited"
                ? "Give it a little while before trying again — or reach us directly, which is quicker anyway."
                : "Something went wrong between here and us, so nothing has arrived. Your message is still in the form, so nothing is lost."}
            </p>

            {/* Only shown when siteSettings actually supplies a number. */}
            {dialable ? (
              <p className="mt-3 text-sm text-charcoal">
                Call us on{" "}
                <a
                  href={dialable}
                  className="rounded-sm font-semibold text-purple-700 underline decoration-pink-500 underline-offset-4 transition-colors hover:text-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                >
                  {phone}
                </a>
                {contactEmail ? (
                  <>
                    {" "}
                    or email{" "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="rounded-sm font-semibold text-purple-700 underline decoration-pink-500 underline-offset-4 transition-colors hover:text-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                    >
                      {contactEmail}
                    </a>
                  </>
                ) : null}
                .
              </p>
            ) : contactEmail ? (
              <p className="mt-3 text-sm text-charcoal">
                Email us at{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="rounded-sm font-semibold text-purple-700 underline decoration-pink-500 underline-offset-4 transition-colors hover:text-pink-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                >
                  {contactEmail}
                </a>{" "}
                instead.
              </p>
            ) : (
              <p className="mt-3 text-sm text-charcoal">
                Please try again in a few minutes.
              </p>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
