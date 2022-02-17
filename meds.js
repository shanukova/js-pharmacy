#!/usr/bin/env node

const fs = require('fs');
const FORMULARY = './formulary';

const readFormulary = () => {
  try {
    const data = fs.readFileSync(FORMULARY, 'utf8');
    dataToSet = new Set(data.split('\n').filter(el => el.length > 0));
    return dataToSet;
  } catch (err) {
    console.error(err);
  };
};

const writeFormulary = meds => {
  meds = [...meds].sort().join('\n');
  fs.writeFile(FORMULARY, meds, (err) => {
    if (err) throw err;
  });
};

const tasks = () => {
  if (process.argv[2] === 'formulary') {
    if (process.argv[3] === undefined) {
      console.log('Command needed after \'formulary\'');
    } else if (process.argv[3] === 'list') {
      return listFormulary();
    } else if (process.argv[3] === 'add') {
      return addFormulary(process.argv[4]);
    } else {
      console.log('Unknown command!');
    };

  } else if ((process.argv[2] === 'stock')) {
    if (process.argv[3] === undefined) {
      console.log('Command needed after \'stock\'');
    }

  } else {
    console.log('Unknown command!');
  }
};

const listFormulary = () => {
  const meds = readFormulary();
  meds.forEach(med => console.log(med));
};

const addFormulary = med => {
  const meds = readFormulary();
  if ([...meds].includes(med)) {
    console.log('This medicine is already in the database!');
  } else {
    writeFormulary(meds.add(med));
    listFormulary();
  };
};

tasks();
