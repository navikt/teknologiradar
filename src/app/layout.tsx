import "@/styles/globals.css";
import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delta Δ",
  description: "Påmeldingsapp",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div>
      <Header />
      <main className="layout">{children}</main>
      <Footer />
      {/*<ScrollToTop />*/}
    </div>
  );
}
