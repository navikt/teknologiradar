import { Cache } from "@/lib/cache";
import { getTrelloCards, mapTrelloCardToTechnology } from "@/lib/trello";

export interface TechnologyLabel {
  name: string;
  color: string;
}

export type Technology = {
  id: string;
  title: string;
  description: string;
  editUrl: string;
  listName: string;
  labels: TechnologyLabel[];
};

async function fetchTechnologies({
  trelloBoardId,
  trelloApiToken,
  trelloApiKey,
}: {
  trelloBoardId: string;
  trelloApiToken: string;
  trelloApiKey: string;
}) {
  const cards = await getTrelloCards({
    trelloBoardId,
    trelloApiToken,
    trelloApiKey,
  });
  return cards.map((card) => mapTrelloCardToTechnology(card));
}

export const getCurrentTechnologies = (() => {
  const { TRELLO_BOARD_ID, TRELLO_API_KEY, TRELLO_API_TOKEN } = process.env;
  if (!TRELLO_API_KEY || !TRELLO_API_TOKEN || !TRELLO_BOARD_ID) {
    return () => {
      return exampleData;
    };
  }
  const fetchIntervalMs = 5 * 60 * 1000;

  const technologiesCache = new Cache({
    loader: async () =>
      fetchTechnologies({
        trelloBoardId: TRELLO_BOARD_ID,
        trelloApiKey: TRELLO_API_KEY,
        trelloApiToken: TRELLO_API_TOKEN,
      }),
    onError: (err) => console.error("Error fetching Trello cards", err),
    fetchIntervalMs,
  });

  console.log(`Trello API configured, caching data for ${fetchIntervalMs} ms`);

  return async () => {
    const currentTime = new Date();
    const mapped = await technologiesCache.get(currentTime.getTime());
    return mapped;
  };
})();

const exampleData: Technology[] = [
  {
    id: "spring-boot",
    title: "Spring Boot",
    description:
      "Spring Boot er et åpen kildekode rammeverk for bygging av Java-baserte, produksjonsklare webapplikasjoner og mikrotjenester. Det er en del av det større Spring Framework-økosystemet og er spesielt utviklet for å gjøre det enklere å sette opp, utvikle og distribuere Spring-applikasjoner",
    editUrl: "https://example.com",
    listName: "Bruk",
    labels: [{ name: "Backend", color: "#aaffaa" }],
  },
  {
    id: "react-testing-library",
    title: "React Testing Library",
    description: `
Beskrivelse

React Testing Library (RTL) og dets søster-biblioteker for andre rammeverk er designet for å teste slik brukeren interagerer med systemet, og teste faktisk utfall, ikke internlogikk. I tillegg er det innebygget testing av universell utforming, ved at man leter etter elementer basert på rolle, tekstlig verdi og status, som er samme informasjon som kommuniseres til skjermlesere.

Begrunnelse

Tradisjonelle test-rammeverk for frontend har ofte basert seg på test-ID-er og API-er som tester logikk mer enn brukerinteraksjon. Dette retter Testing Library opp i, ved å tilby API-er som presser frem testing som ligner på slik vi ville ha testet manuelt. "Finn radio-knappen som har teksten 'et-eller-annet', klikk på den. Finn 'Neste'-knappen og klikk på den. Se at du kom til neste side, og ikke at det vises en feilmelding." Slik ville jeg testet selv, og akkurat det samme støtter RTL. Biblioteket har også inspirert andre test-rammeverk, som Cypress o.l., og er blitt en industristandard for frontend-testing.`,
    editUrl: "https://example.com",
    listName: "Bruk",
    labels: [{ name: "Frontend", color: "#aaaaff" }],
  },
  {
    id: "incomplete-data-test-2",
    title: "incomplete data test 2",
    description: `incomplete data test`,
    editUrl: "https://example.com",
    listName: "Avstå",
    // @ts-ignore
    labels: [{}],
  },
];
