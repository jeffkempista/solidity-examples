const Ballot = artifacts.require('Ballot.sol')

contract('Ballot', function(accounts) {

  let ballot

  beforeEach(() => {
    return Ballot.deployed().then((instance) => {
      ballot = instance
    })
  })

  it("should make the creator the chairperson", () => {

    return ballot.chairperson.call()
    .then((chairperson) => {
      assert.equal(chairperson.valueOf(), accounts[0])
    })
  })

  it('should give the chairperson an initial vote weight', () => {
    return ballot.voters.call(accounts[0])
    .then((result) => {
      // weight is the first field in the struct
      assert.equal(result[0], 1)
    })
  })

  it('should set proposals', () => {
    return ballot.setProposals([
      "Meyer", 
      "OBrian"
    ])
    .then(() => {
      return ballot.getProposalsCount.call()
    }).then((count) => {
      assert.equal(count, 2)
    }).then(() => {
      return ballot.proposals.call(0)
    }).then((proposal) => {
      assert.equal(web3.toUtf8(proposal[0]), 'Meyer')
      assert.equal(proposal[1], 0)
    }).then(() => {
      return ballot.proposals.call(1)
    }).then((proposal) => {
      assert.equal(web3.toUtf8(proposal[0]), 'OBrian')
      assert.equal(proposal[1], 0)
    })
  })

})
