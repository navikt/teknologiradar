import Link from "next/link";

export const parseLocation = (
  location: string
): { label: string; link?: string; icon?: string; iconAlt?: string } => {
  if (/\.zoom\.us/.test(location)) {
    return {
      link: location,
      label: "Zoom-møte",
      icon: "/img/zoom.png",
      iconAlt: "Zoom",
    };
  }
  if (/teams\.microsoft\.com/.test(location)) {
    return {
      link: location,
      label: "Teams-møte",
      icon: "/img/teams.png",
      iconAlt: "Teams",
    };
  }
  if (/^#/.test(location)) {
    const slackChannelName = location.substring(1).trim();
    const slackUrl = `https://nav-it.slack.com/archives/${slackChannelName}`;
    return {
      link: slackUrl,
      label: slackChannelName,
      icon: "/img/slack.png",
      iconAlt: "Slack-kanal",
    };
  }
  return {
    label: location,
    icon: "/img/fya1.jpg",
    iconAlt: "Fyrstikkalléen 1",
  };
};

export const ActivityLocation = ({ location }: { location: string }) => {
  const iconSize = 20;
  const loc = parseLocation(location);

  return (
    <span className={"activity--location"}>
      {loc.icon && (
        <img
          src={loc.icon}
          alt={loc.iconAlt!}
          width={`${iconSize}px`}
          height={`${iconSize}px`}
        />
      )}
      {loc.link ? (
        <Link href={loc.link}>{loc.label}</Link>
      ) : (
        <span>{loc.label}</span>
      )}
    </span>
  );
};
