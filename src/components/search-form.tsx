import { Search } from "lucide-react";

export function SearchForm({ initialValue = "" }: { initialValue?: string }) {
  return (
    <form className="search-form" action="/search" method="get" role="search">
      <label className="sr-only" htmlFor="store-search">Search products</label>
      <Search aria-hidden="true" size={19} />
      <input id="store-search" name="q" type="search" placeholder="Tea, rice, snacks…" defaultValue={initialValue} autoComplete="off" />
      <button type="submit" className="button button--dark">Search</button>
    </form>
  );
}
