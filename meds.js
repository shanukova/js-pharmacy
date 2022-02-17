#!/usr/bin/env node

const fs = require("fs");
const DB = "./db";

const readDB = () => {
  try {
    const data = fs.readFileSync(DB, 'utf8');
    dataToSet = new Set(data.split("\n").filter(el => el.length > 0));
    return dataToSet;
  } catch (err) {
    console.error(err);
  };
};

const writeDB = meds => {
  console.log('Calling writeDB method')
  meds = [...meds].sort().join('\n');
  fs.writeFile(DB, meds, (err) => {
    if (err) throw err;
  });
};

const tasks = () => {
  if (process.argv[2] === "list") {
    return list();
  } else if (process.argv[2] === "add") {
    return add(process.argv[3]);
  } else {
    console.log('Unknown command!');
  };
}

const list = () => {
  const meds = readDB();
  meds.forEach(med => {
    console.log(med);
  });
};

const add = med => {
  const meds = readDB();
  if ([...meds].includes(med)) {
    console.log('This medicine is already in the database!');
  } else {
    [...meds].push(med);
    writeDB(meds);
    list();
  };
}

tasks();
