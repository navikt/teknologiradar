import * as dotenv from "dotenv";
import { getForumOptions } from "./trello";

// Last inn miljøvariabler fra `.env.local`
dotenv.config({ path: `.env.local` });

// Definer typer for miljøvariablene (string eller undefined)
const trelloBoardId: string | undefined = process.env["TRELLO_BOARD_ID"];
const trelloApiKey: string | undefined = process.env["TRELLO_API_KEY"];
const trelloApiToken: string | undefined = process.env["TRELLO_API_TOKEN"];

// Valider at miljøvariablene er definert
if (!trelloBoardId || !trelloApiKey || !trelloApiToken) {
  throw new Error("En eller flere TRELLO-miljøvariabler mangler.");
}

// Asynkron funksjon for å logge forumalternativer

(async () => {
  try {
    const options = await getForumOptions({
      trelloBoardId,
      trelloApiKey,
      trelloApiToken,
    });
    console.log(options);
  } catch (error) {
    console.error("Feil under henting av forumalternativer:", error);
  }
})();
