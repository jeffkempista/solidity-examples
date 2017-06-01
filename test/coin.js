const Coin = artifacts.require('Coin.sol')

contract('Coin', function(accounts) {

  let coin
  
  it("should make the creator the minter", () => {
    return Coin.deployed().then((instance) => {
      coin = instance
      return coin.minter.call()
    }).then((minter) => {
      assert.equal(minter.valueOf(), accounts[0])
    })
  })

  it("should allow minter to mint", () => {
    return Coin.deployed().then((instance) => {
      coin = instance
      return coin.mint(accounts[1], 1000, { from: accounts[0] })
    }).then(() => {
      return coin.balances.call(accounts[1])
    }).then((balance) => {
      assert.equal(balance.valueOf(), 1000)
    })
  })

  it("should prevent non-minters from minting", () => {

    let beginingBalance

    return Coin.deployed().then((instance) => { 
      coin = instance
      return coin.balances(accounts[4])
    }).then((balance) => {
      beginingBalance = balance.valueOf()
      return coin.mint(accounts[4], 1000, { from: accounts[4] })
    }).then(() => {
      return coin.balances.call(accounts[4])
    }).then((balance) => {
      assert.equal(balance.valueOf(), beginingBalance)
    })
  })

  it("should send to receiver", (done) => {

    let senderBalance
    let receiverBalance
    
    Coin.deployed().then((instance) => {
      coin = instance
      return coin.mint(accounts[2], 1000, { from: accounts[0] })
    }).then(() => {
      return coin.sendCoin(accounts[3], 900, { from: accounts[2] })
    }).then((result) => {
      let sendEventFound = false
      for (var i = 0; i < result.logs.length; i++) {
        const log = result.logs[0]
        if (log.event == 'Sent') {
          sendEventFound = true
          break
        }
      }
      assert.isTrue(sendEventFound, 'Sent event should be triggered')
      return coin.balances.call(accounts[2])
    }).then((balance) => {
      senderBalance = balance
      return coin.balances.call(accounts[3])
    }).then((balance) => {
      receiverBalance = balance
    }).then(() => {
      assert.equal(senderBalance.valueOf(), 100)
      assert.equal(receiverBalance.valueOf(), 900)
      done()
    })
  })

  it('should not send if sender does not have enough coin', () => {

    let senderBalance

    return Coin.deployed().then((instance) => {
      coin = instance
      return coin.balances.call(accounts[1])
    }).then((balance) => {
      senderBalance = balance.valueOf()
      return coin.sendCoin(senderBalance + 100, accounts[2], { from: accounts[1] })
    }).then(() => {
      return coin.balances.call(accounts[1])
    }).then((balance) => {
      assert.equal(balance.valueOf(), senderBalance)
    })
  })

})
