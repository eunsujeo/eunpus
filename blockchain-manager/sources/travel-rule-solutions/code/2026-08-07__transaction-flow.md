# 03-Transaction-Flow



03-Transaction-Flow [#03-transaction-flow]

> **Note:** The flows below represent a simplified version of a VASP's deposit and withdrawal processes with Travel Rule requirements applied. The actual implementation and sequential steps may vary depending on each individual VASP's internal policies and system architecture.

<Mermaid
  chart="graph TD
    WithdrawalBegins(&#x22;Withdrawal begins - User enters required information&#x22;)
    VaspListSearch(&#x22;[API Call] VASP List Search&#x22;)
    ProvideVaspList(&#x22;Provide the VASP list to user&#x22;)
    UserSelectsBeneficiary(&#x22;User selects beneficiary VASP&#x22;)
    SearchVaspByWalletReq(&#x22;[API Call] Search VASP by Wallet Request&#x22;)
    SearchVaspByWalletRes(&#x22;[API Call] Search VASP by Wallet Result&#x22;)
    AcquisitionVaspInfo(&#x22;Acquisition of beneficiary VASP info&#x22;)
    VirtualAssetAddressSearch(&#x22;[API Call] Virtual Asset Address Search&#x22;)
    AssetTransferAuth(&#x22;[API Call] Asset Transfer Authorization&#x22;)
    GuideUser1(&#x22;[Termination] Guide user&#x22;)
    GuideUser2(&#x22;[Termination] Guide user&#x22;)
    Verified(&#x22;Verified&#x22;)
    Pending(&#x22;Pending&#x22;)
    Processing(&#x22;Processing&#x22;)
    WaitConfirmed(&#x22;Wait-Confirmed&#x22;)
    Confirmed(&#x22;Confirmed&#x22;)
    OnChainTransaction(&#x22;On-Chain Transaction&#x22;)
    ReportTransferResult(&#x22;[API Call] Report Transfer Result&#x22;)
    SaveData(&#x22;Save Data&#x22;)
    Canceled(&#x22;Canceled&#x22;)
    FinishTransfer(&#x22;[API Call] Finish Transfer&#x22;)
    GuideUser3(&#x22;[Termination] Guide user&#x22;)

    WithdrawalBegins -->|Option 1| VaspListSearch
    WithdrawalBegins -->|Option 2| SearchVaspByWalletReq

    VaspListSearch --> ProvideVaspList
    ProvideVaspList --> UserSelectsBeneficiary
    UserSelectsBeneficiary --> AcquisitionVaspInfo

    SearchVaspByWalletReq --> SearchVaspByWalletRes
    SearchVaspByWalletRes --> AcquisitionVaspInfo

    AcquisitionVaspInfo --> VirtualAssetAddressSearch

    VirtualAssetAddressSearch -->|No| GuideUser1
    VirtualAssetAddressSearch -.->|No: When option 1 preceded| SearchVaspByWalletReq
    VirtualAssetAddressSearch -->|Yes| AssetTransferAuth

    AssetTransferAuth -->|No| GuideUser2
    AssetTransferAuth -->|Yes| Verified

    Verified -->|Yes| Pending
    Verified -->|No: Rejected due to internal policy| Canceled

    Pending -->|Yes| Processing
    Pending -->|No| Canceled

    Processing -->|Yes| WaitConfirmed
    Processing -->|No| Canceled

    WaitConfirmed -->|Yes| Confirmed
    WaitConfirmed -->|No| Canceled

    Confirmed -->|Yes| OnChainTransaction
    OnChainTransaction -->|Yes| ReportTransferResult
    ReportTransferResult -->|Yes| SaveData

    Canceled -->|Yes| FinishTransfer
    FinishTransfer -->|Yes| GuideUser3

    subgraph &#x22;Process on the blockchain&#x22;
        WaitConfirmed
        Confirmed
        OnChainTransaction
    end"
/>

2\. Deposit [#2-deposit]

<Mermaid
  chart="graph TD
    OnChainMonitoring(&#x22;On-Chain transaction monitoring&#x22;)
    TransactionDetected(&#x22;Transaction detected&#x22;)
    DataMapping(&#x22;Transaction & Travel Rule Data Mapping&#x22;)
    PolicyOption(&#x22;Option: Depends on YOUR policy&#x22;)
    WaitPending(&#x22;Wait for confirm(Pending)&#x22;)
    
    TransactionStatusSearch(&#x22;[API Call] Transaction Status Search&#x22;)
    ReportTransferConfirmed(&#x22;[API Call] Report Transfer Result: Confirmed&#x22;)
    FinishTransferCanceled(&#x22;[API Call] Finish Transfer: Canceled&#x22;)
    
    TransferVerification(&#x22;Transfer confirmation verification&#x22;)
    GuideUser(&#x22;[Termination] Guide user&#x22;)
    
    SearchVaspReq(&#x22;[API Call] Search VASP by TXID Request&#x22;)
    SearchVaspRes(&#x22;[API Call] Search VASP by TXID Result&#x22;)
    SearchVaspResponse(&#x22;[API Response] Search VASP by TXID Result Response&#x22;)
    AssetTransferReq(&#x22;[API Call] Asset Transfer Data Request&#x22;)
    AssetTransferRes(&#x22;[API Response] Asset Transfer Data Request Response&#x22;)
    
    SaveTravelRuleData(&#x22;Save Travel Rule Data&#x22;)
    UpdateBalance(&#x22;Update user balance&#x22;)

    OnChainMonitoring --> TransactionDetected
    TransactionDetected --> DataMapping
    
    DataMapping -->|Yes| WaitPending
    DataMapping -->|No| PolicyOption
    
    PolicyOption --> SearchVaspReq
    
    WaitPending --> TransactionStatusSearch
    WaitPending --> ReportTransferConfirmed
    WaitPending --> FinishTransferCanceled
    
    TransactionStatusSearch --> TransferVerification
    ReportTransferConfirmed --> TransferVerification
    
    FinishTransferCanceled --> GuideUser
    
    SearchVaspReq --> SearchVaspRes
    SearchVaspRes --> SearchVaspResponse
    SearchVaspResponse --> AssetTransferReq
    AssetTransferReq --> AssetTransferRes
    
    TransferVerification --> SaveTravelRuleData
    AssetTransferRes --> SaveTravelRuleData
    
    SaveTravelRuleData --> UpdateBalance"
/>
