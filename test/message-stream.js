var MessageStream = artifacts.require("./MessageStream.sol");

contract('MessageStream', function(accounts) {
  it("sendMessage emit event MessageReceived with body and title", function(done) {
    MessageStream.deployed().then(function(instance) {
      var evt = instance.MessageReceived().watch(function(err, response) {
        assert.equal(response.args.title, "Title");
        assert.equal(response.args.body, "Body");
        evt.stopWatching();
        done();
      })
      instance.sendMessage("Title", "Body");
    });
  });


  it("getLastMessage should return the last message", function() {
    return MessageStream.deployed().then(function(instance) {
      return instance.getLastMessage.call();
    }).then(function(result) {
      console.log(result)
      assert.equal("Title", result[0]);
      assert.equal("Body", result[1]);
    });
  });

  context("getMessage", function() {
    context("with the index of the last inserted messages (0)", function() {
      it("return the message in that index", function() {
        return MessageStream.deployed().then(function(instance) {
          return instance.getMessage.call(0);
        }).then(function(result) {
          assert.equal("Body", result[1]);
          return assert.equal("Title", result[0]);
        });
      });
    });
  });

  context("getNumberOfMessages", function() {
    context("having one message (creted in the previous test)", function() {
      it("returns 1", function() {
        return MessageStream.deployed().then(function(instance) {
          return instance.getNumberOfMessages.call()
        }).then(function(result) {
          return assert.equal(result, 1);
        });
      });
    });
  });
});
