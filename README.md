# Endpoint - Backend Coding Challenge

## Setup
This script uses Node.js and NPM

Make sure to install the dependencies:

```bash
npm install
```

## Run the Typescript compiler

```bash
npm run build
```

## Run The sample input

```bash
# Linux
npm run sample

# Windows CMD or Powershell
npm run sample:windows
```

## Run custom input

```bash
# File input (Linux)
cat customFile.txt | npm start

# File input (Windows CMD or Powershell)
type customFile.txt | npm start

# Pasting input
echo "CREATE fruits
CREATE vegetables
LIST" | npm start
```

## Run unit tests for Directory and Commands

```bash
npm t
```