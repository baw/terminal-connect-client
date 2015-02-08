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
}).parse();

var socket = io.connect("http://localhost:8000/terminal");

var sendLine = function (line) {
    socket.emit("terminal-output", line);
};

var command = opts.command;
var commandArgv = opts.args;

var running = spawn(command, commandArgv);

socket.emit("command", command + " " + commandArgv.join(" "));

running.stdout.on("data", function (data) {
    console.log("std data");
    var text = data.toString("utf8");
    
    process.stdout.write(text);
    sendLine(text);
});

running.stderr.on("data", function (data) {
    console.log("error data");
    process.stdout.write(data);
});

running.on("close", function (code) {
    console.log("close");
    console.log("process closed with code: " + code);
    socket.disconnect();
});

running.on("error", function () {
    process.stdout.write("error");
    process.stdout.write([].join.call(arguments, "\n"));
});