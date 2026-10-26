"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import styles from "./addresses.module.css";

export type CustomerAddress = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  province: string | null;
  zoneCode: string | null;
  zip: string | null;
  phoneNumber: string | null;
  formatted: string[];
};

type FormValues = Omit<CustomerAddress, "id" | "formatted" | "country" | "province"> & { defaultAddress: boolean };
const EMPTY: FormValues = { firstName: "", lastName: "", company: "", address1: "", address2: "", city: "", countryCode: "IN", zoneCode: "", zip: "", phoneNumber: "", defaultAddress: false };

export function AddressManager({ addresses, defaultAddressId }: { addresses: CustomerAddress[]; defaultAddressId: string | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  function beginCreate() { setValues({ ...EMPTY }); setEditing("new"); setError(""); setStatus(""); }
  function beginEdit(address: CustomerAddress) {
    setValues({ firstName: address.firstName ?? "", lastName: address.lastName ?? "", company: address.company ?? "", address1: address.address1 ?? "", address2: address.address2 ?? "", city: address.city ?? "", countryCode: address.countryCode ?? "IN", zoneCode: address.zoneCode ?? "", zip: address.zip ?? "", phoneNumber: address.phoneNumber ?? "", defaultAddress: address.id === defaultAddressId });
    setEditing(address.id); setError(""); setStatus("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setBusy(true); setError(""); setStatus("");
    const action = editing === "new" ? "create" : "update";
    try {
      const response = await fetch("/api/account/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, addressId: action === "update" ? editing : undefined, address: values }), cache: "no-store" });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Address could not be saved. Please try again.");
      setEditing(null); setStatus("Address saved."); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Address could not be saved. Please try again."); }
    finally { setBusy(false); }
  }

  async function remove(addressId: string) {
    if (!window.confirm("Remove this saved address?")) return;
    setBusy(true); setError(""); setStatus("");
    try {
      const response = await fetch("/api/account/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", addressId }), cache: "no-store" });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Address could not be removed.");
      setStatus("Address removed."); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Address could not be removed."); }
    finally { setBusy(false); }
  }

  return <div className={styles.manager}>
    <p className={styles.feedback} role={error ? "alert" : "status"}>{error || status}</p>
    {editing === "new" ? <AddressForm heading="Add an address" values={values} setValues={setValues} onSubmit={submit} onCancel={() => setEditing(null)} busy={busy} /> : <button className="button button--outline" type="button" disabled={busy} onClick={beginCreate}>Add an address</button>}
    {addresses.length ? <div className={styles.list}>{addresses.map((address) => <article className={styles.card} key={address.id}>
      <div className={styles.cardHeading}><h2>{[address.firstName, address.lastName].filter(Boolean).join(" ") || "Saved address"}</h2>{address.id === defaultAddressId && <span className={styles.default}>Default</span>}</div>
      {editing === address.id ? <AddressForm heading="Edit address" values={values} setValues={setValues} onSubmit={submit} onCancel={() => setEditing(null)} busy={busy} /> : <>
        <address>{address.formatted.map((line, index) => <span key={`${index}-${line}`}>{line}<br /></span>)}</address>
        {address.phoneNumber && <p>{address.phoneNumber}</p>}
        <div className={styles.actions}><button type="button" disabled={busy} className="button button--outline" onClick={() => beginEdit(address)}>Edit</button><button type="button" disabled={busy} className={styles.remove} onClick={() => void remove(address.id)}>Remove</button></div>
      </>}
    </article>)}</div> : <p className={styles.empty}>No delivery addresses are saved to this account.</p>}
  </div>;
}

function AddressForm({ heading, values, setValues, onSubmit, onCancel, busy }: { heading: string; values: FormValues; setValues: (value: FormValues) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void; busy: boolean }) {
  function field<K extends keyof FormValues>(key: K, value: FormValues[K]) { setValues({ ...values, [key]: value }); }
  return <form className={styles.form} onSubmit={onSubmit}>
    <h3>{heading}</h3>
    <div className={styles.fields}>
      <label>First name<input autoComplete="given-name" maxLength={80} required value={values.firstName ?? ""} onChange={(event) => field("firstName", event.target.value)} /></label>
      <label>Last name<input autoComplete="family-name" maxLength={80} required value={values.lastName ?? ""} onChange={(event) => field("lastName", event.target.value)} /></label>
      <label className={styles.wide}>Address line 1<input autoComplete="address-line1" maxLength={160} required value={values.address1 ?? ""} onChange={(event) => field("address1", event.target.value)} /></label>
      <label className={styles.wide}>Address line 2<input autoComplete="address-line2" maxLength={160} value={values.address2 ?? ""} onChange={(event) => field("address2", event.target.value)} /></label>
      <label>City / town<input autoComplete="address-level2" maxLength={80} required value={values.city ?? ""} onChange={(event) => field("city", event.target.value)} /></label>
      <label>State / region<input autoComplete="address-level1" maxLength={80} required value={values.zoneCode ?? ""} onChange={(event) => field("zoneCode", event.target.value)} /></label>
      <label>PIN / postal code<input autoComplete="postal-code" maxLength={20} required value={values.zip ?? ""} onChange={(event) => field("zip", event.target.value)} /></label>
      <label>Country code<input autoComplete="country" maxLength={2} pattern="[A-Za-z]{2}" required value={values.countryCode ?? "IN"} onChange={(event) => field("countryCode", event.target.value.toUpperCase())} /></label>
      <label>Phone <span>(include country code)</span><input autoComplete="tel" type="tel" pattern="\\+[1-9][0-9\\s()-]{7,18}" maxLength={20} value={values.phoneNumber ?? ""} onChange={(event) => field("phoneNumber", event.target.value)} /></label>
    </div>
    <label className={styles.checkbox}><input type="checkbox" checked={values.defaultAddress} onChange={(event) => field("defaultAddress", event.target.checked)} /> Set as default address</label>
    <div className={styles.actions}><button className="button button--dark" disabled={busy}>{busy ? "Saving…" : "Save address"}</button><button className="button button--outline" type="button" disabled={busy} onClick={onCancel}>Cancel</button></div>
  </form>;
}
