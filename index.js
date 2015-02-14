var runCommand = require("./lib/run_command.js");

var opts = require("nomnom").options({ command: {
    position: 0,
    help: "command to run",
    list: false
}, args: {
    position: 1,
    help: "arguments to pass to the command",
    list: true
} verbose: {
    abbr: "v",
    flag: true,
    help: "print output from command to console"
    }
}).parse();

runCommand(opts);
