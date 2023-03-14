import { utcToZonedTime } from "date-fns-tz";
import {
  ActivityLabel,
  LearningActivity,
  RecurringInterval,
} from "@/lib/activities";
import { LOCAL_TIMEZONE } from "@/lib/fagtorsdag";

export interface Label {
  id: string;
  idBoard: string;
  name: string;
  color: string;
}

export interface Value {
  text?: string;
  number?: string;
}

export interface CustomFieldItem {
  id: string;
  value: Value;
  idCustomField: string;
  idModel: string;
  modelType: string;
}

export interface TrelloCard {
  id: string;
  dateLastActivity: string;
  desc: string;
  due: string | null;
  idList: string;
  labels: Label[];
  name: string;
  pos: number;
  shortUrl: string;
  start: string | null;
  url: string;
  customFieldItems: CustomFieldItem[];
}

const listNameById: { [key: string]: string } = {
  "640e50418295928b01d5be0a": "Kandidat",
  "640e5031258e47b734f693df": "Assess",
  "640e502a91ab01a800eba0e0": "Trial",
  "640e502477b60be79eaccccc": "Adopt",
  "640e5049a20f175fce555ea2": "Omstridt",
  "640e50373232c0d86899a7f1": "Hold",
  "630c8bb1d847e5016e5ffe39": "RecurringEveryFagtorsdag",
  "63071581bbd9350032142ad9": "CompletedActivities",
};

const customFieldNameById: { [key: string]: string } = {
  "63ce2d2e1c1ceb006d7c5bc0": "Room",
  "63ce2cfb41503201ec504740": "Contact",
  "63ce2d4715a9681fb9224d44": "StreamURL",
  "63db5708ca241eb9df2b28fe": "LengthMinutes",
  "63db5bb599475d70574891f8": "ImageURL",
  "63db5cf637a137fc31ab2040": "Emoji",
};

const TRELLO_FALLBACK_COLOR = "#AAAAAA";
const TRELLO_COLORS: { [key: string]: string } = {
  green_light: "#EEF6EC",
  green: "#D6ECD2",
  green_dark: "#B7DDB0",
  yellow_light: "#FDFAE5",
  yellow: "#FAF3C0",
  yellow_dark: "#F5EA92",
  orange_light: "#FDF4E7",
  orange: "#FCE6C6",
  orange_dark: "#FAD29C",
  red: "#F5D3CE",
  red_light: "#FBEDEB",
  red_dark: "#EFB3AB",
  purple_light: "#F7F0FA",
  purple: "#EDDBF4",
  purple_dark: "#DFC0EB",
  blue_light: "#E4F0F6",
  blue: "#BCD9EA",
  blue_dark: "#8BBDD9",
  sky_light: "#E4F7FA",
  sky: "#BDECF3",
  sky_dark: "#8FDFEB",
  lime_light: "#ECFBF3",
  lime: "#D3F6E4",
  lime_dark: "#B3F1D0",
  pink_light: "#FEF1F9",
  pink: "#FCDCEF",
  pink_dark: "#F9C2E4",
  black_light: "#EBECF0",
  black: "#DFE1E6",
  black_dark: "#C1C7D0",
};

export async function getTrelloCards({
  trelloBoardId,
  trelloApiKey,
  trelloApiToken,
}: {
  trelloBoardId: string;
  trelloApiKey: string;
  trelloApiToken: string;
}): Promise<TrelloCard[]> {
  const url = `https://api.trello.com/1/boards/${trelloBoardId}/cards?customFieldItems=true`;
  const authorization = `OAuth oauth_consumer_key=\"${trelloApiKey}\", oauth_token=\"${trelloApiToken}\"`;
  try {
    const resp = await fetch(url, { headers: { authorization } });
    const data = await resp.json();
    return data as TrelloCard[];
  } catch (e) {
    console.error("Error fetching Trello cards", e);
    return [];
  }
}

function parseCustomFields(customFields: CustomFieldItem[]) {
  const fields: { [key: string]: string | null } = {};
  customFields?.forEach((field) => {
    const name = customFieldNameById[field.idCustomField];
    if (name) {
      fields[name] = field.value.text ?? field.value.number ?? null;
    }
  });
  return fields;
}

export function extractDescription(cardDescription: string) {
  if (!/^#/m.test(cardDescription)) {
    return cardDescription ?? "";
  }

  const m = /## Ingress:\s+(.+?)(\n\n#|\n---|$)/s.exec(cardDescription);
  if (!m) {
    return "";
  }
  return m[1].trim();
}

export function isActivityCard(trelloCard: TrelloCard) {
  return listNameById[trelloCard.idList] !== undefined;
}

function pad(num: number) {
  return num < 10 ? `0${num}` : `${num}`;
}

export function mapTrelloCardToActivity(
  trelloCard: TrelloCard
): LearningActivity {
  const activityStartDate = trelloCard.due ?? trelloCard.start;
  const dateTime = activityStartDate
    ? utcToZonedTime(activityStartDate, LOCAL_TIMEZONE)
    : null;

  const date = dateTime?.toISOString().substring(0, 10) ?? null;
  const timeStart = dateTime
    ? pad(dateTime?.getHours()) + "." + pad(dateTime?.getMinutes())
    : null;

  const listName = listNameById[trelloCard.idList];
  const recurringInterval =
    listName === "RecurringEveryFagtorsdag"
      ? RecurringInterval.BI_WEEKLY
      : RecurringInterval.ONE_TIME;

  const customFields = parseCustomFields(trelloCard.customFieldItems);

  const locations: string[] = [];
  if (customFields["Room"]) locations.push(customFields["Room"]);
  if (customFields["StreamURL"]) locations.push(customFields["StreamURL"]);

  const durationMinutes = customFields["LengthMinutes"]
    ? parseInt(customFields["LengthMinutes"], 10)
    : null;

  const contact = customFields["Contact"] ?? "";
  const [contactName, contactRole] = contact.split(",").map((v) => v.trim());
  const imageUrl = customFields["ImageURL"] || null;
  const emoji = customFields["Emoji"] || null;

  const description = extractDescription(trelloCard.desc);

  const labels: ActivityLabel[] = trelloCard.labels.map((trelloLabel) => ({
    name: trelloLabel.name,
    color: TRELLO_COLORS[trelloLabel.color] ?? TRELLO_FALLBACK_COLOR,
  }));

  return {
    id: trelloCard.id,
    title: trelloCard.name,
    description,
    date,
    timeStart,
    recurringInterval,
    locations,
    durationMinutes,
    contactName: contactName ?? null,
    contactRole: contactRole ?? null,
    imageUrl,
    emoji,
    editUrl: trelloCard.shortUrl,
    labels,
    listName,
  };
}
