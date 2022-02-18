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
    console.log('This is to check whether jsonString is implemented...');
    console.log(jsonString);
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
  console.log('This is jsonContent:', jsonContent)
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
        let med = process.argv[4][0].toUpperCase() + process.argv[4].slice(1);
        return addToFormulary(med);
      }
    } else {
      console.log('Unknown command!');
    };

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
    }

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
    console.log(medName, `${med.strength}mg`, med.packSize, med.totalPacks)
  }
};

const checkUserInput = (input, text) => {
  let output = '';
  while (Number.isNaN(Number(input)) || (input === '')) {
    console.log('Invalid input!');
    let tempInput = prompt(`What's the ${text}?`);
    if (!Number.isNaN(Number(tempInput)) && tempInput.length > 0) {
      output = tempInput;
      break;
    };
  };
  return output;
};

const addToStock = med => {
  let meds = readStock();
  if (meds.hasOwnProperty(med)) {
    console.log('This medicine is already in the database!');
  } else {
    let formulary = readFormulary();
    if (formulary.has(med)) {
      meds[med] = {}
      // The case of 'strength':
      let strength = prompt('What\'s the strength?');
      let strengthText = 'strength';
      strength = checkUserInput(strength, strengthText);
      meds[med]['strength'] = Number(strength);

      // The case of 'packSize':
      let packSize = prompt('What\'s the pack size?');
      let packSizeText = 'pack size';
      packSize = checkUserInput(packSize, packSizeText);
      meds[med]['packSize'] = Number(packSize);

      // The case of 'totalPacks':
      let totalPacks = prompt('What\'s the total packs?');
      let totalPacksText = 'total pack(s)';
      totalPacks = checkUserInput(totalPacks, totalPacksText);
      meds[med]['totalPacks'] = Number(totalPacks);

      writeStock(meds);
    } else {
      console.log(`'${med}' cannot be added since it's not in the formulary!`)
    };
  };
  // console.log('This is to check whether the code hits this line...');
  // return listStock();
};

tasks();
