import { utcToZonedTime } from "date-fns-tz";
import { LearningActivity, RecurringInterval } from "@/lib/activities";
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
  "6307156d7ca6b4004424fb43": "UpcomingFagtorsdag",
  "630c8bb1d847e5016e5ffe39": "RecurringEveryFagtorsdag",
};

const customFieldNameById: { [key: string]: string } = {
  "63ce2d2e1c1ceb006d7c5bc0": "Room",
  "63ce2cfb41503201ec504740": "Contact",
  "63ce2d4715a9681fb9224d44": "StreamURL",
  "63db5708ca241eb9df2b28fe": "LengthMinutes",
  "63db5bb599475d70574891f8": "ImageURL",
  "63db5cf637a137fc31ab2040": "Emoji",
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
  const m = /## Ingress:\s+(.+?)(\n\n|$)/s.exec(cardDescription);
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
  };
}
