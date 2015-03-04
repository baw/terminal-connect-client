var spawn = require("child_process").spawn;

module.exports = function (opts, callback) {
    var running = spawn(opts.command, opts.commandArgv);
    
    running.stdout.on("data", function (data) {
        opts.write(data);
    });

    running.stderr.on("data", function (data) {
        opts.writeError(data);
    });

    running.on("close", function (code) {
        opts.write("process closed with code: " + code);
        process.exitCode = code;
        
        callback(null);
    });

    running.on("error", function () {
        opts.writeError("error");
        opts.writeError([].join.call(arguments, "\n"));
        
        process.exitCode = 1;
    });
};