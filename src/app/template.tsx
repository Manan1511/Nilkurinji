import { ViewTransition } from "react";

export default function Template({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransition enter="storefront-page-enter" exit="storefront-page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
