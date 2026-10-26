"use client";

import { useState, type FormEvent } from "react";
import styles from "./delivery-checker.module.css";

type DeliveryCheckResult = {
  status: "serviceable" | "not-serviceable" | "unknown";
  prepaid: boolean | null;
  cod: boolean | null;
  etaMinDays: number | null;
  etaMaxDays: number | null;
};

export function DeliveryChecker({ preview = false }: { preview?: boolean }) {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<DeliveryCheckResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setResult(null);
    if (!/^\d{6}$/.test(pincode)) {
      setMessage("Enter a six-digit PIN code.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ pincode }),
      });
      if (!response.ok) throw new Error("Delivery availability could not be checked right now.");
      const data = await response.json() as DeliveryCheckResult;
      setResult(data);
      if (data.status === "unknown") setMessage("We could not confirm delivery for this PIN code. Check availability at checkout.");
      if (data.status === "not-serviceable") setMessage("We do not currently deliver to this PIN code.");
      if (data.status === "serviceable") {
        const methods = [data.prepaid ? "Prepaid" : null, data.cod ? "Cash on delivery" : null].filter(Boolean).join(" and ");
        const eta = data.etaMinDays && data.etaMaxDays ? ` Estimated delivery: ${data.etaMinDays}–${data.etaMaxDays} days.` : "";
        setMessage(`Delivery is available${methods ? ` by ${methods}` : ""}.${eta}`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delivery availability could not be checked right now.");
    } finally {
      setBusy(false);
    }
  }

  return <section className={styles.checker} aria-labelledby="delivery-check-title">
    <h2 id="delivery-check-title">Check delivery</h2>
    {preview ? <p>Delivery availability is confirmed at checkout. PIN checking is not enabled in this preview.</p> : <>
      <form onSubmit={(event) => void check(event)}>
        <label htmlFor="delivery-pincode">Enter your PIN code</label>
        <div className={styles.controls}>
          <input id="delivery-pincode" name="pincode" type="text" inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" maxLength={6} value={pincode} onChange={(event) => { setPincode(event.target.value.replace(/\D/g, "").slice(0, 6)); setMessage(""); setResult(null); }} aria-describedby="delivery-check-message" />
          <button type="submit" className="button button--outline" disabled={busy || pincode.length !== 6}>{busy ? "Checking…" : "Check"}</button>
        </div>
      </form>
      <p id="delivery-check-message" className={styles.message} role="status" aria-live="polite">{message}</p>
      {result?.status === "serviceable" && <p className={styles.footnote}>Final serviceability, shipping charges and delivery dates are confirmed at checkout.</p>}
    </>}
  </section>;
}
