"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { contacts } from "../data/portfolio";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Honeypot: این فیلد از کاربر واقعی پنهان است.
  // اگر پر باشد، معمولاً یعنی ربات فرم را پر کرده است.
  const [website, setWebsite] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    const trimmedWebsite = website.trim();

    // Honeypot:
    // به ربات پیام موفقیت نشان می‌دهیم، اما هیچ درخواست واقعی ارسال نمی‌شود.
    if (trimmedWebsite) {
      setSuccess("Your message was sent successfully.");
      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (trimmedName.length > 100) {
      setError("Name must be less than 100 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedMessage.length < 10) {
      setError("Message must be at least 10 characters.");
      return;
    }

    if (trimmedMessage.length > 5000) {
      setError("Message must be less than 5000 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,

          // این فیلد به بک‌اند هم ارسال می‌شود.
          website: trimmedWebsite,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          (data && typeof data.error === "string" && data.error) ||
            "Something went wrong. Please try again."
        );
        return;
      }

      setSuccess(
        (data && typeof data.message === "string" && data.message) ||
          "Your message was sent successfully."
      );

      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">
                Contact
              </p>

              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Let&apos;s build something useful
              </h2>

              <p className="max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                Reach out for projects, collaboration, or anything related to
                software engineering and product work.
              </p>
            </div>

            <div className="space-y-4">
              {contacts.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white/80 transition hover:border-cyan-400/40 hover:bg-white/10"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                    <Mail className="h-5 w-5" />
                  </span>

                  <span className="flex flex-col">
                    <span className="text-sm text-white/50">
                      {contact.label}
                    </span>

                    <span className="text-sm font-medium text-white">
                      {contact.value}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl"
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm text-white/70"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/50"
                  required
                  minLength={2}
                  maxLength={100}
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm text-white/70"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/50"
                  required
                  maxLength={254}
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm text-white/70"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/50"
                  required
                  minLength={10}
                  maxLength={5000}
                  disabled={loading}
                />
              </div>

              {/* فیلد مخفی ضدربات: در ظاهر سایت دیده نمی‌شود */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden opacity-0"
              >
                <label htmlFor="website">Website</label>

                <input
                  id="website"
                  name="website"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {error ? (
                <p role="alert" className="text-sm text-red-300">
                  {error}
                </p>
              ) : null}

              {success ? (
                <p role="status" className="text-sm text-emerald-300">
                  {success}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
