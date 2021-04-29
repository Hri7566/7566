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
    busdriver: new Job("Bus Driver", [
        "&NAME drove the kids to school and made &AMOUNT."
    ], 125, 150, 15, new LicenseItem("Driver's License", true, 750)),
    butcher: new Job("Butcher", [
        "&NAME sliced their meat and made &AMOUNT.",
        "&NAME slaughtered animals and made &AMOUNT.",
        "&NAME cuttin' those cows and makin' &AMOUNT.",
        "&NAME plucked those chickens and made &AMOUNT.",
        "&NAME sliced a pig's head off and made &AMOUNT."
    ], 130, 175, 25, new LicenseItem("Butcher License", true, 1000)),
    lumberjack: new Job("Lumberjack", [
        "&NAME cut down trees and earned &AMOUNT.",
        "&NAME earned &AMOUNT from chopped wood.",
        "&NAME sold firewood for &AMOUNT.",
        "&NAME sold &AMOUNT worth of Christmas trees."
    ], 160, 200, 50, new LicenseItem("Lumberjack License", true, 5000)),
    webdev: new Job("Web Developer", [
        "&NAME made a website and earned &AMOUNT.",
        "&NAME made an Angular app and  earned &AMOUNT."
    ], 200, 275, 100, new LicenseItem("Developer Console", true, 7500)),
    hacker: new Job("Hacker", [
        "&NAME hacked the NSA and stole &AMOUNT",
        "&NAME unrightfully stole &AMOUNT by hacking.",
        "h4ckerm4n &NAME stole &AMOUNT from the government."
    ], 300, 500, 200, new LicenseItem("Hacker Tools", true, 15000)),
    security: new Job("Security Guard", [
        "&NAME tackled enemies and made &AMOUNT.",
        "&NAME watched the CCTV cameras and made &AMOUNT.",
        "&NAME stood guard and was payed &AMOUNT."
    ], 400, 900, 750, new LicenseItem("Security Badge", true, 25000)),
    police: new Job("Police Officer", [
        "&NAME stopped criminals and made &AMOUNT.",
        "&NAME arrested drug dealers and made &AMOUNT.",
        "&NAME enforced the law and made &AMOUNT."
    ], 500, 1000, 1000, new LicenseItem("Police Badge", true, 50000)),
    pharmacist: new Job("Pharmacist", [
        "&NAME gave out COVID shots and made &AMOUNT.",
        "&NAME sold medication and made &AMOUNT."
    ], 750, 1500, 1250, new LicenseItem("PhD", true, 75000)),
    dentist: new Job("Dentist", [
        "&NAME pulled teeth and made &AMOUNT.",
        "&NAME cleaned teeth and made &AMOUNT."
    ], 1000, 1250, 1250, new LicenseItem("Toothbrush", true, 100000)),
    chemist: new Job("Chemist", [
        "&NAME mixed chemicals and made &AMOUNT."
    ], 1250, 1500, 1250, new LicenseItem("Beaker", true, 110000)),
    biologist: new Job("Biologist", [
        "&NAME studied animals and made &AMOUNT."
    ], 1250, 1500, 1250, new LicenseItem("Terrarium", true, 110000)),
    physicist: new Job("Physicist", [
        "&NAME studied physics and made &AMOUNT."
    ], 1250, 1500, 1250, new LicenseItem("Balance", true, 110000)),
    author: new Job("Author", [
        "&NAME wrote a book and made &AMOUNT."
    ], 1500, 1750, 1500, new LicenseItem("Pen", true, 150000)),
    nuclearengineer: new Job("Nuclear Engineer", [
        "&NAME developed nuclear material and made &AMOUNT."
    ], 1750, 2000, 1750, new LicenseItem("Hard Hat", true, 175000)),
    digitaloverlord: new Job("Digital Overlord", [
        "&NAME created a stone army and made &AMOUNT."
    ], 2000, 2500, 2000, new LicenseItem("Indestructable Material", true, 200000)),
    filmdirector: new Job("Film Director", [
        "&NAME directed a movie and made &AMOUNT.",
        "&NAME directed a film and made &AMOUNT."
    ], 2500, 3000, 3000, new LicenseItem("Film Reel", true, 300000))
}
