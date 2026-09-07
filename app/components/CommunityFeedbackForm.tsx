"use client";

import { FormEvent, useId, useState } from "react";

const feedbackTypes = [
  "Addon Idea",
  "Website Suggestion",
  "Bug Report",
  "Stream / Community",
  "Other",
] as const;

type SubmitState = "idle" | "submitting" | "success" | "error";

export function CommunityFeedbackForm() {
  const statusId = useId();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      discord: formData.get("discord"),
      type: formData.get("type"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Could not send your suggestion right now.");
      }

      form.reset();
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setErrorMessage(error instanceof Error ? error.message : "Could not send your suggestion right now.");
    }
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit} aria-describedby={statusId}>
      <div className="feedback-field-grid">
        <label>
          <span>Name / Twitch Handle</span>
          <input name="name" type="text" required maxLength={80} autoComplete="name" />
        </label>

        <label>
          <span>Discord Username <em>(optional)</em></span>
          <input name="discord" type="text" maxLength={80} autoComplete="off" />
        </label>
      </div>

      <label>
        <span>Type</span>
        <select name="type" required defaultValue="">
          <option value="" disabled>Select feedback type</option>
          {feedbackTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Suggestion / Comment</span>
        <textarea name="message" required maxLength={1200} rows={6} />
      </label>

      <div className="feedback-submit-row">
        <button className="primary-button" type="submit" disabled={submitState === "submitting"}>
          {submitState === "submitting" ? "Sending..." : "Send Suggestion"}
        </button>
        <p className={`feedback-status feedback-status-${submitState}`} id={statusId} aria-live="polite">
          {submitState === "success" ? "Suggestion sent. Thank you." : null}
          {submitState === "error" ? errorMessage : null}
        </p>
      </div>
    </form>
  );
}
