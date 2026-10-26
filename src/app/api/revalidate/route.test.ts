import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/revalidate/route";
import { revalidateTag } from "next/cache";

vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));

const SECRET = "a-long-manual-revalidation-secret-value";

describe("manual content revalidation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("REVALIDATE_SECRET", SECRET);
  });

  afterEach(() => vi.unstubAllEnvs());

  it("requires the operational secret and an approved scope", async () => {
    const unauthorized = await POST(new Request("https://nilkurinji.example/api/revalidate", {
      method: "POST", headers: { authorization: "Bearer wrong" }, body: JSON.stringify({ scope: "all" }),
    }));
    expect(unauthorized.status).toBe(401);

    const invalidScope = await POST(new Request("https://nilkurinji.example/api/revalidate", {
      method: "POST", headers: { authorization: `Bearer ${SECRET}` }, body: JSON.stringify({ scope: "arbitrary-tag" }),
    }));
    expect(invalidScope.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("can invalidate editorial and metaobject content without accepting arbitrary tags", async () => {
    const response = await POST(new Request("https://nilkurinji.example/api/revalidate", {
      method: "POST", headers: { authorization: `Bearer ${SECRET}` }, body: JSON.stringify({ scope: "content" }),
    }));

    expect(response.status).toBe(200);
    expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith("shopify-blog-journal", { expire: 0 });
    expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith("shopify-homepage", { expire: 0 });
    expect(vi.mocked(revalidateTag)).not.toHaveBeenCalledWith("arbitrary-tag", { expire: 0 });
  });
});
