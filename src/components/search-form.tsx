"use client";
import { Search, X } from "lucide-react";
import Form from "next/form";
import type { FormEventHandler, Ref } from "react";
import styles from "./search-form.module.css";

type SearchFormProps = {
  initialValue?: string;
  className?: string;
  id?: string;
  inputRef?: Ref<HTMLInputElement>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  onClear?: () => void;
  value?: string;
  onQueryChange?: (value: string) => void;
  iconSubmit?: boolean;
  placeholder?: string;
};

export function SearchForm({ initialValue = "", className, id = "store-search", inputRef, onSubmit, onClear, value, onQueryChange, iconSubmit = false, placeholder = "Search tea and pantry" }: SearchFormProps) {
  return (
    <Form className={[styles.form, className].filter(Boolean).join(" ")} action="/shop" role="search" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor={id}>Search products</label>
      {!iconSubmit && <Search aria-hidden="true" size={19} />}
      <input ref={inputRef} id={id} name="q" type="search" placeholder={placeholder} {...(value === undefined ? { defaultValue: initialValue } : { value, onChange: (event: React.ChangeEvent<HTMLInputElement>) => onQueryChange?.([...event.target.value].slice(0, 120).join("")) })} onInput={(event) => { const input = event.currentTarget; const capped = [...input.value].slice(0, 120).join(""); if (input.value !== capped) input.value = capped; }} autoComplete="off" minLength={2} maxLength={240} required enterKeyHint="search" />
      {value && onClear && <button className={styles.clear} type="button" aria-label="Clear search" onClick={onClear}><X aria-hidden="true" size={17} /></button>}
      {iconSubmit ? <button className={styles.iconSubmit} type="submit" aria-label="Search"><Search aria-hidden="true" size={18} /></button> : <button type="submit">Search</button>}
    </Form>
  );
}
