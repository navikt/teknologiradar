import {
  getTrelloCards,
  isActivityCard,
  mapTrelloCardToActivity,
} from "@/lib/trello";
import { Cache } from "@/lib/cache";
import { getActivityNextStartDate, occursOnOrAfter } from "@/lib/scheduling";

export enum RecurringInterval {
  ONE_TIME,
  WEEKLY,
  BI_WEEKLY,
  MONTHLY,
}

export interface ActivityLabel {
  name: string;
  color: string;
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
  editUrl: string;
  listName: string;
  labels: ActivityLabel[];
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
  return cards.map((card) => mapTrelloCardToActivity(card));
}

function mapToNextLearningActivity(
  activity: LearningActivity,
  currentTime: Date,
) {
  const nextOccurrenceAt =
    getActivityNextStartDate(activity, currentTime)?.getTime() ?? null;
  return { ...activity, nextOccurrenceAt } as NextLearningActivity;
}

export function activityComparator(
  a: NextLearningActivity,
  b: NextLearningActivity,
): number {
  if (a.nextOccurrenceAt === b.nextOccurrenceAt) {
    return a.recurringInterval - b.recurringInterval;
  }
  if (a.nextOccurrenceAt === null) return 1;
  if (b.nextOccurrenceAt === null) return -1;
  return a.nextOccurrenceAt - b.nextOccurrenceAt;
}

export const getCurrentActivities = (() => {
  const { TRELLO_BOARD_ID, TRELLO_API_KEY, TRELLO_API_TOKEN } = process.env;
  if (!TRELLO_API_KEY || !TRELLO_API_TOKEN || !TRELLO_BOARD_ID) {
    // console.log("Trello API not set up, falling back to example data");
    return (date: string | null, includeCompleted: boolean) => {
      const currentTime = date ? new Date(date) : new Date();
      return exampleData.map((activity) =>
        mapToNextLearningActivity(activity, currentTime),
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

  return async (date: string | null, includeCompleted: boolean) => {
    const currentTime = date ? new Date(date) : new Date();
    const activities = await activitiesCache.get(currentTime.getTime());
    const mapped = activities.map((activity) =>
      mapToNextLearningActivity(activity, currentTime),
    );
    mapped.sort(activityComparator);
    if (!includeCompleted) {
      return mapped.filter((activity) =>
        occursOnOrAfter(activity, currentTime),
      );
    }
    return mapped;
  };
})();

const pad = (num: number) => (num < 10 ? `0${num}` : `${num}`);

export const formatTimeSpan = (
  timeStart: string,
  durationMinutes: number | null,
) => {
  if (durationMinutes === null) return timeStart;
  const [hours, minutes] = timeStart
    .split(/[\.:]/, 2)
    .map((part) => parseInt(part, 10));
  const startDate = new Date();
  startDate.setHours(hours);
  startDate.setMinutes(minutes);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);
  return (
    pad(startDate.getHours()) +
    "." +
    pad(startDate.getMinutes()) +
    "–" +
    pad(endDate.getHours()) +
    "." +
    pad(endDate.getMinutes())
  );
};

const exampleData: LearningActivity[] = [];
