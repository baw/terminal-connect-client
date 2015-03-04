var io = require("socket.io-client");

var runner = require("./private/runner.js");

var socket = io("http://localhost:8000/terminal");

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
        console.log("connected");
        
        socket.emit("command", command + " " + commandArgv.join(" "), apiKey);
        
        socket.on("commandID", function (id) {
            commandId = id;
            console.log("command id");
            console.log(id);
            
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
        
        socket.on("error", function (error) {
            process.stderr.write(error);
            process.exit();
        });
    });
    
    socket.on("disconnect", function () {
        console.log("disconnected");
        socket.disconnect();
    });
};