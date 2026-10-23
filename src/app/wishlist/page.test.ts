import { expect, it } from "vitest";
import WishlistPage from "@/app/wishlist/page";

it("forwards old wishlist links to the single shop page", async () => {
  await expect(WishlistPage()).rejects.toMatchObject({
    digest: expect.stringContaining("/shop"),
  });
});
