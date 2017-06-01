const SimpleStorage = artifacts.require('SimpleStorage.sol')

contract('SimpleStorage', (accounts) => {
  
  let storage

  it("should get data", () => {
    return SimpleStorage.deployed().then((instance) => {
      storage = instance
      return storage.get.call()
    }).then((value) => {
      assert.equal(value.valueOf(), 0)
    })
  })

  it("should store data", () => {
    return SimpleStorage.deployed().then((instance) => {
      storage = instance
      return storage.set(5)
    }).then(() => {
      return storage.get.call()
    }).then((value) => {
      assert.equal(value.valueOf(), 5)
    })
  })
  
})