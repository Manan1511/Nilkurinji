import { Search } from "lucide-react";
import Form from "next/form";
import type { FormEventHandler, Ref } from "react";
import styles from "./search-form.module.css";

type SearchFormProps = {
  initialValue?: string;
  id?: string;
  inputRef?: Ref<HTMLInputElement>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  value?: string;
  onQueryChange?: (value: string) => void;
};

export function SearchForm({ initialValue = "", id = "store-search", inputRef, onSubmit, value, onQueryChange }: SearchFormProps) {
  return (
    <Form className={styles.form} action="/search" role="search" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor={id}>Search products</label>
      <Search aria-hidden="true" size={19} />
      <input ref={inputRef} id={id} name="q" type="search" placeholder="Search tea and pantry" {...(value === undefined ? { defaultValue: initialValue } : { value, onChange: (event: React.ChangeEvent<HTMLInputElement>) => onQueryChange?.([...event.target.value].slice(0, 120).join("")) })} onInput={(event) => { const input = event.currentTarget; const capped = [...input.value].slice(0, 120).join(""); if (input.value !== capped) input.value = capped; }} autoComplete="off" maxLength={240} required enterKeyHint="search" />
      <button type="submit">Search</button>
    </Form>
  );
}
