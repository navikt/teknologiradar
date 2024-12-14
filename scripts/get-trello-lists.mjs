import * as dotenv from "dotenv";

dotenv.config({ path: `.env.local` });

const trelloBoardId = process.env["TRELLO_BOARD_ID"];
const trelloApiKey = process.env["TRELLO_API_KEY"];
const trelloApiToken = process.env["TRELLO_API_TOKEN"];

const url = `https://api.trello.com/1/boards/${trelloBoardId}/lists`;
const authorization = `OAuth oauth_consumer_key=\"${trelloApiKey}\", oauth_token=\"${trelloApiToken}\"`;


(async () => {
  try {
    const resp = await fetch(url, { headers: { authorization } });
    const data = await resp.json();
    console.log(data.reduce((accumulatorObject, currentTrelloList) => (
      { ...accumulatorObject, [currentTrelloList.id]: currentTrelloList.name}), {}));
  } catch (e) {
    console.error("Error fetching Trello cards", e);
  }
})();