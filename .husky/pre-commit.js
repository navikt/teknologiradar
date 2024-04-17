const fs = require("fs");
const lockFiles = [
  "yarn.lock",
  "package-lock.json",
  "bun.lockb",
  "deno.lock",
  "pnpm-lock.yaml",
];
const foundLockFiles = lockFiles.filter((lockFile) => {
  return fs.existsSync(lockFile);
});
if (foundLockFiles.length > 1) {
  console.error(
    `ERROR: multiple lock files found! (${lockFiles.join(", ")}).
Please include only one lock file and try again.`,
  );
  process.exit(1);
}
