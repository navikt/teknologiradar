import {
  getTrelloCards,
  isActivityCard,
  mapTrelloCardToActivity,
} from "@/lib/trello";

export enum RecurringInterval {
  ONE_TIME,
  WEEKLY,
  BI_WEEKLY,
  MONTHLY,
}

export interface LearningActivity {
  id: string;
  date: string | null;
  recurringInterval: RecurringInterval;
  timeStart: string | null;
  durationMinutes: number | null;
  title: string;
  emoji: string | null;
  contactName: string | null;
  contactRole: string | null;
  imageUrl: string | null;
  description: string;
  locations: string[];
}

export const getCurrentActivities = async () => {
  const cards = await getTrelloCards({
    trelloBoardId: process.env.TRELLO_BOARD_ID!,
    trelloApiToken: process.env.TRELLO_API_TOKEN!,
    trelloApiKey: process.env.TRELLO_API_KEY!,
  });
  return cards
    .filter((card) => isActivityCard(card))
    .map((card) => mapTrelloCardToActivity(card));
};

export const getExampleData = async () => exampleData;

const exampleData: LearningActivity[] = [
  {
    id: "9dec01a0-da3b-486a-a105-6b10f24bac55",
    title: "Faggruppe NLP (Natural language processing)",
    description:
      "Målet er å utforske NLP både teoretisk og praktisk. Denne gangen setter vi oss ned og planlegger hva som skjer videre med faggruppen.",
    date: "2023-02-09",
    timeStart: "12.00",
    recurringInterval: 2,
    locations: ["A123", "https://teams.microsoft.com/"],
    durationMinutes: 90,
    contactName: "Enel P.",
    contactRole: "Data Scientist",
    imageUrl: null,
    emoji: "🤖",
  },
  {
    id: "c1556fb4-18ef-4928-9598-ed43698e6410",
    title: "Faggruppe Hack / CTF (Capture the flag)",
    description:
      "Faggruppen tenker blant annet å teste ut tryhackme/hackthebox for å lære mer om hacking og generelt om plattformene er noe vi kan bruke i NAV i forbindelse med sikker utvikling og opplæring av Security Champions.",
    date: "2023-02-09",
    timeStart: "12.00",
    recurringInterval: 2,
    locations: ["#faggruppe-hack", "https://nav-it.zoom.us/j/00000000000"],
    durationMinutes: 240,
    contactName: "Hakk Hakkersen",
    contactRole: "Utvikler og Security Champion",
    imageUrl: "/img/fagtorsdag.png",
    emoji: ":hackerman:",
  },
  {
    id: "5c607139-0422-4387-80d0-0036337bd7c2",
    title: "Lean Coffee",
    description:
      'Opplegget springer ut av et ønske om å fortsette diskusjonen om gap i organisasjonen i etterkant av fagfestivalen "Mind the Gap" før jul. Det er åpent for å ta opp alle slags temaer man måtte ha på hjertet, gap eller ikke, enten det gjelder psykologisk trygghet og tillit innad i team, mellom team, mellom team og ledelse, mellom ulike fagdisipliner, på tvers i organisasjonen, eller noe helt annet. Arrangementet er åpent for alle. Dersom det blir mange av oss, splitter vi oss organisk i mindre enheter. Håper vi sees!',
    date: "2023-02-09",
    timeStart: "14.00",
    recurringInterval: 2,
    locations: ["Fellesområdet 4. etg B/C"],
    durationMinutes: 60,
    contactName: "Agil Kaffeliker",
    contactRole: "med flere",
    imageUrl: "/img/fagtorsdag.png",
    emoji: "☕️",
  },
];
