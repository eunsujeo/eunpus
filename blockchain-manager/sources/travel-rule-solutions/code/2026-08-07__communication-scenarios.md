# 02-Communication-Scenarios



02-Communication-Scenarios [#02-communication-scenarios]

Communication scenarios for the Travel Rule can be divided into two categories.

1. **Standard**: Transactions where both the originating and beneficiary VASPs comply with the Travel Rule.
2. **Sunrise**: Transactions where only one side (beneficiary) complies with the Travel Rule due to a regulatory mismatch.

Standard [#standard]

<Mermaid
  chart="sequenceDiagram
    autonumber
    participant BC as Blockchain
    participant O as Originator
    participant OV as Origin VASP
    participant CV as CodeVASP
    participant BV as Beneficiary VASP
    participant B as Beneficiary

    rect rgb(240, 240, 240)
        Note over OV, BV: Secured Channel
        OV->>CV: [Request] VASP List Search
        CV-->>OV: VASP List Search [Response]
    end

    OV->>O: Show VASP List
    O->>OV: Enter beneficiary's name & wallet address,<br/>select beneficiary VASP

    Note over OV: 03. Virtual Asset Address Search
    OV->>CV: [Request] Virtual Asset Address Search
    CV->>BV: Virtual Asset Address Search
    Note right of BV: 1. Decrypt payload with private key<br/>2. Verify wallet address ownership
    BV-->>CV: Virtual Asset Address Search [Response]
    CV-->>OV: 'valid' / 'invalid'

    alt is Invalid (03-1)
        Note over OV: Call 'Search VASP by Wallet'<br/>Notify user / Terminate process
    end

    Note over OV: 04. Asset Transfer Authorization
    OV->>CV: [Request] Asset Transfer Authorization
    CV->>BV: Asset Transfer Authorization
    Note right of BV: 1. Decrypt/Extract info<br/>2. Compare with internal DB<br/>3. Check if required info exists
    BV-->>CV: Asset Transfer Authorization [Response]
    CV-->>OV: 'verified' / 'denied'

    alt is Denied (04-1)
        Note over OV: Check reason code & retry if possible<br/>(e.g., swap first/last name)
    end

    Note over BC: 05. Blockchain transaction execution
    OV->>BC: Execute Transaction
    BC-->>OV: Transaction Monitoring
    
    alt Retry if failed (5-1)
        OV->>BC: Retry execution
    end

    Note over BV: 06-2. Transaction Status Search
    BV->>CV: [Request] Transaction Status Search
    CV-->>BV: Transaction Status Search [Response]

    Note over OV: 06. Reporting
    OV->>CV: [Request] Report Transfer Result (txid)
    CV-->>BV: 'Report Transfer Result (txid)' [Response]
    BV->>BV: Save Travel Rule & TxID
    BV->>B: Update User Balance

    rect rgb(255, 235, 235)
        Note over OV, BV: 06-1. Finish Transfer (Cancellation Logic)
        OV->>CV: [Request] Finish Transfer
        CV-->>BV: Finish Transfer [Response]
    end"
/>

1\. Encrypted Communication [#1-encrypted-communication]

Travel Rule traffic between the originating VASP - CodeVASP - beneficiary VASP is protected with end-to-end encryption. Since users' personal information is encrypted, CodeVASP cannot access or process this data.

To encrypt and decrypt data, public key and private key are used. To encrypt and decrypt data, use public and private keys. For encryption, fetch the counterparty VASP's public key via the 'VASP List Search' or 'Public Key Search' API endpoints. For decryption, use your private key.

Always encrypt the 'payload'.

2\. Managing VASP List [#2-managing-vasp-list]

Each VASP should maintain a list of VASPs it can communicate with.

You can request the 'VASP List Search' from CodeVASP to retrieve a list of VASPs compatible with the CodeVASP protocol. This list can be displayed as the "Exchange" list on the user withdrawal interface.

When integrating with multiple protocols beyond CodeVASP, the same exchange may appear multiple times in the list. To avoid duplication, filter the list using a unique identifier, such as 'entityId'.

Additionally, whether a VASP supports actual deposits and withdrawals depends not only on protocol integration but also on policy-based integration. Policy-based integration performed after CodeVASP protocol setup and varies based on jurisdiction and the VASP's internal policies. When managing the VASP list displayed to users, ensure you account for actual integration status to avoid confusing or misleading users.

Users will select a beneficiary VASP from this list and enter a wallet address.

3\. Wallet Address Verification [#3-wallet-address-verification]

Before the originating and beneficiary VASPs communicate for asset transfers, verify that the wallet address entered by the user belongs to the selected VASP.

During the asset transfer authorization request, personal information such as the user's name and date of birth (DoB) is exchanged. To prevent data leaks to an unrelated third party from user errors in selecting the beneficiary VASP, validate the selected VASP first.

3-1. Invalid Wallet Address [#3-1-invalid-wallet-address]

If the response is 'invalid', the target VASP was incorrectly selected. You can implement a fallback process using 'Search VASP by Wallet' API. If 'Search VASP by Wallet' returns 'valid', update the target VASP information and proceed. If 'invalid', terminate the process and guide the user to restart from the beginning.

4\. Asset Transfer Authorization [#4-asset-transfer-authorization]

This stage involves the originating and beneficiary VASPs exchanging information to comply with the travel rule. The originating VASP populates the 'payload' with details about the originating VASP, originator, beneficiary VASP, and beneficiary. The originator's information must include their date of birth (DoB), while the beneficiary's information may exclude it. Encrypt the 'payload' and send it via the 'Asset Transfer Authorization' API.

The beneficiary VASP decrypts the payload and compares the travel rule data with its database. Depending on internal policies, the beneficiary VASP may check for the presence of specific originator details(e.g., name, wallet address). Make sure the originator's information follows the CodeVASP guidelines.

4-1. Authorization Denied [#4-1-authorization-denied]

If the response is 'denied', check the 'reasonType' and 'reasonMsg'. You may retry based on the reason. For example, for 'INPUT\_NAME\_MISMATCHED', you could retry by switching the first/last name sequence.  For reasons unsuitable for retry, terminate the process and proceed with steps tailored to each reason.

5\. On-Chain Transaction [#5-on-chain-transaction]

Once the asset transfer authorization is approved, the originating VASP executes the on-chain transaction. The beneficiary VASP monitors the transaction and detects its completion.

5-1. Transaction Failure [#5-1-transaction-failure]

If the blockchain transaction fails, you can retry blockchain execution.

6\. Asset Transfer Result Report [#6-asset-transfer-result-report]

After the blockchain transaction completes, the originating VASP sends the txid to the beneficiary VASP to confirm the asset transfer's success. The beneficiary VASP links the travel rule data with the txid using the 'transferId' and stores it. Some beneficiary VASPs may not process deposits without the txid, so it must be sent.

If the process completes successfully, both VASPs store the travel rule data and txid, and the beneficiary VASP updates the user's balance.

6-1. Undelivered txid [#6-1-undelivered-txid]

If the beneficiary VASP does not receive the txid after a specified period, it can query the transaction status using the 'Transaction Status Search' API.

6-2. Transaction Failure After Txid Report [#6-2-transaction-failure-after-txid-report]

In rare cases, the blockchain transaction may fail after the txid is reported, or the user may cancel the transfer immediately after. In such cases, the originating VASP must notify the beneficiary VASP using 'Finish Transfer' API.

***

Sunrise [#sunrise]

<Mermaid
  chart="sequenceDiagram
    participant BC as Blockchain
    participant O as Originator
    participant OV as Origin VASP
    participant CV as CodeVASP
    participant BV as Beneficiary VASP
    participant B as Beneficiary

    rect rgb(240, 240, 240)
        Note over OV, BV: 01. Secured Channel
    end

    %% Step 02
    BC->>BV: 02. txid (Transaction detected)
    Note right of BV: Origin VASP & Originator unknown
    BV->>BV: Query beneficiary user info from DB<br/>using wallet address
    Note right of BV: User Balance Hold

    %% Step 03
    rect rgb(245, 245, 245)
        Note over CV, BV: 03. VASP Search by TXID
        BV->>CV: [Request] Search VASP by TXID Request
        CV->>CV: Run VASP Search
        BV->>CV: [Request] Search VASP by TXID Result
        CV-->>BV: Search VASP by TXID Result [Response]
    end

    Note over BV: 3-1: Option for callbackUrl<br/>3-2: Handling 'Invalid' response

    %% Step 04
    rect rgb(245, 245, 245)
        Note over OV, BV: 04. Asset Transfer Data Request
        Note right of BV: 1. Create payload (Beneficiary/VASP info)<br/>2. Encrypt with OV Public Key
        BV->>OV: [Request] Asset Transfer Data Request
        
        Note left of OV: 1. Decrypt with OV Private Key<br/>2. Query withdraw data via txid<br/>3. Retrieve originator info<br/>4. Add Originator/VASP info<br/>5. Encrypt with BV Public Key
        
        OV-->>BV: Asset Transfer Data Request [Response]
        
        Note right of BV: 1. Decrypt with BV Private Key
    end

    %% Step 05
    Note over OV, BV: 05. Completion & Saving
    OV->>OV: Save Travel Rule data & Txid
    BV->>BV: Save Travel Rule data & Txid
    BV->>B: Update User Balance"
/>

1\. Encrypted Communication [#1-encrypted-communication-1]

Travel Rule traffic between the originating VASP - CodeVASP - beneficiary VASP is protected with end-to-end encryption. Since users' personal information is encrypted, CodeVASP cannot access or process this data.

To encrypt and decrypt data, public key and private key are used. To encrypt and decrypt data, use public and private keys. For encryption, fetch the counterparty VASP's public key via the 'VASP List Search' or 'Public Key Search' API endpoints. For decryption, use your private key.

Always encrypt the 'payload'.

2\. Anonymous Transactions [#2-anonymous-transactions]

Anonymous transactions occur when assets are received without prior verification or authorization, often due to differing regulatory requirements across jurisdictions. For a beneficiary VASP, this means assets arrive at a user's wallet without knowing the originating VASP or user.

When such transactions occur, the beneficiary VASP queries user information based on the wallet address and holds off on updating the user's balance.

3\. VASP Search [#3-vasp-search]

To comply with regulations and process an anonymous transaction, the beneficiary VASP must identify the originating VASP. Send a 'Search VASP by TXID Request' request to CodeVASP, which queries its network for matching transfer records.

This request is asynchronous, so call the 'Search VASP by TXID Result' API to retrieve the result. A 'valid' response indicates a successful search, allowing you to proceed with the identified VASP as the target.

3-1. Callback URL [#3-1-callback-url]

If calling the result API feels inconvenient, include a 'callbackUrl' in the 'Search VASP by TXID Request' request. CodeVASP will send the result to this URL upon completion. Ensure the URL allows CodeVASP's IP access.

3-2. Invalid Result [#3-2-invalid-result]

If the result is invalid, follow internal policies, such as requesting clarification from the customer.

4\. Data Request [#4-data-request]

Once the originating VASP is identified, the beneficiary VASP initiates user data exchange. Populate a 'payload' with 'Beneficiary' and 'BeneficiaryVASP' information, encrypt it, and send the request.

The originating VASP decrypts the 'payload', retrieves transfer and user information based on the txid, adds 'Originator' and 'OriginatingVASP' details, encrypts the payload, and responds.

The beneficiary VASP decrypts the received 'payload'.

5\. Data Storage [#5-data-storage]

Both the originating and beneficiary VASPs store the asset transfer and travel rule data. The beneficiary VASP updates the user's balance. This process, where the stricter-regulated VASP queries the less-regulated one, ensures travel rule compliance.
