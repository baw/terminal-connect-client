var spawn = require("child_process").spawn;
var io = require("socket.io-client");

var socket = io.connect("http://localhost:8000/terminal");
var commandId = null;

module.exports = function (opts) {
    var apiKey = opts.apiKey;
    
    var sendLine = function (line) {
        line = line.toString("utf8");
        socket.emit("terminal-output", line, apiKey, commandId);
    };

    var sendError = function (line) {
        line = line.toString("utf8");
        socket.emit("terminal-error", line, apiKey, commandId);
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
    
    socket.on("commandID", function (id) {
        commandId = id;
    });
    
    socket.on("error", function (error) {
        process.stderr.write(error);
        process.exit();
    });
};