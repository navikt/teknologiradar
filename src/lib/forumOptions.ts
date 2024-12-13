// src/constants/forumOptions.ts
export const forumOptions = [
  "Design",
  "Frontend",
  "Backend",
  "Data science",
  "Data engineering",
  "BI",
] as const;

export type ForumOptions = (typeof forumOptions)[number][];
