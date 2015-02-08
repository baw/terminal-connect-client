var spawn = require("child_process").spawn;
var io = require("socket.io-client");

var opts = require("nomnom").options({ command: {
    position: 0,
    help: "command to run",
    list: false
}, args: {
    position: 1,
    help: "arguments to pass to the command",
    list: true
}, verbose: {
    abbr: "v",
    flag: true,
    help: "print output from command to console"
    }
}).parse();

var socket = io.connect("http://localhost:8000/terminal");

var sendLine = function (line) {
    line = line.toString("utf8");
    socket.emit("terminal-output", line);
};

var sendError = function (line) {
    line = line.toString("utf8");
    socket.emit("terminal-error", line);
};

var command = opts.command;
var commandArgv = opts.args;

var running = spawn(command, commandArgv);

socket.emit("command", command + " " + commandArgv.join(" "));

var write = function (text) {
    if (opts.verbose === true) process.stdout.write(text);
    sendLine(text);
};

var writeError = function (text) {
    if (opts.verbose === true) process.stderr.write(text);
    sendError(text);
};

running.stdout.on("data", function (data) {
    write(data);
});

running.stderr.on("data", function (data) {
    writeError(data);
});

running.on("close", function (code) {
    write("process closed with code: " + code);
    process.exitCode = code;
    
    socket.disconnect();
});

running.on("error", function () {
    writeError("error");
    writeError([].join.call(arguments, "\n"));
    
    process.exitCode = 1;
});