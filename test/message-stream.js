var MessageStream = artifacts.require("./MessageStream.sol");

contract('MessageStream', function(accounts) {
  context("sendMessage", function() {
    context("creating first message", function() {
      context("with first account", function() {
        it("emit event MessageReceived with body and title", function(done) {
          MessageStream.deployed().then(function(instance) {
            var evt = instance.MessageReceived().watch(function(err, response) {
              assert.equal(response.args.title, "First Message");
              assert.equal(response.args.body, "Body");
              evt.stopWatching();
              done();
            });

            instance.sendMessage("First Message", "Body", {from: accounts[0]});
          });
        });

        it("creates the message with index 0", function() {
          return MessageStream.deployed().then(function(instance) {
            return instance.getMessage.call(0);
          }).then(function(result) {
            assert.equal("First Message", result[0]);
            assert.equal("Body", result[1]);

            return true;
          });
        });

        it("has the numberOfMessages equals to 1", function() {
          return MessageStream.deployed().then(function(instance) {
            return instance.getNumberOfMessages.call()
          }).then(function(result) {
            return assert.equal(result, 1);
          });
        });

        it("is not able to like its own message", function() {
          return MessageStream.deployed().then(function(instance) {
            return instance.likeMessage(0, {from: accounts[0]});
          }).catch(function(result) {
            return true;
          });
        })
      });

      context("creating second message", function() {
        context("with second account", function() {
          it("creates the message with index 1", function() {
            var contract;
            return MessageStream.deployed().then(function(instance) {
              contract = instance;
              return contract.sendMessage("Second Message", "Second Body", {from: accounts[1]});
            }).then(function(sendMessageResult) {
              return contract.getMessage.call(1);
            }).then(function(result) {
              assert.equal("Second Message", result[0]);
              assert.equal("Second Body", result[1]);

              return true;
            });
          });

          it("has the numberOfMessages equals to 2", function() {
            return MessageStream.deployed().then(function(instance) {
              return instance.getNumberOfMessages.call()
            }).then(function(result) {
              return assert.equal(result, 2);
            });
          });

          it("is not able to like its own message", function() {
            return MessageStream.deployed().then(function(instance) {
              return instance.likeMessage(1, {from: accounts[1]});
            }).catch(function(result) {
              return true;
            });
          })

          it("is able to like first message increasing the number of likes by 1", function() {
            var contract;
            return MessageStream.deployed().then(function(instance) {
              contract = instance;
              return contract.likeMessage(0, {from: accounts[1]});
            }).then(function(result) {
              return contract.getMessage.call(0);
            }).then(function(result) {
              assert.equal(1, result[3]);

              return true;
            });
          });
        });
      });
    });
  });
});
