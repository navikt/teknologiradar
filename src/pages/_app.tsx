import "@/styles/globals.css";
import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Header } from "@navikt/ds-react-internal";
import NextLink from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Teknologiradar</title>
      </Head>
      <Header>
        <Header.Title as="h1">
          <NextLink
            id="logo"
            href="."
            className="inline-flex items-center gap-3 -ml-1 hover:underline underline-offset-4 color-blue"
          >
            <svg
              className="mt-px w-7 h-7 sm:w-9 sm:h-9"
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              fill="none"
              viewBox="0 0 36 36"
              aria-hidden="true"
              focusable="false"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.75"
            >
              <path d="M2 18A16 16 0 1 0 29.7 7m-23-.3a16 16 0 0 1 19.8-2.2" />
              <path d="M12.3 12.3a8 8 0 1 1 2.3 13M10 18a8 8 0 0 0 1.5 4.6M18 18 3 3" />
              <circle cx="28" cy="5.8" r="2" />
              <circle cx="13" cy="24" r="2" />
            </svg>
            <span className="font-semibold">Teknologiradar</span>
          </NextLink>
        </Header.Title>
      </Header>
      <main className="layout">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
