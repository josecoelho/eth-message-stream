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

})
