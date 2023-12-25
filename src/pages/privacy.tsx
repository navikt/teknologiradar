import type { NextPage } from "next";
import { Heading, Link } from "@navikt/ds-react";

const Privacy: NextPage = () => {
  return (
    <div className="App">
      <main>
        <div
          style={{
            color: "#fff",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Heading spacing level="1" size="large">
              Personvern
            </Heading>
            <div className="mb-12 mt-5 max-w-2xl font-serif">
              <h2 className="pb-4 text-2xl">
                Personvern og sikkerhet på Teknologiradar
              </h2>
              <p className="mb-4 leading-normal">
                Teknologiradar er en nettside NAV Arbeids- og
                velferdsdirektoratet. Denne personvernerklæringen er knyttet til
                behandlingen av personopplysninger på dette nettstedet. For
                utfyllende informasjon om hvordan NAV behandler
                personopplysninger, kan du lese mer i{" "}
                <a
                  href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten"
                  className="underline hover:no-underline color-white"
                >
                  NAVs generelle personvernerklæring.
                </a>
              </p>

              <h2 className="pb-4 pt-4 text-2xl">
                Bruk av informasjonskapsler (cookies)
              </h2>
              <p className="mb-4 leading-normal">
                Når du besøker nettsiden bruker vi informasjonskapsler
                (cookies).
              </p>

              <p className="mb-4 leading-normal">
                Informasjonskapsler er små tekstfiler som plasseres på din
                datamaskin når du laster ned en nettside. Noen av
                informasjonskapslene er nødvendige for at ulike tjenester på
                nettsiden vår skal fungere slik vi ønsker. Funksjonen kan slås
                av og på i de fleste nettlesere gjennom «innstillinger»,
                «sikkerhet» eller liknende. Hvis du slår av informasjonskapsler
                i nettleseren din, vil ikke all funksjonalitet virke som den
                skal. Informasjonskapsler inneholder ikke personopplysninger og
                er ingen sikkerhetsrisiko for deg.
              </p>
              <p className="mb-4 leading-normal">
                Vi bruker informasjonskapsler til å forbedre brukeropplevelsen
                og innholdet. Når du besøker aksel.nav.no, sender nettleseren
                din opplysninger til NAVs analyseverktøy. For hver side du
                åpner, lagres opplysninger om hvilken side du er på, hvilken
                side du kommer fra og går til, hvilken nettleser du bruker, om
                du bruker PC eller mobile løsninger m.m. Slik kan vi forbedre
                flyten og opplevelsen for alle som bruker nettsiden.
              </p>
              <p className="mb-4 leading-normal">
                Opplysningene brukes til å kartlegge hvordan og hvor mye
                delta.nav.no brukes, uten å identifisere IP-adresser. Vi bruker
                verktøyet Amplitude i analysearbeidet.
              </p>
              <h2 className="pb-4 pt-4 text-2xl">
                Feil, mangler og forbedringsforslag
              </h2>
              <p className="leading-normal">
                Hvis du opplever problemer eller har forslag til forbedringer
                hører vi veldig gjerne fra deg! Feil og mangler kan rapporteres
                til{" "}
                <a
                  className="underline hover:no-underline color-white"
                  href="mailto:eilif.johansen@nav.no"
                >
                  eilif.johansen@nav.no
                </a>
                , eller{" "}
                <a
                  className="underline hover:no-underline color-white"
                  href="https://nav-it.slack.com/archives/CEHSHMNBF"
                >
                  #teknologiradar
                </a>{" "}
                på Slack.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
