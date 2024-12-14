// replace with values from trello (see README.md)
// these values only make sense in the context of the trello board used in the project
// aka. if you set environment variables .env.local, you need to change these values as well

const dev: { [key: string]: string } = {
  "675c086cf371ab1c1a76d353": "Bruk",
  "675c086cf371ab1c1a76d354": "Eksperimenter",
  "675c086cf371ab1c1a76d355": "Avstå",
};

const prod: { [key: string]: string } = {
  "640e5031258e47b734f693df": "Eksperimenter",
  "640e502477b60be79eaccccc": "Bruk",
  "640e50373232c0d86899a7f1": "Avstå",
};

//process.env.NODE_ENV is set by Webpack's DefinePlugin when scripts are run with npm in package.json
export const listNameById = process.env.NODE_ENV === "production" ? prod : dev;
