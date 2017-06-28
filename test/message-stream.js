var MessageStream = artifacts.require("./MessageStream.sol");

contract('MessageStream', function(accounts) {

  it("getMessage should return the title", function() {
    var title;

    return MessageStream.deployed().then(function(instance) {
      return instance.getMessage.call();
    }).then(function(title) {
      assert.equal("Test", title, "The title is the returned one");
    });


  })

  it("sendMessage emit event MessageReceived with body and title", function(done) {


    MessageStream.deployed().then(function(instance) {
      var evt = instance.MessageReceived().watch(function(err, response) {
        assert.equal(response.args._title, "Title");
        assert.equal(response.args._body, "Body");
        evt.stopWatching();
        done();
      })
      instance.sendMessage("Title", "Body");
    });

  })

})
