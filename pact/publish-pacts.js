const pact = require("@pact-foundation/pact-node")
const path = require("path")
const branchName = require('current-git-branch');

const currentBranchName = branchName();

if (!currentBranchName) {
  console.log('Error: invalid branch name');
  return;
}

const opts = {
  pactFilesOrDirs: [
    path.resolve(
      __dirname,
      "./output/ui-api.json"
    ),
  ],
  pactBroker: 'https://advance-hes.comland.si:9443/', // set pact broker !!!
  pactBrokerUsername: "pactahes",
  pactBrokerPassword: "ahesJw0NE#9ihby2#",
  consumerVersion: '1'
}

pact
  .publishPacts(opts)
  .then(() => {
    console.log("Pact contract publishing complete!");
  })
  .catch(e => {
    console.log("Pact contract publishing failed: ", e)
  })