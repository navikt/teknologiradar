import "@/styles/globals.css";
import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import AmplitudeContextProvider from "@/context/AmplitudeContext";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />
      <main className="layout">
        <AmplitudeContextProvider>
          <Component {...pageProps} />
        </AmplitudeContextProvider>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
