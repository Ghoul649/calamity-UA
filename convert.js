const fs = require("fs");
const { execSync } = require("child_process");
const from = "src";
const to = "Content\\Localization\\en-US.json";

const files = fs.readdirSync(from).filter(item => item.endsWith('.hjson'));

const translation = {};

function extractKeys(object, ns) {
    const keys = Object.keys(object);
    for(const key of keys) {
        const value = object[key];
        if (typeof value === "string") {
            (translation[ns] ?? (translation[ns] = {}))[key] = value;
        } else if(typeof value === "object") {
            extractKeys(value, `${ns}.${key}`);
        }
    }
}

for(const file of files) {
    const output = execSync(`hjson -json "${from}\\${file}"`, { encoding: "utf8" });
    const ns = file.substring(0, file.lastIndexOf('.'));
    const parsed = JSON.parse(output);
    extractKeys(parsed, ns);
    console.log(`Extracted from "${file}"`);
}

fs.writeFileSync(to, JSON.stringify(translation));
