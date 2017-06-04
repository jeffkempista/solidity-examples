var Ballot = artifacts.require("./Ballot.sol");

module.exports = (deployer) => {
  deployer.deploy(Ballot)
}
