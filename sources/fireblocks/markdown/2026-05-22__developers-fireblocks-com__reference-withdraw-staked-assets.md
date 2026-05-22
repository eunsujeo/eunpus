> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Unstake & Withdraw

# Unstake

[Unstake your position](/reference/unstake) - For Solana and MATIC, you must create and sign an unstake transaction before you can withdraw your funds. For ETH, you can proceed to the next step.

```javascript theme={"system"}
const unstakeRequest = await fireblocks.executeStakingUnstake(
  "SOL", {
		id: positionId,
    txNote: "unstake 100 SOL from vaultId 1, 24 Jan 2024"
});

const position = await fireblocks.getPosition(positionId);

// Retrieve the ongoing txId by finding the only uncompleted transaction
const txId = position.relatedTransactions.find((tx) => !tx.completed)

// .. sign it
```

***

# Withdraw

[Withdraw your staking position](/reference/withdraw) - to retrieve your funds, you must execute a withdrawal. For Solana and MATIC, the process is the same as unstaking. For Ethereum, you execute an API call with no signing needed.

```javascript theme={"system"}
const unstakeRequest = await fireblocks.executeStakingWithdraw(
  "SOL", {
		id: positionId,
		txNote: "withdraw 100 SOL from vaultId 1, 24 Jan 2024"
});

// In Ethereum case you are done here (:

const position = await fireblocks.getPosition(positionId);

// Retrieve the ongoing txId by finding the only uncompleted transaction
const txId = position.relatedTransactions.find((tx) => !tx.completed)

// .. sign it
```
