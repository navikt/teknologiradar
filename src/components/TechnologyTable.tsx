import { Technology, TechnologyLabel } from "@/lib/technologies";
import { Table } from "@navikt/ds-react";
import {
  TableBody,
  TableDataCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@navikt/ds-react/Table";
import Link from "next/link";

const colorMap = {
  Uavklart: "kandidat-color",
  Eksperiment: "trial-color",
  Vurder: "trial-color",
  Bruk: "adopt-color",
  Avstå: "hold-color",
  Omstridt: "omstridt-color",
};

// DRY: duplication of this on client & server side (get via API?)
export const forumOptions = [
  "Design",
  "Frontend",
  "Backend",
  "Data science",
  "Data engineering",
] as const;

const Label = ({ label }: { label: TechnologyLabel }) => {
  return (
    <span
      className={"activity--label"}
      style={{ backgroundColor: label.color }}
    >
      {label.name}
    </span>
  );
};

const LabelList = ({ labels }: { labels: TechnologyLabel[] }) => {
  const _forumOptions: readonly string[] = forumOptions;
  const _labels = labels.filter((label) => _forumOptions.includes(label.name));

  return (
    <span className={"activity--label-list"}>
      {_labels.map((label, idx) => (
        <Label key={idx} label={label} />
      ))}
    </span>
  );
};

export const TechnologyTable = ({
  technologies,
}: {
  technologies: Technology[];
}) => {
  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <Table
        className={"activity--table table-fixed"}
        style={{ overflow: "scroll", marginTop: "20px" }}
      >
        <TableHeader className={"color-blue"}>
          <TableRow>
            <TableHeaderCell className="w-[300px]" scope="col">
              Teknologi
            </TableHeaderCell>
            <TableHeaderCell className="w-[100px]" scope="col">
              Status
            </TableHeaderCell>
            <TableHeaderCell scope="col">Forum</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {technologies.map((technology) => (
            <TableRow key={technology.id}>
              <TableDataCell>
                <Link
                  className={"blue-link"}
                  href={`/technologies/${technology.id}`}
                >
                  {technology.title}
                </Link>
              </TableDataCell>
              <TableDataCell>
                <span
                  className={`activity--label ${colorMap[technology.listName]}`}
                >
                  {technology.listName}
                </span>
              </TableDataCell>
              <TableDataCell className="whitespace-nowrap">
                {technology.labels.length > 0 && (
                  <LabelList labels={technology.labels} />
                )}
              </TableDataCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
