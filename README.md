# Pharmacy is a JavaScript app that provides a simple stock management.

## Installation

Use the package manager [npm](https://www.npmjs.com/package/prompt) to install prompt.
```
npm install prompt
```
## Usage

```
const prompt = require('prompt-sync')();
const fs = require('fs');
```

```
touch formulary stock.json
```

## Scenario 1. Medication available in the pharmacy

### To add a medication to a formularly run the following:
./meds.js form add <meds_name>

### To list of medication names in the formulary run the following:
./meds.js form list

## Scenario 2. Medication Inventory
### To add packs for medications already in the formulary list run the following:
./meds.js stock add <meds_name_from_formulary>

### To list the medication in stock and the quantities run the following:
./meds.js stock list

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
