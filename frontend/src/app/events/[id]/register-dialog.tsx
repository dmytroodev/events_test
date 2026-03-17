"use client";

import { useState } from "react";
import { getApiBaseUrl } from "@/lib/config";

interface RegisterDialogProps {
  eventId: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function RegisterDialog({ eventId }: RegisterDialogProps) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasValidationError =
    !fullName.trim() ||
    !email.includes("@") ||
    email.trim().length < 5 ||
    !phone.trim();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (hasValidationError || status === "submitting") {
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const apiBase = getApiBaseUrl();
      const url = new URL(`/events/${eventId}/register`, apiBase);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
        }),
      });

      if (!response.ok) {
        let message = "Registration failed";

        try {
          const body = await response.json();

          if (body && typeof body.message === "string") {
            message = body.message;
          }
        } catch {
          message = "Registration failed";
        }

        setStatus("error");
        setErrorMessage(message);
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error");
    }
  }

  function handleOpen() {
    setOpen(true);
    setStatus("idle");
    setErrorMessage(null);
  }

  function handleClose() {
    setOpen(false);
    setStatus("idle");
    setErrorMessage(null);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleOpen}
        className="rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-400"
      >
        Register
      </button>

      {open && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Register for event
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            {status === "success" ? (
              <div className="space-y-4 text-sm">
                <p className="text-slate-700">
                  Registration was submitted successfully.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-8 rounded-full bg-sky-500 px-3 text-xs font-medium text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label htmlFor="fullName" className="text-slate-800">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-900 outline-none ring-0 focus:border-sky-400 focus:ring-1 focus:ring-sky-300"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-slate-800">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-900 outline-none ring-0 focus:border-sky-400 focus:ring-1 focus:ring-sky-300"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="phone" className="text-slate-800">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-900 outline-none ring-0 focus:border-sky-400 focus:ring-1 focus:ring-sky-300"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-600">{errorMessage}</p>
                )}

                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                  className="h-8 rounded-full border border-slate-300 px-3 text-xs text-slate-700 hover:border-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={hasValidationError || status === "submitting"}
                    className="h-8 rounded-full bg-sky-500 px-3 text-xs font-medium text-white disabled:opacity-50"
                  >
                    {status === "submitting" ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

