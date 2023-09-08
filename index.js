const { Builder, By, Key, until } = require("selenium-webdriver");

async function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const colorObj = {
  "linear-gradient(to right bottom, rgb(167, 233, 118), rgb(41, 208, 106))": "//button",
  "linear-gradient(to right bottom, rgb(253, 151, 122), rgb(252, 79, 149))": "//button[3]",
  "linear-gradient(to right bottom, rgb(252, 92, 144) 50%, rgb(191, 115, 247) 0px)": "//button[3]",
  "linear-gradient(to right bottom, rgb(54, 212, 107) 50%, rgb(191, 115, 247) 0px)": "//button",
};

const amountButtonAccordingToUser = {
  1: "//div[7]/div/div[2]/div[3]/div/div",
  5: "//div[2]/div[3]/div/div[2]",
  10: "//div[2]/div[3]/div/div[2]",
};

async function chalJa() {
  // Create a WebDriver instance
  const driver = await new Builder().forBrowser("chrome").build();

  const selectAmountAndClickBet = async () => {
    sleep(2).then(async () => {
      try {
        const amountButton = await driver.findElement(By.xpath(amountButtonAccordingToUser[1]));
        await amountButton.click();

        const betButton = await driver.findElement(By.xpath("//div/div[7]/div/div[3]/div[2]"));
        await betButton.click();
      } catch (e) {
        console.log("Amount Button and click bet error", e);
      }
    });
  };

  const clickONColor = async () => {
    sleep(6).then(async () => {
      try {
        const colorButton = await driver.findElement(By.xpath("//div[5]/div/span"));
        const colorButtonCss = await colorButton.getCssValue("background-image");

        const toclickOnColor = await driver.findElement(By.xpath(colorObj[colorButtonCss]));
        await toclickOnColor.click();

        console.log("Color Bet");

        selectAmountAndClickBet();
      } catch (e) {
        console.log("Color Slection Err", e.message);
      }
    });
  };

  await driver.manage().window().setRect({ width: 1366, height: 768 });

  // Open a website
  driver.get("https://9987up.cc/#/login");

  //Click on userId

  const elementUserId = await driver.findElement(By.xpath("//input[@type='text']"));

  await elementUserId.sendKeys("/Your Id/");

  //Click on passwod

  const elementPassword = await driver.findElement(By.xpath("//input[contains(@class,'pw-input')]"));

  await elementPassword.sendKeys("/Your password/");

  //Click to loginButton

  const loginButton = await driver.findElement(By.xpath("//button[contains(.,'Log In')]"));

  await loginButton.click();

  //Remove prompt

  sleep(5)
    .then(async () => {
      const confirmButton = await driver.findElement(By.xpath("//button[contains(.,'Confirm')]"));

      await confirmButton.click();
    })
    .finally(async () => {
      driver.sleep(3000);

      driver.executeScript("window.scroll(0, 500);").then((e) => console.log("Trx window scroll"));

      const trxSelect = await driver.findElement(By.xpath("//div[@class='info i7'][contains(.,'Trx Hash Guess number/Green/Purple/Red to win')]"));
      await trxSelect.click();

      driver.sleep(6000).then(async () => {
        driver.executeScript("window.scroll(0, 280);").then((e) => console.log("Betting window scroll"));
      });

      sleep(10).then(() => {
        console.log("Engine start");
        const timeCheckLoop = setInterval(async () => {
          const secondsLeft = await driver.findElement(By.xpath("(//span[@class='item'])[3]"));
          const secondsRight = await driver.findElement(By.xpath("(//span[@class='item'])[4]"));

          let leftValue = await secondsLeft.getText();
          let rightValue = await secondsRight.getText();

          //@when interval reach 30 sec...break the lloop

          process.stdout.write(`\r${Number(leftValue + rightValue)},`);

          if (Number(leftValue + rightValue) === 30) {
            console.log("::::::::::Time to bet:::::::");
            // clearInterval(timeCheckLoop)

            let bigSmallTag;
            let bigOrSmallValue;

            try {
              bigSmallTag = await driver.findElement(By.xpath("//div[5]/div/div/span"));
              bigOrSmallValue = await bigSmallTag.getText();
            } catch (e) {
              console.log("Big small button not found");
            }

            console.log("OutCome", bigOrSmallValue);

            if (bigOrSmallValue === "S") {
              console.log("Betting on Small");
              const selectSmallButtonToBet = await driver.findElement(By.xpath("//button[contains(.,'SMALL')]"));
              await selectSmallButtonToBet.click();
              selectAmountAndClickBet().then(() => clickONColor());
            } else {
              //B parr laga do

              console.log("Betting on Biggg");
              const selectBigButtonToBet = await driver.findElement(By.xpath("//button[contains(.,'BIG')]"));
              await selectBigButtonToBet.click();

              selectAmountAndClickBet().then(() => clickONColor());
            }
          }
        }, 1000);
      });
    });
}

chalJa();
