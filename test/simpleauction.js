const SimpleAuction = artifacts.require('SimpleAuction.sol')

contract('SimpleAuction', (accounts) => {

    let auction

    beforeEach(() => {
        return SimpleAuction.deployed().then((instance) => {
            auction = instance
        })
    })

    it("should have a beneficiary", () => {
        return auction.beneficiary.call()
        .then((beneficiary) => {
            assert.equal(beneficiary, accounts[0], 'Expect a beneficiary')
        })
    })

    it("should have a biddingTime", () => {
        return auction.biddingTime.call()
        .then((time) => {
            const biddingTime = time.toNumber()
            assert.isNotNull(biddingTime, 'Expect a bidding time')
            assert.isTrue(biddingTime > Date.now(), 'Expect a bidding time in the future')
        })
    })

    it("should record the highest bidder and their bid", () => {
        return auction.bid({from: accounts[1], value: 10})
        .then(() => {
            return auction.highestBidder.call()
        }).then((highestBidder) => {
            assert.equal(highestBidder, accounts[1], 'Expect highest bidder to be the second account')
            return auction.highestBid.call()
        }).then((highestBid) => {
            assert.equal(highestBid.toNumber(), 10, 'Expect highest bid to be `10`')
        })
    })

    it("should record a new highest bidder and refund previous highest bid", () => {
        let balanceBeforeWithdraw

        return auction.bid({from: accounts[2], value: web3.toWei(20, 'ether')})
        .then(() => {
            return auction.bid({from: accounts[3], value: web3.toWei(30, 'ether')})
        }).then(() => {
            return auction.highestBidder.call()
        }).then((highestBidder) => {
            assert.equal(highestBidder, accounts[3], 'Expect highest bidder to be the fourth account')
            return auction.highestBid.call()
        }).then((highestBid) => {
            assert.equal(highestBid.toNumber(), web3.toWei(30, 'ether'), 'Expect highest bid to be `30`')
            balanceBeforeWithdraw = web3.eth.getBalance(accounts[2]).toNumber()
            return auction.withdraw({from:accounts[2]})
        }).then(() => {
            const balanceAfterWithdraw = web3.eth.getBalance(accounts[2]).toNumber()
            assert(balanceBeforeWithdraw < balanceAfterWithdraw, 'Expect withdraw to return ether')
        })
    })

})
