import type { NextPage } from "next";
import { Heading, Link } from "@navikt/ds-react";

const About: NextPage = () => {
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
              Om Teknologiradar
            </Heading>
            <div className="mb-12 mt-5 max-w-2xl font-serif">
              <p className="mb-4 leading-normal">
                Teknologiradaren er et hjelpemiddel for å øke bevissthet og
                samarbeid rundt teknologivalgene som skjer i teamene.
              </p>

              <h2 className="pb-4 pt-4 text-2xl">Bakteppe</h2>
              <p className="mb-4 leading-normal">
                Dagens teknologilandskap er stort og omfattende, og nye
                produkter og teknikker kommer stadig til mens andre forlates. I
                Teknologiradar er tanken at vi skal finne de tingene vi tror det
                er lurt at vi har en felles mening om, både de vi tror er
                interessante å se nærmere på og de vi bør utfase eller unngå.
                Når teamene vurderer produkter, rammeverk, arkitektur eller
                lignende, anbefaler vi å bruke teknologiradaren som en
                veiledning.
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

export default About;
