// The dashboard for "/" is rendered by app/page.tsx (Next.js App Router precedence).
// This file intentionally defers to the root page.
import { redirect } from "next/navigation";

export default function AppGroupPage() {
  redirect("/");
}
