var MessageStream = artifacts.require("./MessageStream.sol");

module.exports = function(deployer) {
  deployer.deploy(MessageStream);
};
