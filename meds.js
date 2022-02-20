#!/usr/bin/env node

const fs = require('fs');
const prompt = require('prompt-sync')();
const FORMULARY = './formulary';
const STOCK = './stock.json';

const readFormulary = () => {
  try {
    let data = fs.readFileSync(FORMULARY, 'utf8');
    return new Set(data.split('\n').filter(el => el.length > 0));
  } catch (err) { console.error(err) };
};

const writeFormulary = meds => {
  meds = [...meds].sort().map(med => med[0].toUpperCase() + med.slice(1)).join('\n');
  fs.writeFile(FORMULARY, meds, 'utf8', (err) => { if (err) throw err });
};

const readStock = () => {
  try {
    let jsonString = fs.readFileSync(STOCK);
    return JSON.parse(jsonString);
  } catch(err) { console.log(err) };
};

const writeStock = meds => {
  // To ensure that each medName capitalized:
  for (let medName in meds) {
    let upperCasedMedName = medName[0].toUpperCase() + medName.slice(1);
    if (medName !== upperCasedMedName) {
      Object.defineProperty(
        meds, upperCasedMedName,
        Object.getOwnPropertyDescriptor(meds, medName));
      delete meds[medName];
    };
  };
  let jsonContent = JSON.stringify(meds);
  fs.writeFile(STOCK, jsonContent, 'utf8', (err) => { if (err) throw err });
};

const tasks = () => {
  // For the 'form' case:
  if (process.argv[2] === 'form') {
    if (process.argv[3] === undefined) {
      console.log('Command needed after \'form\'!');
    } else if (process.argv[3] === 'list') {
      if (process.argv[4] !== undefined) {
        console.log('No command after \'list\'!');
      } else { return listFormulary() }
    } else if (process.argv[3] === 'add') {
      if (process.argv[4] === undefined) {
        console.log('Specify an item to be added!');
      } else {
        let med = process.argv[4][0].toUpperCase()
                  + process.argv[4].slice(1).split('').map(l => l.toLowerCase()).join('');
        return addToFormulary(med);
      }
    } else { console.log('Unknown command!') };
  // For the 'stock' case:
  } else if ((process.argv[2] === 'stock')) {
    if (process.argv[3] === undefined) {
      console.log('Command needed after \'stock\'!');
    } else if (process.argv[3] === 'list') {
      if (process.argv[4] !== undefined) {
        console.log('No command after \'list\'!');
      } else { return listStock() }
    } else if (process.argv[3] === 'add') {
      if (process.argv[4] === undefined) {
        console.log('Specify an item to be added!');
      } else {
        let med = process.argv[4][0].toUpperCase() + process.argv[4].slice(1);
        return addToStock(med);
      }
    } else { console.log('Unknown command!') };
  // Else case: neither 'form' or 'stock':
  } else { console.log('Unknown command!') };
};

const listFormulary = () => {
  let meds = readFormulary();
  meds.forEach(med => console.log(med));
};

const addToFormulary = med => {
  let meds = readFormulary();
  if ([...meds].includes(med)) {
    console.log('This medicine is already in the database!');
  } else {
    writeFormulary(meds.add(med));
  };
  return listFormulary();
};

const listStock = () => {
  let meds = readStock();
  for (let medName in meds) {
    let med = meds[medName];
    let padding = med.totalPacks < 10 ? '  ' : med.totalPacks < 100 ? ' ' : '';
    console.log(`${med.totalPacks}${padding} x ${medName}, ${med.packSize}x${med.strength}mg`);
  }
};

const promptForNumber = (text) => {
  while (true) {
    input = prompt(`What's the ${text}? `);
    if (input == 0 || Number.isNaN(Number(input))) {
      console.log('Invalid input!');
    } else { return input };
  };
};

const addToStock = med => {
  let meds = readStock();
  if (meds.hasOwnProperty(med)) {
    console.log('This medicine is already in the database!');
  } else {
    let formulary = readFormulary();
    if (formulary.has(med)) {
      meds[med] = {};
      meds[med]['strength'] = promptForNumber('strength in mg');
      meds[med]['packSize'] = promptForNumber('pack size');
      meds[med]['totalPacks'] = promptForNumber('total pack(s)');
      writeStock(meds);
    } else {
      console.log(`'${med}' cannot be added since it's not in the formulary!`)
    };
  };
};

tasks();
