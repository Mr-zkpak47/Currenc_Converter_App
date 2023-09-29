import * as fs from "fs";
import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import figlet from "figlet";
import gradient from "gradient-string";

const exitText = async() => {
  figlet.text(
    "Thanks for using our Currency Converter App.",
    {
      font:"Standard",
      horizontalLayout: "full",
      verticalLayout: "fitted",
      width:150,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log(data);
    }
  );
};

let conversionRates: any;
const sleep = async () => {
  return new Promise((res) => {
    setTimeout(res, 2000);
  });
};

const terminalWidth = process.stdout.columns; // Get the width of the terminal

// Function to center-align text
function centerText(text: string) {
  const padding = Math.max(0, Math.floor((terminalWidth - text.length) / 2)); // Calculate padding
  const centeredText = " ".repeat(padding) + text + " ".repeat(padding); // Add padding
  return centeredText;
}

const welcome = async () => {
  const textToCenter = "Welcome to our Currency Converter App ";
  const centeredText = centerText(textToCenter);
  const TextAnimation = chalkAnimation.rainbow(centeredText);
  TextAnimation.start();
  await sleep();
  TextAnimation.stop();
  let logo = gradient.rainbow(`
  _________                                                   _________                                   __                
  \\_   ___ \\ __ ________________   ____   ____   ____ ___.__. \\_   ___ \\  ____   _______  __ ____________/  |_  ___________ 
  /    \\  \\/|  |  \\_  __ \\_  __ \\_/ __ \\ /    \\_/ ___<   |  | /    \\  \\/ /  _ \\ /    \\  \\/ // __ \\_  __ \\   __\\/ __ \\_  __ \\
  \\     \\___|  |  /|  | \\/|  | \\/\\  ___/|   |  \\  \\___\\___  | \\     \\___(  <_> )   |  \\   /\\  ___/|  | \\/|  | \\  ___/|  | \\/
   \\______  /____/ |__|   |__|    \\___  >___|  /\\___  > ____|  \\______  /\\____/|___|  /\\_/  \\___  >__|   |__|  \\___  >__|   
          \\/                          \\/     \\/     \\/\\/              \\/            \\/          \\/                 \\/       
  `);
  console.log(logo)
  await sleep()
};
const fetchData = async () => {
  const rawData = fs.readFileSync("SampleOutput.json", "utf8");
  const data = await JSON.parse(rawData);
  conversionRates = data.conversion_rates;
  return conversionRates;
};

let data: Promise<void> = await fetchData();
let countries: string[] = Object.keys(data);
const currencyConverter = async () => {
  const firstCountry = await inquirer.prompt({
    type: "list",
    name: "select",
    message: "Please select your first country : ",
    choices: countries,
  });
  let firstCountryConversionRate = conversionRates[firstCountry.select];
  const secondCountry = await inquirer.prompt({
    type: "list",
    name: "select",
    message: "Please select your second country : ",
    choices: countries,
  });
  let secondCountryConversionRate = conversionRates[secondCountry.select];
  const amount = await inquirer.prompt({
    type: "input",
    name: "rupee",
    message: "Please enter your amount : ",
  });
  let conversionRate = secondCountryConversionRate / firstCountryConversionRate;
  let finalCurrency = amount.rupee * conversionRate;
  const spinner = createSpinner(
    chalk.red(`Converting from ${firstCountry.select} to ${secondCountry.select}`
  )).start();
  await sleep();
  spinner.success({
    text: chalk.green(`Converted from ${firstCountry.select} to ${secondCountry.select} : ${finalCurrency}`),
  });
};
console.clear()
await welcome();
await currencyConverter();
do {
  const repeater = async () => {
    const options = await inquirer.prompt({
      type: "list",
      name: "select",
      message: "Choose the following options : ",
      choices: ["Currency Converter", "Exit"],
    });
    if (options.select == "Currency Converter") {
      const spinner = createSpinner("Starting Again Currency Converter App : ");
      spinner.start();
      await sleep();
      spinner.stop();
      const welcomeAgainText = `Welcome Again Buddy.`
      const textCenter = centerText(welcomeAgainText);
      const textAnimation = chalkAnimation.rainbow(textCenter)
      await textAnimation.start()
      await sleep();
      await textAnimation.stop()
      await currencyConverter();
    }
    if (options.select == "Exit") {
      const spinner = createSpinner(`Exiting`);
      spinner.start({text:chalk.green("Exiting"),color:"red"});
      await sleep();
      spinner.success({ text:chalk.greenBright(`Exited`)});
      await sleep();
      await exitText()
      await sleep()
      process.exit();
    }
  };
  await repeater();
} while (true); 
