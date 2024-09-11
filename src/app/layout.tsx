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
    <html lang="no">
    <head>
        <script defer data-domains="https://teknologiradar.ansatt.nav.no/" src="https://umami.nav.no/script.js"
                data-website-id="f8157d1d-b9ff-4208-9281-882e4594c126"></script>
    </head>
    <body>
    <Header/>
    <main className="layout">{children}</main>
    <Footer/>
    <ScrollToTop/>
    </body>
    </html>
  );
}
