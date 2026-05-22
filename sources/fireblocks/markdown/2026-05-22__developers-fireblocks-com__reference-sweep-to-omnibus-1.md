> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Sweep to Omnibus

# Overview

For customers covering different market segments, the Fireblocks platform can support several different use cases by offering two options for your main vault structure: **Segregated** **account** vault structure and omnibus account vault structure.

> **Important:**
>
> Detailed information about each of these vault structures and how each can be implemented per use case. It's important to understand the differences.
>
> * **Intermediate vault accounts**: This is the vault account assigned to an end client. Because you could have numerous end clients, you can use the Fireblocks API to automatically generate as many intermediate vault accounts as needed.
> * **Omnibus deposits**: This is the central vault omnibus account where end-client funds are swept and stored.
> * **Withdrawal pool**: This is the vault account containing funds allocated for end-client withdrawal requests. More than one withdrawal pool vault account is required due to blockchain limitations.
>
> [Learn more about best practices for structuring your Fireblocks Vault.](https://support.fireblocks.io/hc/en-us/articles/5253421857564)

## Sweeping

The sweeping operation moves the funds from the intermediate vault accounts, assigned to your end-users for their deposits, into your omnibus account.

As an on-chain transfer of funds, sweeping requires you to pay fees from a source vault account. Set the triggering factor for when sweeping logic is applied based on business needs.

For example, this can be:

* Based on the capacity of the funds accumulated inside the Intermediate vault account
* Periodically based on a set time frame (daily, weekly)
* Based on the network fees - These fluctuate during different times of the day.

> **Reconciliation, crediting, and confirmation control**
>
> To learn more about additional parameters that affect sweeping, see below.
>
> * [Reconciliation & crediting](https://support.fireblocks.io/hc/en-us/articles/5431957627548-Best-practices-for-transaction-reconciliation-and-crediting) - You can create an automated mechanism that notifies your organization or clients about incoming transactions via webhook notifications or by using the Fireblocks API.
> * [Deposit control & Control policy](https://support.fireblocks.io/hc/en-us/articles/360013034359-Deposit-Control-Confirmation-Policy) - The Deposit Control & Confirmation Policy lets you specify how many network confirmations are required for an incoming transaction to clear so its funds can be credited to a wallet.

## Fueling

Sweeping will move the funds into your omnibus account from vault accounts existing on intermediate vault accounts that are assigned to your end-users for their deposits.

When sweeping non-base assets from intermediate vault accounts, such as ERC-20 tokens, the transaction fee should be paid in the base asset.

> **Example**
>
> USDC transfer fees on Ethereum are paid in ETH. Therefore, these accounts must be fueled with ETH (or "gas") to fund the transaction fees that are required for sweeping.

Fireblocks provides an automated fueling service known as the Gas Station to save you the trouble of managing this manually. You can learn more about it in the [Gas station setup and usage](doc:gas-station-setup) guide.

## Example

### Step 1: Create the vault accounts in batch

This guide assumes you use a backend “internal ledger” system that will correlate the internal customer ref ID with your new Fireblocks vault account ID.

[See a basic example of an internal ledger mechanism description.](doc:sweep-to-omnibus#internal-ledger-for-tracking-the-balance-of-end-users)

Using the following code example:

1. Create the vault accounts for your end-users using your chosen naming convention to identify the vault accounts for your user deposits.
2. Create your ETH deposit address under the vault accounts.
3. Create your omnibus vault account used as the treasury account.

The example demonstrates calling either the `createVaultAccounts`or`create_vault_accounts` function that is passed with the `amount` parameter value as the number of vault accounts you wish to create for your sweeping batch, the underlying vault accounts, the name used to describe the batch, and the treasury omnibus account that will be used for the sweeping process.

In the example below, 3 vault accounts are created

```javascript theme={"system"}
const createVaultAccounts = async (
  amountOfVaultAccounts: number,
  assetId: string,
  vaultAccountNamePrefix: string
): Promise<Array<{}> | undefined> => {
  const result: Array<{}> = [];
  try {
    for (let i = 1; i <= amountOfVaultAccounts; i++) {
      const vaultAccountResponse = await fireblocks.vaults.createVaultAccount(
        {
          createVaultAccountRequest:
          {
            name: vaultAccountNamePrefix.toString() + i.toString()
          }
        }
      );
      let vaultWalletAddress = await fireblocks.vaults.createVaultAccountAsset(
        {
          vaultAccountId: vaultAccountResponse.data.id as string,
          assetId
        }
      );
      result.push({
        "Vault Account Name": vaultAccountResponse.data.name,
        "Vault Account ID": vaultAccountResponse.data.id,
        "Asset ID": assetId,
        "Address": vaultWalletAddress.data.address
      })
      console.log("Vault Account Details: ", result);
    }

    return result;
  }
  catch (error) {
    console.error(error);
  }
}

createVaultAccounts(2, "ETH_TEST6", "END-USER#22223");
```

```javascript theme={"system"}
async function createVaultAccounts(amountOfVaultAccounts, assetId, vaultAccountNamePrefix){
    let vaultRes;
    let vault;
    let vaultWallet;

    for (let i = 1; i <= amountOfVaultAccounts; i++){
            vaultRes = await fireblocks.createVaultAccount(vaultAccountNamePrefix.toString()+i.toString());
            vault = {
                vaultName: vaultRes.name,
                vaultID: vaultRes.id
            }
            vaultWallet = await fireblocks.createVaultAsset(Number(vault.vaultID), assetId);
            console.log("Created vault account", vault.vaultName,":", "with wallet address:", vaultWallet.address);
    };
 }
 createVaultAccounts(2, "ETH","END-USER-#","treasuryVaultName");
```

```python theme={"system"}
ASSET = "ETH_TEST"
def create_vault_accounts(amount: int) -> dict:
   """
   :param amount: Amount of vault accounts to create (one, per end user).
   :return: A dictionary where keys are the vault names and IDs are the co-responding values.
   """
   vault_dict = {}
   counter = 1

   while counter <= amount:
       vault_name = f"End-User {counter} Vault"
       vault_id = fireblocks.create_vault_account(name=vault_name, hiddenOnUI=True)['id']
       fireblocks.create_vault_asset(vault_id, ASSET)
       vault_dict[vault_name] = vault_id
       counter += 1
   else:
       vault_name = "Treasury"
       vault_id = SDK.create_vault_account(name=vault_name)['id']
       fireblocks.create_vault_asset(vault_id, ASSET)
       vault_dict[vault_name] = vault_id

   return vault_dict
```

### Step 2: Create the sweeping logic

This guide assumes that your "internal ledger" can produce a list of vault accounts that are relevant for treasury sweeping. For a basic "internal ledger" mechanism description, review the section at the bottom of this article.

You will define which vault accounts will be swept to your omnibus account. The next example shows the sweeping of any account that has at least 1 ETH to the relevant treasury account.

* Define the intermediate vault accounts that you wish to sweep their funds from.
* Initiate the Create Transaction loop.

### Testing

Add this code block to the code you built using any of the language-specific guides under the **Developing with Fireblocks** section.

```javascript theme={"system"}
const createTagWithdrawalVaultAccounts = async (
  assetId: string,
  name: string,
): Promise<Array<{}> | undefined> => {
  const result: Array<{}> = [];

  try {
    const vaultAccount = await fireblocks.vaults.createVaultAccount({
      createVaultAccountRequest: {
        name,
      },
    });

    if (vaultAccount.data) {
      const vaultWallet = await fireblocks.vaults.createVaultAccountAsset({
        vaultAccountId: vaultAccount.data.id as string,
        assetId,
      });

      result.push({
        "Vault Account Name": vaultAccount.data.name,
        "Vault Account ID": vaultAccount.data.id,
        "Asset ID": assetId,
        Address: vaultWallet.data.address,
      });

      console.log(JSON.stringify(result, null, 2));
    }

    return result;
  } catch (error) {
    console.error(error);
  }
};

const sweepToOmnibus = async (
  vaNamePrefix: string,
  minAmount: number,
  assetId: string,
  omnibusVaId: string,
): Promise<
  Array<{
    fromVaName: string;
    fromVaId: string;
    txId: string;
    grossAmount: string;
  }>
> => {
  let sweepingInfo: any[] = [];

  const vaultsToSweepFrom = await fireblocks.vaults.getPagedVaultAccounts({
    namePrefix: vaNamePrefix,
    assetId,
    minAmountThreshold: minAmount,
  });

  if (vaultsToSweepFrom.data.accounts) {
    await Promise.all(
      vaultsToSweepFrom.data.accounts.map(
        async (vaultAccount: VaultAccount) => {
          if (vaultAccount.assets && vaultAccount.assets.length > 0) {
            const createTxResponse =
              await fireblocks.transactions.createTransaction({
                transactionRequest: {
                  assetId,
                  source: {
                    type: TransferPeerPathType.VaultAccount,
                    id: vaultAccount.id,
                  },
                  destination: {
                    type: TransferPeerPathType.VaultAccount,
                    id: omnibusVaId,
                  },
                  amount: vaultAccount.assets[0].available,
                },
              });

            sweepingInfo.push({
              fromVaName: vaultAccount.name,
              fromVaId: vaultAccount.id,
              txId: createTxResponse.data.id,
              grossAmount: vaultAccount.assets[0].available,
            });
          }
        },
      ),
    );
  }

  console.log(
    "Initiated sweeping transactions:\n" +
      JSON.stringify(sweepingInfo, null, 2),
  );
  return sweepingInfo;
};

sweepToOmnibus("END-USER-#", 0.1, "ETH_TEST5", "0");
```

```javascript theme={"system"}
async function sweep(vaultAccountNamePrefixtoSweep, sweepAmount, assetId, treasuryVaultAccountId){
    vaultListToSweep = await fireblocks.getVaultAccountsWithPageInfo({namePrefix: vaultAccountNamePrefixtoSweep, assetId: assetId, minAmountThreshold:sweepAmount});
    for (let i = 0; i < Object.keys(vaultListToSweep.accounts).length; i++) {
        await fireblocks.createTransaction({
            "assetId" : assetId,
            "source" : {
                "type" : PeerType.VAULT_ACCOUNT,
                "id" : vaultListToSweep.accounts[i].id
            },
            "destination" : {
                "type" : PeerType.VAULT_ACCOUNT,
                "id" : String(treasuryVaultAccountId)
            },
            "amount" : vaultListToSweep.accounts[i].assets[0].total,
        })
    };
    vaultListToSweep.accounts.forEach(element => {
        console.log("Swept", "Vault id:", element.id,", Vault name:", element.name);
    })
 }
sweep("END-USER-#",1,"ETH","0");
```

```python theme={"system"}
ASSET = "ETH_TEST"
def sweep_accounts(treasury_vault_id: str) -> dict:
   """
   :param treasury_vault_id: The vault that will receive all the funds.
   :return: A dictionary of accounts swept with the values being the amount transferred.
   """
   vault_dict = {}
   vault_accounts = fireblocks.get_vault_accounts(name_prefix="End-User")
   for vault in vault_accounts['accounts']:
       for asset in vault['assets']:
           if asset['id'] == ASSET and int(asset['amount']) >= 1:
               fireblocks.create_transaction(
                   asset_id=ASSET,
                   amount=asset['amount'],
                   source=TransferPeerPath(
                       peer_type=VAULT_ACCOUNT,
                       peer_id=vault['id']
                   ),
                   destination=DestinationTransferPeerPath(
                       peer_type=VAULT_ACCOUNT,
                       peer_id=treasury_vault_id
                   )
               )
               vault_dict[vault['name']] = asset['amount']

   return vault_accounts
```
