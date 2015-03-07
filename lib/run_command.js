var io = require("socket.io-client");

var runner = require("./private/runner.js");

var socket = io("https://connect.brianweiser.io/terminal");

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
    
    var write = function (text) {
        if (opts.verbose === true) process.stdout.write(text);
        sendLine(text);
    };

    var writeError = function (text) {
        if (opts.verbose === true) process.stderr.write(text);
        sendError(text);
    };
    
    var command = opts.command;
    var commandArgv = opts.args || [];
    
    socket.on("connect", function () {
        socket.emit("command", command + " " + commandArgv.join(" "), apiKey);
        
        socket.on("commandID", function (id) {
            commandId = id;
            runner({
                write: write,
                writeError: writeError,
                command: command,
                commandArgv: commandArgv
            }, function (err) {
                if (err) throw err;
                
                socket.disconnect();
            });
        });
        
        socket.on("serverError", function (error) {
            process.stderr.write(error);
            socket.disconnect();
            process.exit();
        });
    });
    
    socket.on("disconnect", function () {
        socket.disconnect();
        process.exit();
    });
};
