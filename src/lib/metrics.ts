import amplitude, { AmplitudeClient } from "amplitude-js";

const isProdEnvironment = () =>
  typeof window !== "undefined" &&
  window.location.hostname === "fagtorsdag.intern.nav.no";

let instance: AmplitudeClient | null = null;
if (isProdEnvironment()) {
  const apiKey = "22c445c9be44f0221bf97a4bbb1c3bce";

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
