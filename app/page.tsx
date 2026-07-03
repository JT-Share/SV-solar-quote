import { redirect } from "next/navigation";

// Authenticated users land here (middleware gates it) and go straight to the tool.
export default function Home() {
  redirect("/app/index.html");
}
