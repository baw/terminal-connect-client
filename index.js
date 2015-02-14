var fs = require("fs");

var runCommand = require("./lib/run_command.js");

var apiKeyFileLocation = "~/.tc_apikey";

var opts = require("nomnom").options({ command: {
    position: 0,
    help: "command to run",
    list: false
}, args: {
    position: 1,
    help: "arguments to pass to the command",
    list: true
}, apiKey: {
    abbr: "a",
    help: "apiKey used to access user account (can also be stored in '" + apiKeyFileLocation + "')"
}, verbose: {
    abbr: "v",
    flag: true,
    help: "print output from command to console"
    }
}).parse();

if (opts.apiKey === undefined) {
    try {
        opts.apiKey = fs.readFileSync(apiKeyFileLocation);
    } catch (e) {
        console.error(apiKeyFileLocation +
                      " File not found. Please add it with API key or pass in" +
                      " with -a or --apiKey");
        process.exit(2);
    }
}

runCommand(opts);
