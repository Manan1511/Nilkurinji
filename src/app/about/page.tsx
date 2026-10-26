import { permanentRedirect } from "next/navigation";

export default function AboutRedirect(): never {
  permanentRedirect("/our-story");
}
