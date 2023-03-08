import amplitude, { AmplitudeClient } from "amplitude-js";

let instance: AmplitudeClient | null = null;
const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
if (apiKey && typeof window !== "undefined") {
  instance = amplitude.getInstance();
  instance.init(apiKey, "", {
    apiEndpoint: "amplitude.nav.no/collect",
    saveEvents: false,
    includeUtm: true,
    batchEvents: false,
    includeReferrer: true,
    platform: window.location.toString().split("?")[0].split("#")[0],
  });
}

interface PageViewData {
  page: string;
}

export const logPageView = (data: { [key: string]: string } & PageViewData) => {
  const eventName = "pageView";
  console.log("Sending to Amplitude", eventName, data);
  const title = typeof window === "undefined" ? "" : window.document.title;
  instance?.logEvent(eventName, { ...data, title });
};
