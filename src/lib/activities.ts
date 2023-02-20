import {
  getTrelloCards,
  isActivityCard,
  mapTrelloCardToActivity,
} from "@/lib/trello";
import { Cache } from "@/lib/cache";
import { getActivityNextStartDate } from "@/lib/scheduling";

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

export type NextLearningActivity = LearningActivity & {
  nextOccurrenceAt: number | null;
};

async function fetchActivities({
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
  return cards
    .filter((card) => isActivityCard(card))
    .map((card) => mapTrelloCardToActivity(card));
}

function mapToNextLearningActivity(
  activity: LearningActivity,
  currentTime: Date
) {
  const nextOccurrenceAt =
    getActivityNextStartDate(activity, currentTime)?.getTime() ?? null;
  return { ...activity, nextOccurrenceAt } as NextLearningActivity;
}

function activityComparator(
  a: NextLearningActivity,
  b: NextLearningActivity
): number {
  if (a.nextOccurrenceAt === b.nextOccurrenceAt) return 0;
  if (a.nextOccurrenceAt === null) return 1;
  if (b.nextOccurrenceAt === null) return -1;
  return a.nextOccurrenceAt - b.nextOccurrenceAt;
}

export const getCurrentActivities = (() => {
  const { TRELLO_BOARD_ID, TRELLO_API_KEY, TRELLO_API_TOKEN } = process.env;
  if (!TRELLO_API_KEY || !TRELLO_API_TOKEN || !TRELLO_BOARD_ID) {
    console.log("Trello API not set up, falling back to example data");
    return () => {
      const currentTime = new Date();
      return exampleData.map((activity) =>
        mapToNextLearningActivity(activity, currentTime)
      );
    };
  }
  const fetchIntervalMs = 5 * 60 * 1000;

  const activitiesCache = new Cache({
    loader: async () =>
      fetchActivities({
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
    const activities = await activitiesCache.get(currentTime.getTime());
    const mapped = activities.map((activity) =>
      mapToNextLearningActivity(activity, currentTime)
    );
    mapped.sort(activityComparator);
    return mapped;
  };
})();

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
