import { Technology, TechnologyLabel } from "@/lib/technologies";
import { listNameById } from "config";

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

export function isTechnologyCard(trelloCard: TrelloCard) {
  return listNameById[trelloCard.idList] !== undefined;
}

export function mapTrelloCardToTechnology(trelloCard: TrelloCard): Technology {
  const listName = listNameById[trelloCard.idList];

  const description = extractDescription(trelloCard.desc);

  const labels: TechnologyLabel[] = trelloCard.labels.map((trelloLabel) => ({
    name: trelloLabel.name,
    color: TRELLO_COLORS[trelloLabel.color] ?? TRELLO_FALLBACK_COLOR,
  }));

  return {
    id: trelloCard.id,
    title: trelloCard.name,
    description,
    editUrl: trelloCard.shortUrl,
    labels,
    listName,
  };
}
