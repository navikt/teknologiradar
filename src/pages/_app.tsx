import "@/styles/globals.css";
import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />
      <main className="layout">
        <Component {...pageProps} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
