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
      assert.equal(chairperson.valueOf(), accounts[0], "Expect chairperson to be the contract creater")
    })
  })

  it('should give the chairperson an initial vote weight', () => {
    return ballot.voters.call(accounts[0])
    .then((result) => {
      // weight is the first field in the struct
      assert.equal(result[0].toNumber(), 1, "Expect weight to be `1`")
    })
  })

  it('should set proposals', () => {
    return ballot.setProposals(["Meyer", "O'Brian"])
    .then(() => {
      return ballot.getProposalsCount.call()
    }).then((count) => {
      assert.equal(count, 2, "Expect 2 proposals to exist")
    }).then(() => {
      return ballot.proposals.call(0)
    }).then((proposal) => {
      assert.equal(web3.toUtf8(proposal[0]), 'Meyer', "Expect name to be `Meyer`")
      assert.equal(proposal[1].toNumber(), 0, "Expect initial vote count to be `0`")
    }).then(() => {
      return ballot.proposals.call(1)
    }).then((proposal) => {
      assert.equal(web3.toUtf8(proposal[0]), "O'Brian", "Expect name to be `O'Brian`")
      assert.equal(proposal[1].toNumber(), 0, "Expect initial vote count to be `0`")
    })
  })

  it('should allow chairperson to give right to voter', () => {
    return ballot.giveRightToVote(accounts[1])
    .then(() => {
      return ballot.voters.call(accounts[1])
    }).then((voter) => {
      assert.equal(voter[0].toNumber(), 1, 'Expect weight of `1`')
      assert.equal(voter[1], false, 'Expect voted to be `false`')
    })
  })

  it('should count votes for proposals', () => {
    return ballot.vote(0, {from: accounts[0]})
    .then(() => {
      return ballot.voters.call(accounts[0])
    }).then((voter) => {
      assert.equal(voter[1], true, 'Expect voted to be `true`')
      return ballot.proposals.call(0)
    }).then((proposal) => {
      assert.equal(proposal[1].toNumber(), 1, 'Expect proposal to have `1` vote')
      return ballot.giveRightToVote(accounts[2])
    }).then(() => {
      return ballot.vote(0, {from: accounts[2]})
    }).then(() => {
      return ballot.proposals.call(0)
    }).then((proposal) => {
      assert.equal(proposal[1].toNumber(), 2, 'Expect proposal to have `2` votes')
      return ballot.giveRightToVote(accounts[3])
    }).then(() => {
      return ballot.vote(1, {from: accounts[3]})
    }).then(() => {
      return ballot.proposals.call(1)
    }).then((proposal) => {
      assert.equal(proposal[1].toNumber(), 1, 'Expect proposal to have `1` votes')
      return ballot.winnerName()
    }).then((winnerName) => {
      assert.equal(web3.toUtf8(winnerName), 'Meyer', "Expect `Meyer` to win")
    })
  })

  it('should allow voters to delegate votes', () => {

    let proposalVotes

    return ballot.giveRightToVote(accounts[4])
    .then(() => {
      return ballot.giveRightToVote(accounts[5])
    }).then(() => {
      return ballot.delegate(accounts[4], {from: accounts[5]})
    }).then(() => {
      return ballot.voters(accounts[4])
    }).then((delegate) => {
      assert.equal(delegate[0].toNumber(), 2, 'Expected voter weight of delegate to be `2`')
      return ballot.proposals.call(1)
    }).then((proposal) => {
      proposalVotes = proposal[1].toNumber()
      return ballot.vote(1, {from: accounts[4]})
    }).then(() => {
      return ballot.proposals.call(1)
    }).then((proposal) => {
      assert.equal(proposal[1].toNumber(), proposalVotes + 2, 'Expected proposal to get 2 votes from delegate')
    })
  })

})
