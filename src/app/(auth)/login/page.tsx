import Login from "./_components/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Staf & Admin | Ankow Coffee",
  description: "Masuk ke sistem manajemen operasional Ankow Coffee",
};

export default function LoginPage() {
  return <Login />;
}
