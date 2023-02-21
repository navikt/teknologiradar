import { Linkify } from "@/components/Linkify";

export const ActivityContact = ({
  name,
  role,
}: {
  name: string;
  role: string | null;
}) => {
  return (
    <span className={"activity--contact"}>
      <span className={"activity--contact-name"}>
        <Linkify text={name} />
      </span>
      {role && <span className={"activity--contact-role"}>, {role}</span>}
    </span>
  );
};
