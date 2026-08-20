> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Create Omnibus Structure

# Overview

For customers who have taken the omnibus account structure, it is important to make sure the vaults are structured accordingly, and there is no bottleneck of transactions within the withdrawal mechanism, for example.

> **Important:**
>
> * **Intermediate vault accounts**: This is the vault account assigned to an end client. Because you could have numerous end clients, you can use the Fireblocks API to automatically generate as many intermediate vault accounts as needed.
> * **Omnibus deposits**: This is the central vault omnibus account where end-client funds are swept and stored.
> * **Withdrawal pool**: These are the vault accounts containing funds allocated for end-client withdrawal requests. More than one withdrawal pool vault account is required due to blockchain limitations.
>
> Make sure you are following the right structure for you by reading the [Create Direct Custody Wallets](/docs/create-direct-custody-wallets) article.

# Understanding Asset Types

Handling your omnibus account correctly requires a clear understanding of the differences between different asset types - UTXO vs Account Based.

Due to the nature of UTXO-based blockchains, the transaction includes the source address for each end client, unlike account-based transactions which require an intermediary vault account.

We will explain the two methodologies separately in this article.

## UTXO Based

### Structure

* In the Omnibus Deposits vault account, you can assign each end client a deposit address (which is derived from the permanent wallet address of the UTXO asset).
* When adding an address for an end client in the Omnibus Deposits vault account, use the [Create a New Deposit Address of an Asset in a Vault Account API call](/reference/createvaultaccountassetaddress)

  and use the `name` parameter to associate the end client's ID, as a prefix or suffix for the name of the vault account.
  The `customerRefId` parameter is the ID for AML providers to associate the owner of funds with transactions and should now be used for other purposes. Both the name of the vault account and the AML customerRefID fields are propagated to every transaction to the end client in your system.

### Deposit

Funds are deposited using the following process:

* The retail platform shares the deposit address with the end client.
* The end client makes a deposit.
* The incoming deposit triggers a webhook notification.
* Your client-facing software automatically notifies the end client that the deposit was successfully received.
* The deposit appears on the Transaction History page.

### Example

```javascript theme={"system"}
const createUTXOWithdrawalVaultAccounts = async (
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

// Create an omnibus vault account for UTXO based assets
const createOmnibusUTXOAccount = async (
  numOfAddresses: number,
  assetId: string,
): Promise<{} | undefined> => {
  try {
    const myOmnibusVault = await fireblocks.vaults.createVaultAccount({
      createVaultAccountRequest: {
        name: "My Omnibus Vault",
      },
    });

    if (myOmnibusVault.data) {
      const vaultAccountId = myOmnibusVault.data.id as string;

      let result = {};

      await fireblocks.vaults.createVaultAccountAsset({
        vaultAccountId,
        assetId,
      });

      for (let i = 0; i < numOfAddresses; i++) {
        // Generating additional addresses is possible for UTXO based assets only
        await fireblocks.vaults.createVaultAccountAssetAddress({
          assetId,
          vaultAccountId,
          createAddressRequest: {
            description: `UserAddress${i + 1}`,
          },
        });
      }

      const addresses =
        await fireblocks.vaults.getVaultAccountAssetAddressesPaginated({
          vaultAccountId,
          assetId,
        });

      result = {
        "Vault Account Name": myOmnibusVault.data.name,
        "VaultAccount ID": myOmnibusVault.data.id,
        "Asset ID": assetId,
        Addresses: addresses?.data.addresses,
      };

      console.log(JSON.stringify(result, null, 2));

      return result;
    }
  } catch (error) {
    console.error(error);
  }
};
createUTXOWithdrawalVaultAccounts("BTC_TEST", "MyWithdrawalVault");
createOmnibusUTXOAccount(3, "BTC_TEST");
```

```javascript theme={"system"}
// Obtain a list of user identifiers associated with the vault accounts and pass them as a strings inside internalCustRefIds
// each of the internalCustRefIds is concatenated to the vault's name

const internalCustRefIds = ["a","b","c"];
const assetId = "BTC_TEST";

async function createUTXOWithdrawalVaultAccounts(assetId, name){
    vault = await fireblocks.createVaultAccount(name);
    vaultWallet = await fireblocks.createVaultAsset(Number(vault.id), assetId);
    const result = [{"Vault Name": vault.name, "Vault ID": vault.id, "Asset ID": assetId, "Wallet Address": vaultWallet.address}];
    console.log(JSON.stringify(result, null, 2));
    return(result);
}

async function createUTXOOmnibusAccount(amountOfVaultAccounts, assetId, internalCustRefIds){
    let vault;
    let vaultWallet;
    let address = [];

    vault = await fireblocks.createVaultAccount("Omnibus");
    vaultWallet = await fireblocks.createVaultAsset(Number(vault.id), assetId);
    for (let i = 0; i < amountOfVaultAccounts; i++){
        address[i] = await fireblocks.generateNewAddress(Number(vault.id), assetId, "CustomerID_"+internalCustRefIds[i]+"_vault");
    }
    console.log("Created vault account:"+JSON.stringify(vault, null, 2)+" with wallet addresses:"+JSON.stringify(address, null, 2));
    return("Omnibus:", vault, "Addresses:", address);
 }

createUTXOWithdrawalVaultAccounts(assetId, "Withdrawal");
createUTXOOmnibusAccount(2, assetId, internalCustRefIds);
```

```python theme={"system"}
# Obtain a list of user identifiers associated with the vault accounts and pass them as a strings inside internalCustRefIds
# each of the internalCustRefIds is concatenated to the vault's name

ASSET = "BTC_TEST"
CUSTOMER_IDS = ["a", "b", "c"]

def create_utxo_withdrawal_vault(asset: str, name: str):
    vault_id = fireblocks.create_vault_account(name=name)["id"]
    address = fireblocks.create_vault_asset(vault_account_id=vault_id, asset_id=asset)["address"]

    return {name: vault_id}, address

def create_utxo_omnibus_vault(amount: int, asset: str, customer_ids: list, hidden_on_ui: bool = True):
    deposit_address = {}

    vault_id = fireblocks.create_vault_account(name="Omnibus")["id"]
    fireblocks.create_vault_asset(vault_account_id=vault_id, asset_id=asset)
    for i in range(amount):
        address = fireblocks.generate_new_address(vault_account_id=vault_id, asset_id=asset, description=customer_ids[i], hidden_on_ui=hidden_on_ui)["address"]
        deposit_address[customer_ids[i]] = address

    return {"Omnibus": vault_id, "Addresses": deposit_address}

print(create_utxo_withdrawal_vault(ASSET, "Withdrawal"))
print(create_utxo_omnibus_vault(3, ASSET, CUSTOMER_IDS))
```

The above code creates the Omnibus vault and a withdrawal vault, from which we can later on move funds back to end users who would like to settle.

Afterwards, we create a deposit address per end user, while using an available, unique customer ID. The function then returns a dictionary of the newly created vaults and generated deposit addresses.

## Account Based

> **Note**
>
> Do note this section refers to account based assets without a tag / memo capability. You can refer to tag / memo based assets in the next section.

### Structure

* The workspace should contain one or more intermediate vault accounts per end client in addition to a single Omnibus Deposits vault account.

* When adding a vault account, we recommend using the [Create a New Vault Account API call](/reference/createvaultaccount) and use the `name` parameter to associate the end client's ID, as a prefix or suffix for the name of the vault account.

  The `customerRefId` parameter is the ID for AML providers to associate the owner of funds with transactions and should now be used for other purposes. Both the name of the vault account and the AML customerRefID fields are propagated to every transaction to the end client in your system.

* Due to the nature of account-based blockchains, transactions with account-based assets can only be transferred from one account-based address to another account-based address (unlike UTXO, where multiple addresses are included in a single transaction).

### Deposit

Funds are deposited using the following process:

* The end client receives a deposit address.
* The end client makes a deposit.
* The incoming deposit triggers a webhook notification.
* Your client-facing software automatically notifies the end client that the deposit was successfully received.
* The deposit is swept to the Omnibus Deposits vault account. You can see further on the sweeping logic in the [Sweeping within an Omnibus Vault structure](/docs/sweep-funds) article.

### Example

> **Recommended: Set "Hidden Vaults" on**
>
> For the creation of end user vaults, we will usually choose to set **hiddenOnUi** as true, as part of the **createVaultAccount** endpoint.
>
> By default, it is set to false, hence all of the vaults created in this article will be visible in the UI which is not recommended for a very large amount of vaults.
>
> This also means transfers to these vaults won't be visible in the UI, but only programatically.

As the name suggests, the end-user vaults will be serving your end users. If you have followed the structure section, you might have noticed that account based assets require a one-to-one vault per end user.
The treasury vault is a single account where all of the swept assets will move to. You can see more in regarding to sweeping in the following [sweeping article](/docs/sweep-funds).
Lastly, we will also create a few withdrawal vaults in order to distribute our load in regards to settlements, making sure we don't have a bottleneck at the withdrawal part.

We will use the below code in order to perform the following:

1. Create 5 vaults for 5 end users.
2. Create 1 treasury vault.
3. Create 3 withdrawal vaults.

```javascript theme={"system"}
const createAccountBasedVaultAccounts = async (
  vaultAccountNamePrefix: string,
  numOfVaultAccounts: number,
  assetId: string,
  hiddenOnUI: boolean,
  endUserReferences?: string[],
): Promise<Array<{}> | undefined> => {
  try {
    let vaultAccount: FireblocksResponse<VaultAccount>;
    let results: Array<{}> = [];

    for (let i = 0; i < numOfVaultAccounts; i++) {
      if (
        endUserReferences &&
        endUserReferences.length !== numOfVaultAccounts
      ) {
        throw new Error(
          "Number of Vault Accounts does not equal to the number of end user references",
        );
      }

      vaultAccount = await fireblocks.vaults.createVaultAccount({
        createVaultAccountRequest: {
          name: endUserReferences
            ? vaultAccountNamePrefix + "_" + endUserReferences[i]
            : vaultAccountNamePrefix + "_Vault" + String(i + 1),
          hiddenOnUI,
        },
      });

      const vaultAccountId = vaultAccount.data?.id as string;

      const vaultWallet = await fireblocks.vaults.createVaultAccountAsset({
        assetId,
        vaultAccountId,
      });

      const singleVaultResult = {
        "Vault Account": vaultAccount.data?.name,
        "Vault Account ID": vaultAccountId,
        "Asset ID": assetId,
        Address: vaultWallet.data?.address,
      };

      results.push(singleVaultResult);
      console.log(
        `Created Vault Account:\n ${JSON.stringify(singleVaultResult, null, 2)}`,
      );
    }

    return results;
  } catch (error) {
    console.error(error);
  }
};

createAccountBasedVaultAccounts("Deposits", 5, "ETH_TEST5", true, [
  "UserA",
  "UserB",
  "UserC",
  "UserD",
  "UserE",
]);
createAccountBasedVaultAccounts("Treasury", 1, "ETH_TEST5", false);
createAccountBasedVaultAccounts("Withdrawal_Pool", 3, "ETH_TEST5", false);
```

```javascript theme={"system"}
// Obtain a list of user identifiers associated with the vault accounts and pass them as a strings inside internalCustRefIds
// each of the internalCustRefIds is concatenated to the vault's name

const internalCustRefIds = ["a","b","c","d","e"];
const assetId = "ETH_TEST3";

async function createAccountBasedVaultAccounts(vaultAccountNamePrefix, amountOfVaultAccounts, assetId, hiddenOnUI, internalCustRefIds){
    let createVaultRes;
    let vault;
    let vaultWallet;

    for (let i = 0; i < amountOfVaultAccounts; i++){
        if (internalCustRefIds){
            createVaultRes = await fireblocks.createVaultAccount(vaultAccountNamePrefix.toString()+"_"+internalCustRefIds[i]+"_vault", hiddenOnUI);
        }
        else {
            createVaultRes = await fireblocks.createVaultAccount(vaultAccountNamePrefix.toString()+"_"+i.toString()+"_vault", hiddenOnUI);
        }
        vault = {
            vaultName: createVaultRes.name,
            vaultID: createVaultRes.id
        }
        vaultWallet = await fireblocks.createVaultAsset(Number(vault.vaultID), assetId);
        console.log("Created vault account", vault.vaultName,":", "with wallet address:", vaultWallet.address);
    }
 }

createAccountBasedVaultAccounts("Deposits_End_User", 5, assetId, false, internalCustRefIds);
createAccountBasedVaultAccounts("Treasury", 1, assetId, false, undefined);
createAccountBasedVaultAccounts("Withdrawal_pool", 3, assetId, false, undefined);
```

```python theme={"system"}
# Obtain a list of user identifiers associated with the vault accounts and pass them as a strings inside internalCustRefIds
# each of the internalCustRefIds is concatenated to the vault's name

CUSTOMER_IDS = ["a", "b", "c", "d", "e"]
ASSET = "ETH_TEST3"

def create_account_vault_accounts(prefix: str, amount: int, asset_id: str, customer_ids: list, is_hidden: bool = False) -> dict:
  vault_dict = {}

  for index in range(amount):
    if customer_ids:
	    vault_name = f"{prefix}_{customer_ids[index]}_vault"
    else:
      vault_name = f"{prefix}_vault"
    vault_id = fireblocks.create_vault_account(name=vault_name, hidden_on_ui=is_hidden)["id"]
    fireblocks.create_vault_asset(vault_id, )
    vault_dict[vault_name] = vault_id

  return vault_dict

print(create_account_vault_accounts("End-User", 5, ASSET, CUSTOMER_IDS, True))
print(create_account_vault_accounts("Treasury", 1, ASSET))
print(create_account_vault_accounts("Withdrawal", 3, ASSET))
```

In the above code, we have created a function that takes a prefix for the vault name and a number of vaults that we would like to create and also uses the and the internalCustRefIds and `hiddenOnUI` params, if relevant, depending on vault accounts creation purpose.

We then run it three times.

1. For the end user vaults.
2. For the treasury vault.
3. For the withdrawal vault.

## Tag / Memo Based

> **Note**
>
> Although these are basically also account based, they have a special differentiating attribute: the **tag** / **memo**. This helps us identify different customers / accounts within our single wallet, crediting customers in our internal ledger.

### Structure

* In the Omnibus Deposits vault account, you can assign each end client a tag or memo (name varies based on the blockchain).
* When adding an address for an end client in the Omnibus Deposits vault account, use the [Create a New Deposit Address of an Asset in a Vault Account API call](/reference/createvaultaccountassetaddress)

  and use the `name` parameter to associate the end client's ID, as a prefix or suffix for the name of the vault account.
  The `customerRefId` parameter is the ID for AML providers to associate the owner of funds with transactions and should now be used for other purposes. Both the name of the vault account and the AML customerRefID fields are propagated to every transaction to the end client in your system.

### Deposit

Funds are deposited using the following process:

* The end client receives a deposit address and a **tag** or **memo**.
* The end client makes a deposit, using the address and the tag.
* The incoming deposit triggers a webhook notification.
* Your client-facing software automatically notifies the end client that the deposit was successfully received, assuming he passed a **tag** or **memo**.
* All of your funds will be located in the same account, while managing different customer balances in an internal ledger.

### Example

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

// Create an omnibus vault account for Tag/Memo based assets
const createTagOmnibusAccount = async (
  numOfAddresses: number,
  assetId: string,
): Promise<{} | undefined> => {
  try {
    const myOmnibusVault = await fireblocks.vaults.createVaultAccount({
      createVaultAccountRequest: {
        name: "My Omnibus Vault",
      },
    });

    if (myOmnibusVault.data) {
      const vaultAccountId = myOmnibusVault.data.id as string;

      let result = {};

      await fireblocks.vaults.createVaultAccountAsset({
        vaultAccountId,
        assetId,
      });

      for (let i = 0; i < numOfAddresses; i++) {
        // For Tag/Memo based assets, the address of the wallet is always the same but a new Memo/Tag is generated upon each user
        await fireblocks.vaults.createVaultAccountAssetAddress({
          assetId,
          vaultAccountId,
          createAddressRequest: {
            description: `UserAddress${i + 1}`,
          },
        });
      }

      const addresses =
        await fireblocks.vaults.getVaultAccountAssetAddressesPaginated({
          vaultAccountId,
          assetId,
        });

      result = {
        "Vault Account Name": myOmnibusVault.data.name,
        "VaultAccount ID": myOmnibusVault.data.id,
        "Asset ID": assetId,
        Addresses: addresses?.data.addresses,
      };

      console.log(JSON.stringify(result, null, 2));

      return result;
    }
  } catch (error) {
    console.error(error);
  }
};

createTagWithdrawalVaultAccounts("XLM_TEST", "Withdrawal");
createTagOmnibusAccount(2, "XLM_TEST");
```

```javascript theme={"system"}
// Obtain a list of user identifiers associated with the vault accounts and pass them as a strings inside internalCustRefIds
// each of the internalCustRefIds is concatenated to the vault's name

const internalCustRefIds = ["a","b","c"];
const assetId = "XLM_TEST";

async function createTagWithdrawalVaultAccounts(assetId, name){
    vault = await fireblocks.createVaultAccount(name);
    vaultWallet = await fireblocks.createVaultAsset(Number(vault.id), assetId);
    const result = [{"Vault Name": vault.name, "Vault ID": vault.id, "Asset ID": assetId, "Wallet Address": vaultWallet.address}];
    console.log(JSON.stringify(result, null, 2));
    return(result);
}

async function createTagOmnibusAccount(amountOfVaultAccounts, assetId, internalCustRefIds){
    let vault;
    let vaultWallet;
    let tag = [];

    vault = await fireblocks.createVaultAccount("Omnibus");
    vaultWallet = await fireblocks.createVaultAsset(Number(vault.id), assetId);
    for (let i = 0; i < amountOfVaultAccounts; i++){
        tag[i] = await fireblocks.generateNewAddress(Number(vault.id), assetId, "CustomerID_"+internalCustRefIds[i]+"_vault");
    }
    console.log("Created vault account:"+JSON.stringify(vault, null, 2)+" with wallet tag:"+JSON.stringify(tag, null, 2));
    return("Omnibus:", vault, "Tags:", tag);
 }

createTagWithdrawalVaultAccounts(assetId, "Withdrawal");
 createTagOmnibusAccount(2, assetId, internalCustRefIds);
```

```python theme={"system"}
ASSET = "XLM_TEST"
CUSTOMER_IDS = ["a", "b", "c"]

def create_tag_withdrawal_vault(asset: str, name: str):
    vault_id = fireblocks.create_vault_account(name=name)["id"]
    address = fireblocks.create_vault_asset(vault_account_id=vault_id, asset_id=asset)["address"]

    return {name: vault_id}, address

def create_tag_omnibus_vault(amount: int, asset: str, customer_ids: list, hidden_on_ui: bool = True):
    deposit_tags = {}

    vault_id = fireblocks.create_vault_account(name="Omnibus")
    address = fireblocks.create_vault_asset(vault_account_id=vault_id, asset_id=asset)["address"]
    for i in range(amount):
        tag = fireblocks.generate_new_address(vault_account_id=vault_id, asset_id=asset, description=customer_ids[i], hidden_on_ui=hidden_on_ui)["tag"]
        deposit_tags[customer_ids[i]] = address

    return {"Omnibus": vault_id, "Address": address, "Tags": deposit_tags}

print(create_tag_withdrawal_vault(ASSET, "Withdrawal"))
print(create_tag_omnibus_vault(3, ASSET, CUSTOMER_IDS))
```

The above code creates the Omnibus vault and a withdrawal vault, from which we can later on move funds back to end users who would like to settle.

Afterwards, we create a deposit tag per end user, while using an available, unique customer ID. The function then returns a dictionary of the newly created vaults and generated deposit tags.
