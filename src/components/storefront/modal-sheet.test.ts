// @vitest-environment jsdom
import { act, createElement, createRef } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { ModalSheet } from "./modal-sheet";
it("releases body styles and restores focus when closed/unmounted", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
  const trigger = document.createElement("button"); document.body.append(trigger);
  const ref = createRef<HTMLElement>(); ref.current = trigger;
  const host = document.createElement("div"); document.body.append(host); const root = createRoot(host);
  const onClose = vi.fn(); document.body.style.overflow = "auto";
  await act(async () => root.render(createElement(ModalSheet, { open: true, label: "Filters", placement: "right", triggerRef: ref, onClose, children: createElement("button", {}, "Apply") })));
  expect(document.body.style.overflow).toBe("hidden");
  await act(async () => host.querySelector("dialog")!.dispatchEvent(new Event("cancel", { cancelable: true })));
  expect(onClose).toHaveBeenCalledWith("escape");
  await act(async () => root.unmount()); expect(document.body.style.overflow).toBe("auto"); expect(document.activeElement).toBe(trigger);
  document.body.replaceChildren(); document.body.style.overflow = ""; vi.unstubAllGlobals();
});
