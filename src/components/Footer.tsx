"use client";
import { BodyShort, Heading, Link } from "@navikt/ds-react";

const Footer = () => {
  return (
    <div className="bg-deepblue-800 w-full border-t-2 border-blue-300">
      <footer
        id="aksel-footer"
        data-hj-suppress
        data-theme="dark"
        className="flex pt-3 z-10 items-center max-w-[101ch] m-auto justify-between toc-ignore text-text-on-inverted bg-deepblue-800 relative flex justify-center"
      >
        <div className="relative z-10 mx-auto grid w-full max-w-screen-2xl gap-12 px-4 pb-16 pt-12 md:grid-cols-2 md:px-6 lg:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          <LogoBlock />
          <Snarveier />
          <SideLenker />
          <Kontakt />
        </div>
      </footer>
    </div>
  );
};

function LogoBlock() {
  return (
    <div>
      <span className="mt-4 text-2xl whitespace-nowrap">Teknologiradar</span>
      <p className="mt-3 leading-normal">
        &copy; {new Date().getFullYear()} NAV
      </p>
      <p className="leading-normal">Arbeids- og velferdsetaten</p>
    </div>
  );
}

function Snarveier() {
  return (
    <div>
      <Heading level="2" size="xsmall">
        Om nettstedet
      </Heading>
      <BodyShort as="ul" className="mt-3 grid gap-3">
        <FooterLink href="/about">Hva er Teknologiradar?</FooterLink>
        <FooterLink href="https://nav-it.slack.com/archives/CEHSHMNBF">
          Spørsmål om radaren
        </FooterLink>
      </BodyShort>
    </div>
  );
}

function SideLenker() {
  return (
    <div>
      <Heading level="2" size="xsmall">
        Erklæringer
      </Heading>
      <BodyShort as="ul" className="mt-3 grid gap-3">
        <FooterLink href="/privacy">Personvern</FooterLink>
        <FooterLink href="/accessibility">Tilgjengelighet</FooterLink>
      </BodyShort>
    </div>
  );
}

function Kontakt() {
  return (
    <div>
      <Heading level="2" size="xsmall">
        Finn oss
      </Heading>
      <BodyShort as="ul" className="mt-3 grid gap-3">
        <FooterLink href="https://nav-it.slack.com/archives/CEHSHMNBF">
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            aria-hidden="true"
          >
            <path
              d="M4.92656 12.8086C4.92625 13.1721 4.81818 13.5274 4.616 13.8295C4.41382 14.1316 4.12661 14.3669 3.79068 14.5058C3.45475 14.6447 3.08518 14.6809 2.72869 14.6098C2.37221 14.5387 2.0448 14.3635 1.78787 14.1063C1.53094 13.8492 1.35601 13.5216 1.28521 13.1651C1.2144 12.8085 1.2509 12.439 1.39008 12.1032C1.52926 11.7674 1.76488 11.4804 2.06715 11.2784C2.36942 11.0765 2.72477 10.9688 3.08828 10.9688H4.92656V12.8086Z"
              fill="currentColor"
            ></path>
            <path
              d="M5.85303 12.8086C5.85303 12.3211 6.0467 11.8535 6.39145 11.5088C6.73619 11.164 7.20377 10.9703 7.69131 10.9703C8.17885 10.9703 8.64643 11.164 8.99117 11.5088C9.33591 11.8535 9.52959 12.3211 9.52959 12.8086V17.4117C9.52959 17.8993 9.33591 18.3669 8.99117 18.7116C8.64643 19.0563 8.17885 19.25 7.69131 19.25C7.20377 19.25 6.73619 19.0563 6.39145 18.7116C6.0467 18.3669 5.85303 17.8993 5.85303 17.4117V12.8086Z"
              fill="currentColor"
            ></path>
            <path
              d="M7.69146 5.42656C7.32794 5.42625 6.97269 5.31818 6.67059 5.116C6.36849 4.91382 6.13312 4.62661 5.99422 4.29068C5.85532 3.95475 5.81914 3.58518 5.89025 3.22869C5.96136 2.87221 6.13656 2.5448 6.39371 2.28787C6.65086 2.03094 6.97841 1.85601 7.33496 1.78521C7.69151 1.7144 8.06105 1.7509 8.39686 1.89008C8.73267 2.02926 9.01968 2.26488 9.2216 2.56715C9.42353 2.86942 9.5313 3.22477 9.5313 3.58828V5.42656H7.69146Z"
              fill="currentColor"
            ></path>
            <path
              d="M7.69141 6.35315C8.17895 6.35315 8.64652 6.54682 8.99127 6.89157C9.33601 7.23631 9.52969 7.70389 9.52969 8.19143C9.52969 8.67897 9.33601 9.14655 8.99127 9.49129C8.64652 9.83604 8.17895 10.0297 7.69141 10.0297H3.08828C2.60074 10.0297 2.13316 9.83604 1.78842 9.49129C1.44368 9.14655 1.25 8.67897 1.25 8.19143C1.25 7.70389 1.44368 7.23631 1.78842 6.89157C2.13316 6.54682 2.60074 6.35315 3.08828 6.35315H7.69141Z"
              fill="currentColor"
            ></path>
            <path
              d="M15.0735 8.19139C15.0738 7.82788 15.1819 7.47263 15.3841 7.17053C15.5862 6.86843 15.8734 6.63305 16.2094 6.49416C16.5453 6.35526 16.9149 6.31908 17.2714 6.39019C17.6278 6.4613 17.9552 6.6365 18.2122 6.89365C18.4691 7.1508 18.644 7.47835 18.7148 7.8349C18.7856 8.19145 18.7491 8.56099 18.61 8.8968C18.4708 9.23261 18.2352 9.51962 17.9329 9.72154C17.6306 9.92346 17.2753 10.0312 16.9118 10.0312H15.0735V8.19139Z"
              fill="currentColor"
            ></path>
            <path
              d="M14.1468 8.19141C14.1468 8.67895 13.9531 9.14652 13.6084 9.49127C13.2636 9.83601 12.796 10.0297 12.3085 10.0297C11.821 10.0297 11.3534 9.83601 11.0086 9.49127C10.6639 9.14652 10.4702 8.67895 10.4702 8.19141V3.58828C10.4702 3.10074 10.6639 2.63316 11.0086 2.28842C11.3534 1.94368 11.821 1.75 12.3085 1.75C12.796 1.75 13.2636 1.94368 13.6084 2.28842C13.9531 2.63316 14.1468 3.10074 14.1468 3.58828V8.19141Z"
              fill="currentColor"
            ></path>
            <path
              d="M12.3086 15.5734C12.6721 15.5737 13.0274 15.6818 13.3295 15.884C13.6316 16.0862 13.8669 16.3734 14.0058 16.7093C14.1447 17.0452 14.1809 17.4148 14.1098 17.7713C14.0387 18.1278 13.8635 18.4552 13.6063 18.7121C13.3492 18.9691 13.0216 19.144 12.6651 19.2148C12.3085 19.2856 11.939 19.2491 11.6032 19.1099C11.2674 18.9707 10.9804 18.7351 10.7784 18.4328C10.5765 18.1306 10.4688 17.7752 10.4688 17.4117V15.5734H12.3086Z"
              fill="currentColor"
            ></path>
            <path
              d="M12.3085 14.6469C11.821 14.6469 11.3534 14.4532 11.0086 14.1085C10.6639 13.7637 10.4702 13.2962 10.4702 12.8086C10.4702 12.3211 10.6639 11.8535 11.0086 11.5088C11.3534 11.164 11.821 10.9703 12.3085 10.9703H16.9116C17.3992 10.9703 17.8667 11.164 18.2115 11.5088C18.5562 11.8535 18.7499 12.3211 18.7499 12.8086C18.7499 13.2962 18.5562 13.7637 18.2115 14.1085C17.8667 14.4532 17.3992 14.6469 16.9116 14.6469H12.3085Z"
              fill="currentColor"
            ></path>
          </svg>
          Slack
        </FooterLink>
        <FooterLink href="https://github.com/navikt/teknologiradar#readme">
          <svg
            className="align-top"
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.9702 0C4.45694 0 0 4.4898 0 10.0443C0 14.4843 2.85571 18.2427 6.81735 19.5729C7.31265 19.6729 7.49408 19.3567 7.49408 19.0908C7.49408 18.858 7.47775 18.0598 7.47775 17.2282C4.70429 17.8269 4.12673 16.0308 4.12673 16.0308C3.68102 14.8667 3.02061 14.5675 3.02061 14.5675C2.11286 13.9522 3.08673 13.9522 3.08673 13.9522C4.09367 14.0188 4.62204 14.9833 4.62204 14.9833C5.51327 16.5131 6.94939 16.0808 7.52714 15.8147C7.60959 15.1661 7.87388 14.7171 8.15449 14.4678C5.94245 14.2349 3.6151 13.3702 3.6151 9.51204C3.6151 8.41449 4.01102 7.51653 4.63837 6.81816C4.53939 6.56878 4.19265 5.53755 4.73755 4.15735C4.73755 4.15735 5.57939 3.89122 7.47755 5.18837C8.29022 4.9685 9.12832 4.85666 9.9702 4.85571C10.812 4.85571 11.6702 4.97224 12.4627 5.18837C14.361 3.89122 15.2029 4.15735 15.2029 4.15735C15.7478 5.53755 15.4008 6.56878 15.3018 6.81816C15.9457 7.51653 16.3253 8.41449 16.3253 9.51204C16.3253 13.3702 13.998 14.2182 11.7694 14.4678C12.1327 14.7837 12.4461 15.3822 12.4461 16.3302C12.4461 17.6771 12.4298 18.7582 12.4298 19.0906C12.4298 19.3567 12.6114 19.6729 13.1065 19.5731C17.0682 18.2424 19.9239 14.4843 19.9239 10.0443C19.9402 4.4898 15.4669 0 9.9702 0Z"
              fill="currentColor"
            ></path>
          </svg>
          Github
        </FooterLink>
      </BodyShort>
    </div>
  );
}

// @ts-ignore
function FooterLink({ children, href }) {
  return (
    <li>
      <Link
        className="text-text-on-inverted focus:shadow-focus focus:text-text-default flex w-fit items-center gap-1 underline hover:no-underline focus:bg-blue-200 focus:shadow-blue-200"
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}

export default Footer;
