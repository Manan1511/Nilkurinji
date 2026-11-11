// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ReviewRail } from "./review-rail";

describe("review rail touch interaction", () => {
  afterEach(() => { vi.unstubAllGlobals(); document.body.replaceChildren(); });

  it("pauses while touched and resumes when the last finger lifts or touch is cancelled", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    await act(async () => { root.render(createElement(ReviewRail, { count: 1, children: "Review" })); });
    const rail = container.querySelector('[role="region"]')!;
    const touch = async (type: string, count: number) => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperty(event, "touches", { value: Array(count).fill({}) });
      await act(async () => { rail.dispatchEvent(event); });
    };
    await touch("touchstart", 1);
    expect(rail.getAttribute("data-touching")).toBe("true");
    await touch("touchend", 0);
    expect(rail.getAttribute("data-touching")).toBe("false");
    await touch("touchstart", 1);
    await touch("touchcancel", 0);
    expect(rail.getAttribute("data-touching")).toBe("false");
    await act(async () => { root.unmount(); });
  });
});
