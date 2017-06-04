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
            assert.equal(biddingTime, 60, 'Expect a bidding time of `60` seconds')
        })
    })

    it("should record the highest bidder and their bid", () => {
        const bidAmount = web3.toWei(1, 'ether')
        return auction.bid({from: accounts[1], value: bidAmount})
        .then(() => {
            return auction.highestBidder.call()
        }).then((highestBidder) => {
            assert.equal(highestBidder, accounts[1], 'Expect highest bidder to be the second account')
            return auction.highestBid.call()
        }).then((highestBid) => {
            assert.equal(highestBid.toNumber(), bidAmount, 'Expect highest bid to be `1`')
        })
    })

    it("should record a new highest bidder and refund previous highest bid", () => {
        const bidAmount = web3.toWei(2, 'ether')
        let balanceBeforeWithdraw

        return auction.bid({from: accounts[2], value: bidAmount})
        .then(() => {
            return auction.bid({from: accounts[3], value: web3.toWei(3, 'ether')})
        }).then(() => {
            return auction.highestBidder.call()
        }).then((highestBidder) => {
            assert.equal(highestBidder, accounts[3], 'Expect highest bidder to be the fourth account')
            return auction.highestBid.call()
        }).then((highestBid) => {
            assert.equal(highestBid.toNumber(), web3.toWei(3, 'ether'), 'Expect highest bid to be `3`')
            balanceBeforeWithdraw = web3.eth.getBalance(accounts[2]).toNumber()
            return auction.withdraw({from:accounts[2]})
        }).then(() => {
            const balanceAfterWithdraw = web3.eth.getBalance(accounts[2]).toNumber()
            assert(balanceBeforeWithdraw < balanceAfterWithdraw, 'Expect withdraw to return ether')
        })
    })

})
