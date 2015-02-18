require("./mock_server.js");
require("./mock_child_process.js");

describe("events", function () {
    describe("socket", function () {
        describe("emits command", function () {
            it("sends command event to server", function () {
                
            });
            
            it("sends given command with args to server", function () {
                
            });
        });
        
        describe("on commandID", function () {
            it("responds to 'commandID' event from server", function () {
                
            });
            
            it("saves 'commandID' given by server", function () {
                
            });
        });
        
        describe("on error", function () {
            it("responds to 'error' event from server", function () {
                
            });
            
            it("logs error to console", function () {
                
            });
            
            it("exits the process", function () {
                
            });
        });
    });
    
    describe("child process", function () {
        describe("on close", function () {
            it("emits 'terminal-output' event to server", function () {
                
            });
            
            it("sends exit code to server", function () {
                
            });
        });
        
        describe("on error", function () {
            it("emits 'terminal-error' event to server", function () {
                
            });
            
            it("sends error text to server", function () {
                
            });
        });
        
        describe("on stdout data", function () {
            it("emits 'terminal-output' event to server", function () {
                
            });
            
            it("sends output text to server", function () {
                
            });
        });
        
        describe("on stderr data", function () {
            it("emits 'terminal-error' event to server", function () {
                
            });
            
            it("sends error text to server", function () {
                
            });
        });
    });    
});