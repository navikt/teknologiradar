import '@/styles/globals.css'
import "@navikt/ds-css";
import "@navikt/ds-css-internal";
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
