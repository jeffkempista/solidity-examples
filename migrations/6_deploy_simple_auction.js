var Auction = artifacts.require("./SimpleAuction.sol")

module.exports = (deployer, network, accounts) => {
  if (network == 'development') {
    const biddingTime = Date.now() + (5 * 60 * 1000)
    const beneficiary = accounts[0]
    deployer.deploy(Auction, biddingTime, beneficiary)
  }
  
}
