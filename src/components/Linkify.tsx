import Link from "next/link";

export const Linkify = ({ text }: { text: string | null }) => {
  if (!text) return null;
  // Parses slack links. Example: <https://example.com|Example label>
  const linkMatch = /^\s*<(.+?)\|(.+)>\s*/.exec(text);
  if (linkMatch) {
    return <Link href={linkMatch[1]}>{linkMatch[2]}</Link>;
  }
  return <>{text}</>;
};
