import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="no">
            <Head>
                <script
                    defer
                    data-domains="teknologiradar.ansatt.nav.no"
                    src="https://cdn.nav.no/team-researchops/sporing/sporing.js" data-host-url="https://umami.nav.no"
                    data-website-id="f8157d1d-b9ff-4208-9281-882e4594c126"
                ></script>
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}