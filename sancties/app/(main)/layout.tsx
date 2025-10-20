import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div id="root" className="h-dvh grid grid-rows-[auto_1fr_auto]">
      <Header />
      <main className="p-2 mb-2">{children}</main>
      <Footer />
    </div>
  );
}
