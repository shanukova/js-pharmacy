#!/usr/bin/env node

const fs = require('fs');
const DB = './db';

const readDB = () => {
  try {
    const data = fs.readFileSync(DB, 'utf8');
    dataToSet = new Set(data.split('\n').filter(el => el.length > 0));
    return dataToSet;
  } catch (err) {
    console.error(err);
  };
};

const writeDB = meds => {
  meds = [...meds].sort().join('\n');
  fs.writeFile(DB, meds, (err) => {
    if (err) throw err;
  });
};

const tasks = () => {
  if (process.argv[2] === 'formulary') {
    if (process.argv[3] === undefined) {
      console.log('Command needed after \'formulary\'');
    } else if (process.argv[3] === 'list') {
      return list();
    } else if (process.argv[3] === 'add') {
      return add(process.argv[4]);
    } else {
      console.log('Unknown command!');
    };
  } else {
    console.log('Unknown command!');
  }
};

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
    writeDB(meds.add(med));
    list();
  };
};

tasks();
