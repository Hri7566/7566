const Job = require('./Job');
const LicenseItem = require('./LicenseItem');

module.exports = {
    pizza: new Job("Pizza Baker", [
        "&NAME cooked a pizza and made &AMOUNT.",
        "&NAME sliced those pepperonis and shredded that cheese and made &AMOUNT.",
        "&NAME said \"Mama mia!\" and made a pizza and earned &AMOUNT.",
        "&NAME make-a de pizza pie and-a make-a de &AMOUNT money.",
        "Pizza pie come-a de make-a de pizza by de &NAME and-a earn-a de &AMOUNT-a.",
        "&NAME made a pizza and earned &AMOUNT.",
        "&NAME earned &AMOUNT from cooking pizza."
    ], 70, 75, 10),
    farmer: new Job("Farmer", [
        "&NAME plowed the field and made &AMOUNT.",
        "&NAME sold their vegetation and earned &AMOUNT.",
        "&NAME dang ol' makin plants and made &AMOUNT.",
        "&NAME harnessed their inner green thumb and earned &AMOUNT from selling plants.",
        "Farmer friend &NAME made &AMOUNT."
    ], 125, 150, 15, new LicenseItem("Farmer License", true, 500)),
    butcher: new Job("Butcher", [
        "&NAME sliced their meat and made &AMOUNT.",
        "&NAME slaughtered animals and made &AMOUNT.",
        "&NAME cuttin' those cows and makin' &AMOUNT.",
        "&NAME plucked those chickens and made &AMOUNT.",
        "&NAME sliced a pig's head off and made &AMOUNT."
    ], 130, 175, 15, new LicenseItem("Butcher License", true, 1000)),
    lumberjack: new Job("Lumberjack", [
        "&NAME cut down trees and earned &AMOUNT.",
        "&NAME earned &AMOUNT from chopped wood.",
        "&NAME sold firewood for &AMOUNT.",
        "&NAME sold &AMOUNT worth of Christmas trees."
    ], 160, 200, 25, new LicenseItem("Lumberjack License", true, 5000)),
    webdev: new Job("Web Developer", [
        "&NAME made a website and earned &AMOUNT"
    ], 200, 275, 35, new LicenseItem("Developer Console", true, 7500)),
    hacker: new Job("Hacker", [
        "&NAME hacked the NSA and stole &AMOUNT",
        "&NAME unrightfully stole &AMOUNT by hacking.",
        "h4ckerm4n &NAME stole &AMOUNT from the government."
    ], 300, 500, 50, new LicenseItem("Hacker Tools", true, 15000))
}