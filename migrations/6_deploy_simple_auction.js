var Auction = artifacts.require("./SimpleAuction.sol")

module.exports = (deployer, network, accounts) => {
  if (network == 'development') {
    const biddingTime = 60
    const beneficiary = accounts[0]
    deployer.deploy(Auction, biddingTime, beneficiary)
  }
  
}
