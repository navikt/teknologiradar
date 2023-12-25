import "@/styles/globals.css";
import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import type { AppProps } from "next/app";
import Head from "next/head";
import Header from "@/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Teknologiradar βeta</title>
      </Head>
      <Header />
      <main className="layout">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
