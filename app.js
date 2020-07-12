var Jimp;
var seedrandom;
try {
    Jimp = require('jimp');
    seedrandom = require('seedrandom');
} catch(e) {
    console.log("You do not have the required modules to run this program! Please run \"npm install\" before running this again.")
    process.exit(0);
}
const fs = require("fs");
const path = require("path");
const types = ["png", "jpg", "jpeg"];
const Config = require("./config");
const { intensity } = require('./config');

const Path = Config.readPath;
const ExportPath = Config.writePath;

if (Config.randomSeed == true) Config.seed = getRandomInt(128, 1073741824);
const seed = seedrandom(Config.seed);

function getRandom(num) {
    return Math.round((Math.abs(seed.int32()) / 100000000) * (num / 0.2)) / 10;
}

// nwn
(function run() {
    if (!fs.existsSync(Path)) return console.log("Could not read from directory. Ending program!");
    if (!fs.existsSync(ExportPath)) {
        console.log("Could not write to save directory. I'll make it, then!");
        fs.mkdirSync(ExportPath);
    }

    let files = fs.readdirSync(Path);
    let images = files.filter(i => types.includes(i.split(".")[1]));
    let nonimages = files.filter(i => !types.includes(i.split(".")[1]));
    let all = images;
    let i = 0;
    let j = 0;

    console.log("Copying non-images to the folder...");
    (function copyNonimages(non) {
        j++
        if (j == (nonimages.length + j)) {
            console.log("")
            console.log("Copied all Non-Images, starting on deepfrying images!")
            console.log("-----------------------------------------------------");
            console.log("")
            return ruinImage(images.shift());
        } else {
            fs.copyFileSync(path.join(Path, non), path.join(ExportPath, non))
            copyNonimages(nonimages.shift());
        }

        function ruinImage(image) {
            i++;
            console.log("Ruining Image " + i + " of " + (all.length + i) + ": " + image)
            Jimp.read(path.join(Path, image)).then((edit) => {
                edit
                    .pixelate(getRandom(getRandom(0.2)) * intensity)
                    .contrast(seed.double())
                    .posterize(getRandom(getRandom(0.1)) * intensity)
                    .brightness(seed())
                    .write(path.join(ExportPath, image));

                console.log("Successfully ruined image!");
                console.log("");

                if (i == (all.length + i)) {
                    console.log("-----------------------------------------------------");
                    console.log("Finished!~")
                    console.log("Enjoy your deep fried images!");
                    console.log(`Seed: ${Config.seed}`);
                    return;
                }

                return ruinImage(images.shift())
            })
        }
    })(nonimages.shift())

})();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}