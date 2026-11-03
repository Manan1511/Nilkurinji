import { describe, expect, it } from "vitest";
import SearchPage from "@/app/search/page";

async function expectSearchRedirect(query: string | undefined, destination: string) {
  try {
    await SearchPage({ searchParams: Promise.resolve({ q: query }) });
  } catch (error) {
    expect((error as Error & { digest?: string }).digest).toContain(destination);
    return;
  }
  throw new Error("Expected the legacy search route to redirect to the shop.");
}

describe("legacy search route", () => {
  it("sends product searches to the shop results", async () => {
    await expectSearchRedirect(" tea   bags ", "/shop?q=tea%20bags");
  });

  it("sends an empty search to the shop", async () => {
    await expectSearchRedirect(undefined, "/shop");
  });
});
