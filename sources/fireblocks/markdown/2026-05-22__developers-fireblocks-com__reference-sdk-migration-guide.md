> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# SDK Migration Guide

export const PY_SDK_ROWS = [{
  "cls": "ApiUserApi",
  "method": "create_api_user",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ApiUserApi.md#create_api_user",
  "http": "POST /management/api_users",
  "legacyName": "create_api_user",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ApiUserApi",
  "method": "get_api_users",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ApiUserApi.md#get_api_users",
  "http": "GET /management/api_users",
  "legacyName": "get_api_users",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "AssetsApi",
  "method": "create_assets_bulk",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/AssetsApi.md#create_assets_bulk",
  "http": "POST /vault/assets/bulk",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "AuditLogsApi",
  "method": "get_audit_logs",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/AuditLogsApi.md#get_audit_logs",
  "http": "GET /management/audit_logs",
  "legacyName": "get_paginated_audit_logs",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsApi",
  "method": "get_supported_assets",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/BlockchainsAssetsApi.md#get_supported_assets",
  "http": "GET /supported_assets",
  "legacyName": "get_supported_assets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsApi",
  "method": "register_new_asset",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/BlockchainsAssetsApi.md#register_new_asset",
  "http": "POST /assets",
  "legacyName": "register_new_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsApi",
  "method": "set_asset_price",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/BlockchainsAssetsApi.md#set_asset_price",
  "http": "POST /assets/prices/\\{id}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "BlockchainsAssetsBetaApi",
  "method": "get_asset_by_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/BlockchainsAssetsBetaApi.md#get_asset_by_id",
  "http": "GET /assets/\\{id}",
  "legacyName": "get_asset_by_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsBetaApi",
  "method": "get_blockchain_by_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/BlockchainsAssetsBetaApi.md#get_blockchain_by_id",
  "http": "GET /blockchains/\\{id}",
  "legacyName": "get_blockchain_by_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsBetaApi",
  "method": "list_assets",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/BlockchainsAssetsBetaApi.md#list_assets",
  "http": "GET /assets",
  "legacyName": "list_assets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsBetaApi",
  "method": "list_blockchains",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/BlockchainsAssetsBetaApi.md#list_blockchains",
  "http": "GET /blockchains",
  "legacyName": "list_blockchains",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ComplianceApi",
  "method": "get_aml_post_screening_policy",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ComplianceApi.md#get_aml_post_screening_policy",
  "http": "GET /screening/aml/post_screening_policy",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ComplianceApi",
  "method": "get_aml_screening_policy",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ComplianceApi.md#get_aml_screening_policy",
  "http": "GET /screening/aml/screening_policy",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ComplianceApi",
  "method": "get_post_screening_policy",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ComplianceApi.md#get_post_screening_policy",
  "http": "GET /screening/travel_rule/post_screening_policy",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ComplianceApi",
  "method": "get_screening_full_details",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ComplianceApi.md#get_screening_full_details",
  "http": "GET /screening/transaction/{txId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ComplianceApi",
  "method": "get_screening_policy",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ComplianceApi.md#get_screening_policy",
  "http": "GET /screening/travel_rule/screening_policy",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ComplianceApi",
  "method": "retry_rejected_transaction_bypass_screening_checks",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ComplianceApi.md#retry_rejected_transaction_bypass_screening_checks",
  "http": "POST /screening/transaction/{txId}/bypass_screening_policy",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ComplianceApi",
  "method": "update_aml_screening_configuration",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ComplianceApi.md#update_aml_screening_configuration",
  "http": "PUT /screening/aml/policy_configuration",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ComplianceApi",
  "method": "update_screening_configuration",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ComplianceApi.md#update_screening_configuration",
  "http": "PUT /screening/configurations",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ComplianceApi",
  "method": "update_travel_rule_config",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ComplianceApi.md#update_travel_rule_config",
  "http": "PUT /screening/travel_rule/policy_configuration",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ComplianceScreeningConfigurationApi",
  "method": "get_aml_screening_configuration",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ComplianceScreeningConfigurationApi.md#get_aml_screening_configuration",
  "http": "GET /screening/aml/policy_configuration",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ComplianceScreeningConfigurationApi",
  "method": "get_screening_configuration",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ComplianceScreeningConfigurationApi.md#get_screening_configuration",
  "http": "GET /screening/travel_rule/policy_configuration",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ConsoleUserApi",
  "method": "create_console_user",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ConsoleUserApi.md#create_console_user",
  "http": "POST /management/users",
  "legacyName": "create_console_user",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ConsoleUserApi",
  "method": "get_console_users",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ConsoleUserApi.md#get_console_users",
  "http": "GET /management/users",
  "legacyName": "get_console_users",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractInteractionsApi",
  "method": "get_deployed_contract_abi",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractInteractionsApi.md#get_deployed_contract_abi",
  "http": "GET\n              /contract_interactions/base_asset_id/{baseAssetId}/contract_address/{contractAddress}/functions",
  "legacyName": "get_contract_abi",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractInteractionsApi",
  "method": "get_transaction_receipt",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractInteractionsApi.md#get_transaction_receipt",
  "http": "GET\n              /contract_interactions/base_asset_id/{baseAssetId}/tx_hash/{txHash}/receipt",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ContractInteractionsApi",
  "method": "read_call_function",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractInteractionsApi.md#read_call_function",
  "http": "POST\n              /contract_interactions/base_asset_id/{baseAssetId}/contract_address/{contractAddress}/functions/read",
  "legacyName": "read_contract_call_function",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractInteractionsApi",
  "method": "write_call_function",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractInteractionsApi.md#write_call_function",
  "http": "POST\n              /contract_interactions/base_asset_id/{baseAssetId}/contract_address/{contractAddress}/functions/write",
  "legacyName": "write_contract_call_function",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractsApi",
  "method": "add_contract_asset",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractsApi.md#add_contract_asset",
  "http": "POST /contracts/{contractId}/{assetId}",
  "legacyName": "create_contract_wallet_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractsApi",
  "method": "create_contract",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractsApi.md#create_contract",
  "http": "POST /contracts",
  "legacyName": "create_contract_wallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractsApi",
  "method": "delete_contract_asset",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractsApi.md#delete_contract_asset",
  "http": "DELETE /contracts/{contractId}/{assetId}",
  "legacyName": "delete_contract_wallet_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractsApi",
  "method": "get_contract_asset",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractsApi.md#get_contract_asset",
  "http": "GET /contracts/{contractId}/{assetId}",
  "legacyName": "get_contract_wallet_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractsApi",
  "method": "get_contracts",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractsApi.md#get_contracts",
  "http": "GET /contracts",
  "legacyName": "get_contract_wallets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractTemplatesApi",
  "method": "delete_contract_template_by_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractTemplatesApi.md#delete_contract_template_by_id",
  "http": "DELETE /tokenization/templates/{contractTemplateId}",
  "legacyName": "delete_contract_template",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractTemplatesApi",
  "method": "deploy_contract",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractTemplatesApi.md#deploy_contract",
  "http": "POST /tokenization/templates/{contractTemplateId}/deploy",
  "legacyName": "deploy_contract",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractTemplatesApi",
  "method": "get_constructor_by_contract_template_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractTemplatesApi.md#get_constructor_by_contract_template_id",
  "http": "GET /tokenization/templates/{contractTemplateId}/constructor",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ContractTemplatesApi",
  "method": "get_contract_template_by_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractTemplatesApi.md#get_contract_template_by_id",
  "http": "GET /tokenization/templates/{contractTemplateId}",
  "legacyName": "get_contract_template_deploy_function",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractTemplatesApi",
  "method": "get_contract_templates",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractTemplatesApi.md#get_contract_templates",
  "http": "GET /tokenization/templates",
  "legacyName": "get_contract_templates",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractTemplatesApi",
  "method": "get_function_abi_by_contract_template_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractTemplatesApi.md#get_function_abi_by_contract_template_id",
  "http": "GET /tokenization/templates/{contractTemplateId}/function",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ContractTemplatesApi",
  "method": "upload_contract_template",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ContractTemplatesApi.md#upload_contract_template",
  "http": "POST /tokenization/templates",
  "legacyName": "upload_contract_template",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "CosignersBetaApi",
  "method": "add_cosigner",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/CosignersBetaApi.md#add_cosigner",
  "http": "POST /cosigners",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "get_request_status",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/CosignersBetaApi.md#get_request_status",
  "http": "GET /cosigners/{cosignerId}/api_keys/{apiKeyId}/{requestId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "get_api_keys",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/CosignersBetaApi.md#get_api_keys",
  "http": "GET /cosigners/{cosignerId}/api_keys",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "get_cosigners",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/CosignersBetaApi.md#get_cosigners",
  "http": "GET /cosigners",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "pair_api_key",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/CosignersBetaApi.md#pair_api_key",
  "http": "PUT /cosigners/{cosignerId}/api_keys/{apiKeyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "update_callback_handler",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/CosignersBetaApi.md#update_callback_handler",
  "http": "PATCH /cosigners/{cosignerId}/api_keys/{apiKeyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "unpair_api_key",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/CosignersBetaApi.md#unpair_api_key",
  "http": "DELETE /cosigners/{cosignerId}/api_keys/{apiKeyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "DeployedContractsApi",
  "method": "add_contract_abi",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/DeployedContractsApi.md#add_contract_abi",
  "http": "POST /tokenization/contracts/abi",
  "legacyName": "save_abi",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "DeployedContractsApi",
  "method": "fetch_contract_abi",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/DeployedContractsApi.md#fetch_contract_abi",
  "http": "POST /tokenization/contracts/fetch_abi",
  "legacyName": "fetch_or_scrape_abi",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "DeployedContractsApi",
  "method": "get_deployed_contract_by_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/DeployedContractsApi.md#get_deployed_contract_by_id",
  "http": "GET /tokenization/contracts/\\{id}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "DeployedContractsApi",
  "method": "get_deployed_contracts",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/DeployedContractsApi.md#get_deployed_contracts",
  "http": "GET /tokenization/contracts",
  "legacyName": "get_contracts_by_filter",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "EmbeddedWalletsApi",
  "method": "get_public_key_info_ncw",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/EmbeddedWalletsApi.md#get_public_key_info_ncw",
  "http": "GET /ncw/{walletId}/public_key_info",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ExchangeAccountsApi",
  "method": "add_exchange_account",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ExchangeAccountsApi.md#add_exchange_account",
  "http": "POST /exchange_accounts",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ExchangeAccountsApi",
  "method": "convert_assets",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ExchangeAccountsApi.md#convert_assets",
  "http": "POST /exchange_accounts/{exchangeAccountId}/convert",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ExchangeAccountsApi",
  "method": "get_exchange_account_asset",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ExchangeAccountsApi.md#get_exchange_account_asset",
  "http": "GET /exchange_accounts/{exchangeAccountId}/{assetId}",
  "legacyName": "get_exchange_account_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExchangeAccountsApi",
  "method": "get_exchange_accounts_credentials_public_key",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ExchangeAccountsApi.md#get_exchange_accounts_credentials_public_key",
  "http": "GET /exchange_accounts/credentials_public_key",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ExchangeAccountsApi",
  "method": "get_paged_exchange_accounts",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ExchangeAccountsApi.md#get_paged_exchange_accounts",
  "http": "GET /exchange_accounts/paged",
  "legacyName": "get_exchange_accounts_paged",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExchangeAccountsApi",
  "method": "internal_transfer",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ExchangeAccountsApi.md#internal_transfer",
  "http": "POST /exchange_accounts/{exchangeAccountId}/internal_transfer",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ExternalWalletsApi",
  "method": "add_asset_to_external_wallet",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ExternalWalletsApi.md#add_asset_to_external_wallet",
  "http": "POST /external_wallets/{walletId}/{assetId}",
  "legacyName": "create_external_wallet_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExternalWalletsApi",
  "method": "create_external_wallet",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ExternalWalletsApi.md#create_external_wallet",
  "http": "POST /external_wallets",
  "legacyName": "create_external_wallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExternalWalletsApi",
  "method": "remove_asset_from_external_wallet",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ExternalWalletsApi.md#remove_asset_from_external_wallet",
  "http": "DELETE /external_wallets/{walletId}/{assetId}",
  "legacyName": "delete_external_wallet_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExternalWalletsApi",
  "method": "get_external_wallet_asset",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ExternalWalletsApi.md#get_external_wallet_asset",
  "http": "GET /external_wallets/{walletId}/{assetId}",
  "legacyName": "get_external_wallet_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExternalWalletsApi",
  "method": "get_external_wallets",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ExternalWalletsApi.md#get_external_wallets",
  "http": "GET /external_wallets",
  "legacyName": "get_external_wallets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExternalWalletsApi",
  "method": "set_external_wallet_customer_ref_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ExternalWalletsApi.md#set_external_wallet_customer_ref_id",
  "http": "POST /external_wallets/{walletId}/set_customer_ref_id",
  "legacyName": "set_customer_ref_id_for_external_wallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "FiatAccountsApi",
  "method": "deposit_funds_from_linked_dda",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/FiatAccountsApi.md#deposit_funds_from_linked_dda",
  "http": "POST /fiat_accounts/{accountId}/deposit_from_linked_dda",
  "legacyName": "deposit_from_linked_dda",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "FiatAccountsApi",
  "method": "get_fiat_account",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/FiatAccountsApi.md#get_fiat_account",
  "http": "GET /fiat_accounts/{accountId}",
  "legacyName": "get_fiat_account_by_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "FiatAccountsApi",
  "method": "get_fiat_accounts",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/FiatAccountsApi.md#get_fiat_accounts",
  "http": "GET /fiat_accounts",
  "legacyName": "get_fiat_accounts",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "FiatAccountsApi",
  "method": "redeem_funds_to_linked_dda",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/FiatAccountsApi.md#redeem_funds_to_linked_dda",
  "http": "POST /fiat_accounts/{accountId}/redeem_to_linked_dda",
  "legacyName": "redeem_to_linked_dda",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "GasStationsApi",
  "method": "get_gas_station_by_asset_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/GasStationsApi.md#get_gas_station_by_asset_id",
  "http": "GET /gas_station/{assetId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "GasStationsApi",
  "method": "get_gas_station_info",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/GasStationsApi.md#get_gas_station_info",
  "http": "GET /gas_station",
  "legacyName": "get_gas_station_info",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "GasStationsApi",
  "method": "update_gas_station_configuration",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/GasStationsApi.md#update_gas_station_configuration",
  "http": "PUT /gas_station/configuration",
  "legacyName": "set_gas_station_configuration",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "GasStationsApi",
  "method": "update_gas_station_configuration_by_asset_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/GasStationsApi.md#update_gas_station_configuration_by_asset_id",
  "http": "PUT /gas_station/configuration/{assetId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "InternalWalletsApi",
  "method": "create_internal_wallet",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/InternalWalletsApi.md#create_internal_wallet",
  "http": "POST /internal_wallets",
  "legacyName": "create_internal_wallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "create_internal_wallet_asset",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/InternalWalletsApi.md#create_internal_wallet_asset",
  "http": "POST /internal_wallets/{walletId}/{assetId}",
  "legacyName": "create_internal_wallet_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "delete_internal_wallet_asset",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/InternalWalletsApi.md#delete_internal_wallet_asset",
  "http": "DELETE /internal_wallets/{walletId}/{assetId}",
  "legacyName": "delete_internal_wallet_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "get_internal_wallet_asset",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/InternalWalletsApi.md#get_internal_wallet_asset",
  "http": "GET /internal_wallets/{walletId}/{assetId}",
  "legacyName": "get_internal_wallet_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "get_internal_wallets",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/InternalWalletsApi.md#get_internal_wallets",
  "http": "GET /internal_wallets",
  "legacyName": "get_internal_wallets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "set_customer_ref_id_for_internal_wallet",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/InternalWalletsApi.md#set_customer_ref_id_for_internal_wallet",
  "http": "POST /internal_wallets/{walletId}/set_customer_ref_id",
  "legacyName": "set_customer_ref_id_for_internal_wallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "JobManagementApi",
  "method": "cancel_job",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/JobManagementApi.md#cancel_job",
  "http": "POST /batch/{jobId}/cancel",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "JobManagementApi",
  "method": "continue_job",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/JobManagementApi.md#continue_job",
  "http": "POST /batch/{jobId}/continue",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "JobManagementApi",
  "method": "get_job",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/JobManagementApi.md#get_job",
  "http": "GET /batch/{jobId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "JobManagementApi",
  "method": "get_job_tasks",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/JobManagementApi.md#get_job_tasks",
  "http": "GET /batch/{jobId}/tasks",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "JobManagementApi",
  "method": "get_jobs",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/JobManagementApi.md#get_jobs",
  "http": "GET /batch/jobs",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "JobManagementApi",
  "method": "pause_job",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/JobManagementApi.md#pause_job",
  "http": "POST /batch/{jobId}/pause",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "create_signing_key",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/KeyLinkBetaApi.md#create_signing_key",
  "http": "POST /key_link/signing_keys",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "create_validation_key",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/KeyLinkBetaApi.md#create_validation_key",
  "http": "POST /key_link/validation_keys",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "disable_validation_key",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/KeyLinkBetaApi.md#disable_validation_key",
  "http": "PATCH /key_link/validation_keys/{keyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "get_signing_key",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/KeyLinkBetaApi.md#get_signing_key",
  "http": "GET /key_link/signing_keys/{keyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "get_signing_keys_list",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/KeyLinkBetaApi.md#get_signing_keys_list",
  "http": "GET /key_link/signing_keys",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "get_validation_key",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/KeyLinkBetaApi.md#get_validation_key",
  "http": "GET /key_link/validation_keys/{keyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "get_validation_keys_list",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/KeyLinkBetaApi.md#get_validation_keys_list",
  "http": "GET /key_link/validation_keys",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "set_agent_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/KeyLinkBetaApi.md#set_agent_id",
  "http": "PATCH /key_link/signing_keys/{keyId}/agent_user_id",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "update_signing_key",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/KeyLinkBetaApi.md#update_signing_key",
  "http": "PATCH /key_link/signing_keys/{keyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeysBetaApi",
  "method": "get_mpc_keys_list",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/KeysBetaApi.md#get_mpc_keys_list",
  "http": "GET /keys/mpc/list",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeysBetaApi",
  "method": "get_mpc_keys_list_by_user",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/KeysBetaApi.md#get_mpc_keys_list_by_user",
  "http": "GET /keys/mpc/list/{userId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "NetworkConnectionsApi",
  "method": "get_network",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#get_network",
  "http": "GET /network_connections/{connectionId}",
  "legacyName": "get_network_connection_by_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "create_network_connection",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#create_network_connection",
  "http": "POST /network_connections",
  "legacyName": "create_network_connection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "create_network_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#create_network_id",
  "http": "POST /network_ids",
  "legacyName": "create_network_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "delete_network_connection",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#delete_network_connection",
  "http": "DELETE /network_connections/{connectionId}",
  "legacyName": "remove_network_connection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "delete_network_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#delete_network_id",
  "http": "DELETE /network_ids/{networkId}",
  "legacyName": "delete_network_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "get_network_connections",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#get_network_connections",
  "http": "GET /network_connections",
  "legacyName": "get_network_connections",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "get_network_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#get_network_id",
  "http": "GET /network_ids/{networkId}",
  "legacyName": "get_network_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "get_network_ids",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#get_network_ids",
  "http": "GET /network_ids",
  "legacyName": "get_discoverable_network_ids",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "get_routing_policy_asset_groups",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#get_routing_policy_asset_groups",
  "http": "GET /network_ids/routing_policy_asset_groups",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "NetworkConnectionsApi",
  "method": "search_network_ids",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#search_network_ids",
  "http": "GET /network_ids/search",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "NetworkConnectionsApi",
  "method": "set_network_id_discoverability",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#set_network_id_discoverability",
  "http": "PATCH /network_ids/{networkId}/set_discoverability",
  "legacyName": "set_network_id_discoverability",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "set_network_id_name",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#set_network_id_name",
  "http": "PATCH /network_ids/{networkId}/set_name",
  "legacyName": "set_network_id_name",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "set_network_id_routing_policy",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#set_network_id_routing_policy",
  "http": "PATCH /network_ids/{networkId}/set_routing_policy",
  "legacyName": "set_network_id_routing_policy",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "set_routing_policy",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NetworkConnectionsApi.md#set_routing_policy",
  "http": "PATCH /network_connections/{connectionId}/set_routing_policy",
  "legacyName": "set_network_connection_routing_policy",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "get_nft",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NFTsApi.md#get_nft",
  "http": "GET /nfts/tokens/\\{id}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "NFTsApi",
  "method": "get_nfts",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NFTsApi.md#get_nfts",
  "http": "GET /nfts/tokens",
  "legacyName": "get_nfts",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "get_ownership_tokens",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NFTsApi.md#get_ownership_tokens",
  "http": "GET /nfts/ownership/tokens",
  "legacyName": "get_owned_nfts",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "list_owned_collections",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NFTsApi.md#list_owned_collections",
  "http": "GET /nfts/ownership/collections",
  "legacyName": "list_owned_collections",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "list_owned_tokens",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NFTsApi.md#list_owned_tokens",
  "http": "GET /nfts/ownership/assets",
  "legacyName": "list_owned_assets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "refresh_nft_metadata",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NFTsApi.md#refresh_nft_metadata",
  "http": "PUT /nfts/tokens/\\{id}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "NFTsApi",
  "method": "update_ownership_tokens",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NFTsApi.md#update_ownership_tokens",
  "http": "PUT /nfts/ownership/tokens",
  "legacyName": "refresh_nft_ownership_by_vault",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "update_token_ownership_status",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NFTsApi.md#update_token_ownership_status",
  "http": "PUT /nfts/ownership/tokens/\\{id}/status",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "NFTsApi",
  "method": "update_tokens_ownership_spam",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NFTsApi.md#update_tokens_ownership_spam",
  "http": "PUT /nfts/ownership/tokens/spam",
  "legacyName": "update_nft_token_ownerships_spam_status",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "update_tokens_ownership_status",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/NFTsApi.md#update_tokens_ownership_status",
  "http": "PUT /nfts/ownership/tokens/status",
  "legacyName": "update_nft_ownerships_status",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "OffExchangesApi",
  "method": "add_off_exchange",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/OffExchangesApi.md#add_off_exchange",
  "http": "POST /off_exchange/add",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "OffExchangesApi",
  "method": "get_off_exchange_collateral_accounts",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/OffExchangesApi.md#get_off_exchange_collateral_accounts",
  "http": "GET /off_exchange/collateral_accounts/{mainExchangeAccountId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "OffExchangesApi",
  "method": "get_off_exchange_settlement_transactions",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/OffExchangesApi.md#get_off_exchange_settlement_transactions",
  "http": "GET /off_exchange/settlements/transactions",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "OffExchangesApi",
  "method": "remove_off_exchange",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/OffExchangesApi.md#remove_off_exchange",
  "http": "POST /off_exchange/remove",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "OffExchangesApi",
  "method": "settle_off_exchange_trades",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/OffExchangesApi.md#settle_off_exchange_trades",
  "http": "POST /off_exchange/settlements/trader",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "OTABetaApi",
  "method": "get_ota_status",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/OTABetaApi.md#get_ota_status",
  "http": "GET /management/ota",
  "legacyName": "get_ota_configuration",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "OTABetaApi",
  "method": "set_ota_status",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/OTABetaApi.md#set_ota_status",
  "http": "PUT /management/ota",
  "legacyName": "update_ota_configuration",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "PaymentsPayoutApi",
  "method": "create_payout",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/PaymentsPayoutApi.md#create_payout",
  "http": "POST /payments/payout",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "PaymentsPayoutApi",
  "method": "execute_payout_action",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/PaymentsPayoutApi.md#execute_payout_action",
  "http": "POST /payments/payout/{payoutId}/actions/execute",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "PaymentsPayoutApi",
  "method": "get_payout",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/PaymentsPayoutApi.md#get_payout",
  "http": "GET /payments/payout/{payoutId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "PolicyEditorBetaApi",
  "method": "get_active_policy",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/PolicyEditorBetaApi.md#get_active_policy",
  "http": "GET /tap/active_policy",
  "legacyName": "get_active_policy",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "PolicyEditorBetaApi",
  "method": "get_draft",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/PolicyEditorBetaApi.md#get_draft",
  "http": "GET /tap/draft",
  "legacyName": "get_draft",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "PolicyEditorBetaApi",
  "method": "publish_draft",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/PolicyEditorBetaApi.md#publish_draft",
  "http": "POST /tap/draft",
  "legacyName": "publish_draft",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "PolicyEditorBetaApi",
  "method": "publish_policy_rules",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/PolicyEditorBetaApi.md#publish_policy_rules",
  "http": "POST /tap/publish",
  "legacyName": "publish_policy_rules",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "PolicyEditorBetaApi",
  "method": "update_draft",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/PolicyEditorBetaApi.md#update_draft",
  "http": "PUT /tap/draft",
  "legacyName": "update_draft",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ResetDeviceApi",
  "method": "reset_device",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/ResetDeviceApi.md#reset_device",
  "http": "POST /management/users/\\{id}/reset_device",
  "legacyName": "reset_device_request",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "approve_dv_p_ticket_term",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#approve_dv_p_ticket_term",
  "http": "PUT /smart_transfers/{ticketId}/terms/{termId}/dvp/approve",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "SmartTransferApi",
  "method": "cancel_ticket",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#cancel_ticket",
  "http": "PUT /smart-transfers/{ticketId}/cancel",
  "legacyName": "cancel_smart_transfer_ticket",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "create_ticket",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#create_ticket",
  "http": "POST /smart-transfers",
  "legacyName": "create_smart_transfer_ticket",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "create_ticket_term",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#create_ticket_term",
  "http": "POST /smart-transfers/{ticketId}/terms",
  "legacyName": "create_smart_transfer_ticket_term",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "find_ticket_term_by_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#find_ticket_term_by_id",
  "http": "GET /smart-transfers/{ticketId}/terms/{termId}",
  "legacyName": "get_smart_transfer_ticket_term",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "fulfill_ticket",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#fulfill_ticket",
  "http": "PUT /smart-transfers/{ticketId}/fulfill",
  "legacyName": "fulfill_smart_transfer_ticket",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "fund_dvp_ticket",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#fund_dvp_ticket",
  "http": "PUT /smart_transfers/{ticketId}/dvp/fund",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "SmartTransferApi",
  "method": "fund_ticket_term",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#fund_ticket_term",
  "http": "PUT /smart-transfers/{ticketId}/terms/{termId}/fund",
  "legacyName": "fund_smart_transfer_ticket_term",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "get_smart_transfer_statistic",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#get_smart_transfer_statistic",
  "http": "GET /smart_transfers/statistic",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "SmartTransferApi",
  "method": "get_smart_transfer_user_groups",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#get_smart_transfer_user_groups",
  "http": "GET /smart-transfers/settings/user-groups",
  "legacyName": "get_smart_transfer_user_group_ids",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "manually_fund_ticket_term",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#manually_fund_ticket_term",
  "http": "PUT /smart-transfers/{ticketId}/terms/{termId}/manually-fund",
  "legacyName": "manually_fund_smart_transfer_ticket_term",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "remove_ticket_term",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#remove_ticket_term",
  "http": "DELETE /smart-transfers/{ticketId}/terms/{termId}",
  "legacyName": "delete_smart_transfer_ticket_term",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "search_tickets",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#search_tickets",
  "http": "GET /smart-transfers",
  "legacyName": "get_smart_transfer_tickets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "set_external_ref_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#set_external_ref_id",
  "http": "PUT /smart-transfers/{ticketId}/external-id",
  "legacyName": "set_smart_transfer_ticket_external_ref_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "set_ticket_expiration",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#set_ticket_expiration",
  "http": "PUT /smart-transfers/{ticketId}/expires-in",
  "legacyName": "set_smart_transfer_ticket_expires_in",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "set_user_groups",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#set_user_groups",
  "http": "POST /smart-transfers/settings/user-groups",
  "legacyName": "set_smart_transfer_user_group_ids",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "submit_ticket",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#submit_ticket",
  "http": "PUT /smart-transfers/{ticketId}/submit",
  "legacyName": "submit_smart_transfer_ticket",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "update_ticket_term",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/SmartTransferApi.md#update_ticket_term",
  "http": "PUT /smart-transfers/{ticketId}/terms/{termId}",
  "legacyName": "update_smart_transfer_ticket_term",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "approve_terms_of_service_by_provider_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#approve_terms_of_service_by_provider_id",
  "http": "POST /staking/providers/{providerId}/approveTermsOfService",
  "legacyName": "approve_staking_provider_terms_of_service",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "claim_rewards",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#claim_rewards",
  "http": "POST /staking/chains/{chainDescriptor}/claim_rewards",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "StakingApi",
  "method": "get_all_delegations",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#get_all_delegations",
  "http": "GET /staking/positions",
  "legacyName": "get_staking_positions",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "get_chain_info",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#get_chain_info",
  "http": "GET /staking/chains/{chainDescriptor}/chainInfo",
  "legacyName": "get_staking_chain_info",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "get_chains",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#get_chains",
  "http": "GET /staking/chains",
  "legacyName": "get_staking_chains",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "get_delegation_by_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#get_delegation_by_id",
  "http": "GET /staking/positions/\\{id}",
  "legacyName": "get_staking_position",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "get_providers",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#get_providers",
  "http": "GET /staking/providers",
  "legacyName": "get_staking_providers",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "get_summary",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#get_summary",
  "http": "GET /staking/positions/summary",
  "legacyName": "get_staking_positions_summary",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "get_summary_by_vault",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#get_summary_by_vault",
  "http": "GET /staking/positions/summary/vaults",
  "legacyName": "get_staking_positions_summary_by_vault",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "split",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#split",
  "http": "POST /staking/chains/{chainDescriptor}/split",
  "legacyName": "execute_staking_split",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "stake",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#stake",
  "http": "POST /staking/chains/{chainDescriptor}/stake",
  "legacyName": "execute_staking_stake",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "unstake",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#unstake",
  "http": "POST /staking/chains/{chainDescriptor}/unstake",
  "legacyName": "execute_staking_unstake",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "withdraw",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/StakingApi.md#withdraw",
  "http": "POST /staking/chains/{chainDescriptor}/withdraw",
  "legacyName": "execute_staking_withdraw",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "burn_collection_token",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TokenizationApi.md#burn_collection_token",
  "http": "POST /tokenization/collections/\\{id}/tokens/burn",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "TokenizationApi",
  "method": "create_new_collection",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TokenizationApi.md#create_new_collection",
  "http": "POST /tokenization/collections",
  "legacyName": "create_new_collection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "get_collection_by_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TokenizationApi.md#get_collection_by_id",
  "http": "GET /tokenization/collections/\\{id}",
  "legacyName": "get_linked_collection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "get_linked_collections",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TokenizationApi.md#get_linked_collections",
  "http": "GET /tokenization/collections",
  "legacyName": "get_linked_collections",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "get_linked_token",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TokenizationApi.md#get_linked_token",
  "http": "GET /tokenization/tokens/\\{id}",
  "legacyName": "get_linked_token",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "get_linked_tokens",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TokenizationApi.md#get_linked_tokens",
  "http": "GET /tokenization/tokens",
  "legacyName": "get_linked_tokens",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "issue_new_token",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TokenizationApi.md#issue_new_token",
  "http": "POST /tokenization/tokens",
  "legacyName": "issue_new_token",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "link",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TokenizationApi.md#link",
  "http": "POST /tokenization/tokens/link",
  "legacyName": "link_contract_by_address",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "mint_collection_token",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TokenizationApi.md#mint_collection_token",
  "http": "POST /tokenization/collections/\\{id}/tokens/mint",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "TokenizationApi",
  "method": "unlink",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TokenizationApi.md#unlink",
  "http": "DELETE /tokenization/tokens/\\{id}",
  "legacyName": "unlink_token",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "unlink_collection",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TokenizationApi.md#unlink_collection",
  "http": "DELETE /tokenization/collections/\\{id}",
  "legacyName": "unlinked_collection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "cancel_transaction",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#cancel_transaction",
  "http": "POST /transactions/{txId}/cancel",
  "legacyName": "cancel_transaction_by_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "create_transaction",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#create_transaction",
  "http": "POST /transactions",
  "legacyName": "undefined",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "drop_transaction",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#drop_transaction",
  "http": "POST /transactions/{txId}/drop",
  "legacyName": "drop_transaction",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "estimate_network_fee",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#estimate_network_fee",
  "http": "GET /estimate_network_fee",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "TransactionsApi",
  "method": "estimate_transaction_fee",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#estimate_transaction_fee",
  "http": "POST /transactions/estimate_fee",
  "legacyName": "estimate_fee_for_transaction",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "freeze_transaction",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#freeze_transaction",
  "http": "POST /transactions/{txId}/freeze",
  "legacyName": "freeze_transaction_by_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "get_transaction",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#get_transaction",
  "http": "GET /transactions/{txId}",
  "legacyName": "get_transaction_by_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "get_transaction_by_external_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#get_transaction_by_external_id",
  "http": "GET /transactions/external_tx_id/{externalTxId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "TransactionsApi",
  "method": "get_transactions",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#get_transactions",
  "http": "GET /transactions",
  "legacyName": "_get_transactions",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "set_confirmation_threshold_by_transaction_hash",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#set_confirmation_threshold_by_transaction_hash",
  "http": "POST /txHash/{txHash}/set_confirmation_threshold",
  "legacyName": "set_confirmation_threshold_for_txhash",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "set_transaction_confirmation_threshold",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#set_transaction_confirmation_threshold",
  "http": "POST /transactions/{txId}/set_confirmation_threshold",
  "legacyName": "set_confirmation_threshold_for_txid",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "unfreeze_transaction",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#unfreeze_transaction",
  "http": "POST /transactions/{txId}/unfreeze",
  "legacyName": "unfreeze_transaction_by_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "validate_address",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TransactionsApi.md#validate_address",
  "http": "GET /transactions/validate_address/{assetId}/{address}",
  "legacyName": "validate_address",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TravelRuleBetaApi",
  "method": "get_vasp_for_vault",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TravelRuleBetaApi.md#get_vasp_for_vault",
  "http": "GET /screening/travel_rule/vault/{vaultAccountId}/vasp",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "TravelRuleBetaApi",
  "method": "get_vaspby_did",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TravelRuleBetaApi.md#get_vaspby_did",
  "http": "GET /screening/travel_rule/vasp/{did}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "TravelRuleBetaApi",
  "method": "get_vasps",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TravelRuleBetaApi.md#get_vasps",
  "http": "GET /screening/travel_rule/vasp",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "TravelRuleBetaApi",
  "method": "set_vasp_for_vault",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TravelRuleBetaApi.md#set_vasp_for_vault",
  "http": "POST /screening/travel_rule/vault/{vaultAccountId}/vasp",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "TravelRuleBetaApi",
  "method": "update_vasp",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TravelRuleBetaApi.md#update_vasp",
  "http": "PUT /screening/travel_rule/vasp/update",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "TravelRuleBetaApi",
  "method": "validate_full_travel_rule_transaction",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TravelRuleBetaApi.md#validate_full_travel_rule_transaction",
  "http": "POST /screening/travel_rule/transaction/validate/full",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "TravelRuleBetaApi",
  "method": "validate_travel_rule_transaction",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/TravelRuleBetaApi.md#validate_travel_rule_transaction",
  "http": "POST /screening/travel_rule/transaction/validate",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "UserGroupsBetaApi",
  "method": "create_user_group",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/UserGroupsBetaApi.md#create_user_group",
  "http": "POST /management/user_groups",
  "legacyName": "create_user_group",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "UserGroupsBetaApi",
  "method": "delete_user_group",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/UserGroupsBetaApi.md#delete_user_group",
  "http": "DELETE /management/user_groups/{groupId}",
  "legacyName": "delete_user_group",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "UserGroupsBetaApi",
  "method": "get_user_group",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/UserGroupsBetaApi.md#get_user_group",
  "http": "GET /management/user_groups/{groupId}",
  "legacyName": "get_user_group",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "UserGroupsBetaApi",
  "method": "get_user_groups",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/UserGroupsBetaApi.md#get_user_groups",
  "http": "GET /management/user_groups",
  "legacyName": "get_user_groups",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "UserGroupsBetaApi",
  "method": "update_user_group",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/UserGroupsBetaApi.md#update_user_group",
  "http": "PUT /management/user_groups/{groupId}",
  "legacyName": "update_user_group",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "UsersApi",
  "method": "get_users",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/UsersApi.md#get_users",
  "http": "GET /users",
  "legacyName": "get_users",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "activate_asset_for_vault_account",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#activate_asset_for_vault_account",
  "http": "POST /vault/accounts/{vaultAccountId}/{assetId}/activate",
  "legacyName": "activate_vault_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "create_legacy_address",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#create_legacy_address",
  "http": "POST\n              /vault/accounts/{vaultAccountId}/{assetId}/addresses/{addressId}/create_legacy",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "VaultsApi",
  "method": "create_multiple_accounts",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#create_multiple_accounts",
  "http": "POST /vault/accounts/bulk",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "VaultsApi",
  "method": "create_vault_account",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#create_vault_account",
  "http": "POST /vault/accounts",
  "legacyName": "create_vault_account",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "create_vault_account_asset",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#create_vault_account_asset",
  "http": "POST /vault/accounts/{vaultAccountId}/{assetId}",
  "legacyName": "create_vault_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "create_vault_account_asset_address",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#create_vault_account_asset_address",
  "http": "POST /vault/accounts/{vaultAccountId}/{assetId}/addresses",
  "legacyName": "generate_new_address",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "get_asset_wallets",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#get_asset_wallets",
  "http": "GET /vault/asset_wallets",
  "legacyName": "get_asset_wallets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "get_max_spendable_amount",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#get_max_spendable_amount",
  "http": "GET /vault/accounts/{vaultAccountId}/{assetId}/max_spendable_amount",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "VaultsApi",
  "method": "get_paged_vault_accounts",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#get_paged_vault_accounts",
  "http": "GET /vault/accounts_paged",
  "legacyName": "get_vault_accounts_with_page_info",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "get_public_key_info",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#get_public_key_info",
  "http": "GET /vault/public_key_info",
  "legacyName": "get_public_key_info",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "get_public_key_info_for_address",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#get_public_key_info_for_address",
  "http": "GET\n              /vault/accounts/{vaultAccountId}/{assetId}/{change}/{addressIndex}/public_key_info",
  "legacyName": "get_public_key_info_for_vault_account",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "get_unspent_inputs",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#get_unspent_inputs",
  "http": "GET /vault/accounts/{vaultAccountId}/{assetId}/unspent_inputs",
  "legacyName": "get_unspent_inputs",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "get_vault_account_asset",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#get_vault_account_asset",
  "http": "GET /vault/accounts/{vaultAccountId}/{assetId}",
  "legacyName": "get_max_spendable_amount",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "get_vault_account_asset_addresses_paginated",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#get_vault_account_asset_addresses_paginated",
  "http": "GET /vault/accounts/{vaultAccountId}/{assetId}/addresses_paginated",
  "legacyName": "get_paginated_addresses",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "get_vault_assets",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#get_vault_assets",
  "http": "GET /vault/assets",
  "legacyName": "get_vault_balance_by_asset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "get_vault_balance_by_asset",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#get_vault_balance_by_asset",
  "http": "GET /vault/assets/{assetId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "VaultsApi",
  "method": "hide_vault_account",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#hide_vault_account",
  "http": "POST /vault/accounts/{vaultAccountId}/hide",
  "legacyName": "hide_vault_account",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "set_vault_account_customer_ref_id",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#set_vault_account_customer_ref_id",
  "http": "POST /vault/accounts/{vaultAccountId}/set_customer_ref_id",
  "legacyName": "set_vault_account_customer_ref_id_for_address",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "set_vault_account_auto_fuel",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#set_vault_account_auto_fuel",
  "http": "POST /vault/accounts/{vaultAccountId}/set_auto_fuel",
  "legacyName": "set_auto_fuel",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "unhide_vault_account",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#unhide_vault_account",
  "http": "POST /vault/accounts/{vaultAccountId}/unhide",
  "legacyName": "unhide_vault_account",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "update_vault_account_asset_address",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#update_vault_account_asset_address",
  "http": "PUT /vault/accounts/{vaultAccountId}/{assetId}/addresses/{addressId}",
  "legacyName": "update_vault_account",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "update_vault_account_asset_balance",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/VaultsApi.md#update_vault_account_asset_balance",
  "http": "POST /vault/accounts/{vaultAccountId}/{assetId}/balance",
  "legacyName": "refresh_vault_asset_balance",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "Web3ConnectionsApi",
  "method": "create",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/Web3ConnectionsApi.md#create",
  "http": "POST /connections/wc",
  "legacyName": "create_web3_connection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "Web3ConnectionsApi",
  "method": "get",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/Web3ConnectionsApi.md#get",
  "http": "GET /connections",
  "legacyName": "get_web3_connections",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "Web3ConnectionsApi",
  "method": "remove",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/Web3ConnectionsApi.md#remove",
  "http": "DELETE /connections/wc/\\{id}",
  "legacyName": "remove_web3_connection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "Web3ConnectionsApi",
  "method": "submit",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/Web3ConnectionsApi.md#submit",
  "http": "PUT /connections/wc/\\{id}",
  "legacyName": "submit_web3_connection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "WebhooksApi",
  "method": "resend_transaction_webhooks",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/WebhooksApi.md#resend_transaction_webhooks",
  "http": "POST /webhooks/resend/{txId}",
  "legacyName": "resend_transaction_webhooks_by_id",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "WebhooksApi",
  "method": "resend_webhooks",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/WebhooksApi.md#resend_webhooks",
  "http": "POST /webhooks/resend",
  "legacyName": "resend_webhooks",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "create_webhook",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/WebhooksV2BetaApi.md#create_webhook",
  "http": "POST /webhooks",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "delete_webhook",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/WebhooksV2BetaApi.md#delete_webhook",
  "http": "DELETE /webhooks/{webhookId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "get_webhook",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/WebhooksV2BetaApi.md#get_webhook",
  "http": "GET /webhooks/{webhookId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "get_notifications",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/WebhooksV2BetaApi.md#get_notifications",
  "http": "GET /webhooks/{webhookId}/notifications",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "get_webhooks",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/WebhooksV2BetaApi.md#get_webhooks",
  "http": "GET /webhooks",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "update_webhook",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/WebhooksV2BetaApi.md#update_webhook",
  "http": "PATCH /webhooks/{webhookId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WhitelistIpAddressesApi",
  "method": "get_whitelist_ip_addresses",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/WhitelistIpAddressesApi.md#get_whitelist_ip_addresses",
  "http": "GET /management/api_users/{userId}/whitelist_ip_addresses",
  "legacyName": "get_whitelisted_ip_addresses",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "WorkspaceStatusBetaApi",
  "method": "get_workspace_status",
  "methodUrl": "https://github.com/fireblocks/py-sdk/blob/master/docs/WorkspaceStatusBetaApi.md#get_workspace_status",
  "http": "GET /management/workspace_status",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /staking/chains/{chain_descriptor}/claimRewards",
  "legacyName": "execute_staking_claim_rewards",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /nfts/tokens/",
  "legacyName": "get_nft",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "PUT /nfts/tokens/",
  "legacyName": "refresh_nft_metadata",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "PUT /nfts/ownership/tokens/",
  "legacyName": "update_nft_ownership_status",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /assets/prices/$\\{id}",
  "legacyName": "set_asset_price",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /vault/accounts/{vault_account_id}/{asset_id}/addresses",
  "legacyName": "get_deposit_addresses",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /exchange_accounts",
  "legacyName": "get_exchange_accounts",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST\n              /exchange_accounts/{exchange_account_id}/{asset_id}/transfer_to_subaccount",
  "legacyName": "transfer_to_subaccount",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST\n              /exchange_accounts/{exchange_account_id}/{asset_id}/transfer_from_subaccount",
  "legacyName": "transfer_from_subaccount",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /estimate_network_fee?assetId={asset_id}",
  "legacyName": "get_fee_for_asset",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /transfer_tickets",
  "legacyName": "get_transfer_tickets",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /transfer_tickets",
  "legacyName": "create_transfer_ticket",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /transfer_tickets/{ticket_id}/{term_id}",
  "legacyName": "get_transfer_ticket_term",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /transfer_tickets/{ticket_id}/cancel",
  "legacyName": "cancel_transfer_ticket",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /transfer_tickets/{ticket_id}/{term_id}/transfer",
  "legacyName": "execute_ticket_term",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /vault/accounts/{vault_account_id}/{asset}/lock_allocation",
  "legacyName": "allocate_funds_to_private_ledger",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /vault/accounts/{vault_account_id}/{asset}/release_allocation",
  "legacyName": "deallocate_funds_from_private_ledger",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET\n              /vault/accounts/{vault_account_id}/{asset_id}/max_bip44_index_used",
  "legacyName": "get_max_bip44_index_used",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /off_exchange_accounts",
  "legacyName": "get_off_exchanges",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /audits",
  "legacyName": "get_audit_logs",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /off_exchange_accounts/{off_exchange_id}",
  "legacyName": "get_off_exchange_by_id",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /off_exchanges/{off_exchange_id}/settle",
  "legacyName": "settle_off_exchange_by_id",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /fee_payer/{base_asset}",
  "legacyName": "set_fee_payer_configuration",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /fee_payer/{base_asset}",
  "legacyName": "get_fee_payer_configuration",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "DELETE /fee_payer/{base_asset}",
  "legacyName": "remove_fee_payer_configuration",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /tokenization/tokens/count",
  "legacyName": "get_linked_tokens_count",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /tokenization/collections/tokens/mint",
  "legacyName": "mint_nft",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /tokenization/collections/tokens/burn",
  "legacyName": "burn_nft",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /tokenization/templates/{template_id}/supported_blockchains",
  "legacyName": "get_contract_template_supported_blockchains",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET\n              /contract_interactions/base_asset_id/{base_asset_id}/contract_address/{contract_address}",
  "legacyName": "get_contract_by_address",
  "newSdk": false,
  "legacySdk": true
}];

export const TS_SDK_ROWS = [{
  "cls": "ApiUserApi",
  "method": "createApiUser",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ApiUserApi.md#createApiUser",
  "http": "POST /management/api_users",
  "legacyName": "createApiUser",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ApiUserApi",
  "method": "getApiUsers",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ApiUserApi.md#getApiUsers",
  "http": "GET /management/api_users",
  "legacyName": "getApiUsers",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "AssetsApi",
  "method": "createAssetsBulk",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/AssetsApi.md#createAssetsBulk",
  "http": "POST /vault/assets/bulk",
  "legacyName": "createVaultAssetsBulk",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "AuditLogsApi",
  "method": "getAuditLogs",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/AuditLogsApi.md#getAuditLogs",
  "http": "GET /management/audit_logs",
  "legacyName": "getPaginatedAuditLogs",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsApi",
  "method": "getSupportedAssets",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/BlockchainsAssetsApi.md#getSupportedAssets",
  "http": "GET /supported_assets",
  "legacyName": "getSupportedAssets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsApi",
  "method": "registerNewAsset",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/BlockchainsAssetsApi.md#registerNewAsset",
  "http": "POST /assets",
  "legacyName": "registerNewAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsApi",
  "method": "setAssetPrice",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/BlockchainsAssetsApi.md#setAssetPrice",
  "http": "POST /assets/prices/\\{id}",
  "legacyName": "setAssetPrice",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsBetaApi",
  "method": "getAssetById",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/BlockchainsAssetsBetaApi.md#getAssetById",
  "http": "GET /assets/{assetId}",
  "legacyName": "getAssetById",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsBetaApi",
  "method": "getBlockchainById",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/BlockchainsAssetsBetaApi.md#getBlockchainById",
  "http": "GET /blockchains/{blockchainId}",
  "legacyName": "getBlockchainById",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsBetaApi",
  "method": "listAssets",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/BlockchainsAssetsBetaApi.md#listAssets",
  "http": "GET /assets",
  "legacyName": "listAssets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "BlockchainsAssetsBetaApi",
  "method": "listBlockchains",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/BlockchainsAssetsBetaApi.md#listBlockchains",
  "http": "GET /blockchains",
  "legacyName": "listBlockchains",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ComplianceApi",
  "method": "getAmlPostScreeningPolicy",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ComplianceApi.md#getAmlPostScreeningPolicy",
  "http": "GET /screening/aml/post_screening_policy",
  "legacyName": "getPOSTScreeningPolicy",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ComplianceApi",
  "method": "getAmlScreeningPolicy",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ComplianceApi.md#getAmlScreeningPolicy",
  "http": "GET /screening/aml/screening_policy",
  "legacyName": "getScreeningPolicy",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ComplianceApi",
  "method": "getPostScreeningPolicy",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ComplianceApi.md#getPostScreeningPolicy",
  "http": "GET /screening/travel_rule/post_screening_policy",
  "legacyName": "getPOSTScreeningPolicy",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ComplianceApi",
  "method": "getScreeningPolicy",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ComplianceApi.md#getScreeningPolicy",
  "http": "GET /screening/travel_rule/screening_policy",
  "legacyName": "getScreeningPolicy",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ComplianceApi",
  "method": "retryRejectedTransactionBypassScreeningChecks",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ComplianceApi.md#retryRejectedTransactionBypassScreeningChecks",
  "http": "POST /screening/transaction/{txId}/bypass_screening_policy",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ComplianceApi",
  "method": "updateAmlScreeningConfiguration",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ComplianceApi.md#updateAmlScreeningConfiguration",
  "http": "PUT /screening/aml/policy_configuration",
  "legacyName": "updatePolicyConfiguration",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ComplianceApi",
  "method": "updateScreeningConfiguration",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ComplianceApi.md#updateScreeningConfiguration",
  "http": "PUT /screening/configurations",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ComplianceApi",
  "method": "updateTravelRuleConfig",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ComplianceApi.md#updateTravelRuleConfig",
  "http": "PUT /screening/travel_rule/policy_configuration",
  "legacyName": "updatePolicyConfiguration",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ComplianceScreeningConfigurationApi",
  "method": "getAmlScreeningConfiguration",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ComplianceScreeningConfigurationApi.md#getAmlScreeningConfiguration",
  "http": "GET /screening/aml/policy_configuration",
  "legacyName": "getScreeningConfiguration",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ComplianceScreeningConfigurationApi",
  "method": "getScreeningConfiguration",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ComplianceScreeningConfigurationApi.md#getScreeningConfiguration",
  "http": "GET /screening/travel_rule/policy_configuration",
  "legacyName": "getScreeningConfiguration",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ConsoleUserApi",
  "method": "createConsoleUser",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ConsoleUserApi.md#createConsoleUser",
  "http": "POST /management/users",
  "legacyName": "createConsoleUser",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ConsoleUserApi",
  "method": "getConsoleUsers",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ConsoleUserApi.md#getConsoleUsers",
  "http": "GET /management/users",
  "legacyName": "getConsoleUsers",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractInteractionsApi",
  "method": "getDeployedContractAbi",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractInteractionsApi.md#getDeployedContractAbi",
  "http": "GET\n              /contract_interactions/base_asset_id/{baseAssetId}/contract_address/{contractAddress}/functions",
  "legacyName": "getContractAbi",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractInteractionsApi",
  "method": "getTransactionReceipt",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractInteractionsApi.md#getTransactionReceipt",
  "http": "GET\n              /contract_interactions/base_asset_id/{baseAssetId}/tx_hash/{txHash}/receipt",
  "legacyName": "getTransactionReceipt",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractInteractionsApi",
  "method": "readCallFunction",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractInteractionsApi.md#readCallFunction",
  "http": "POST\n              /contract_interactions/base_asset_id/{baseAssetId}/contract_address/{contractAddress}/functions/read",
  "legacyName": "readContractCallFunction",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractInteractionsApi",
  "method": "writeCallFunction",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractInteractionsApi.md#writeCallFunction",
  "http": "POST\n              /contract_interactions/base_asset_id/{baseAssetId}/contract_address/{contractAddress}/functions/write",
  "legacyName": "writeContractCallFunction",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractTemplatesApi",
  "method": "deleteContractTemplateById",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractTemplatesApi.md#deleteContractTemplateById",
  "http": "DELETE /tokenization/templates/{contractTemplateId}",
  "legacyName": "deleteContractTemplate",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractTemplatesApi",
  "method": "deployContract",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractTemplatesApi.md#deployContract",
  "http": "POST /tokenization/templates/{contractTemplateId}/deploy",
  "legacyName": "deployContract",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractTemplatesApi",
  "method": "getConstructorByContractTemplateId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractTemplatesApi.md#getConstructorByContractTemplateId",
  "http": "GET /tokenization/templates/{contractTemplateId}/constructor",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ContractTemplatesApi",
  "method": "getContractTemplateById",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractTemplatesApi.md#getContractTemplateById",
  "http": "GET /tokenization/templates/{contractTemplateId}",
  "legacyName": "getContractTemplate",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractTemplatesApi",
  "method": "getContractTemplates",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractTemplatesApi.md#getContractTemplates",
  "http": "GET /tokenization/templates",
  "legacyName": "getContractTemplates",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractTemplatesApi",
  "method": "getFunctionAbiByContractTemplateId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractTemplatesApi.md#getFunctionAbiByContractTemplateId",
  "http": "GET /tokenization/templates/{contractTemplateId}/function",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ContractTemplatesApi",
  "method": "uploadContractTemplate",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractTemplatesApi.md#uploadContractTemplate",
  "http": "POST /tokenization/templates",
  "legacyName": "uploadContractTemplate",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractsApi",
  "method": "addContractAsset",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractsApi.md#addContractAsset",
  "http": "POST /contracts/{contractId}/{assetId}",
  "legacyName": "createContractWalletAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractsApi",
  "method": "createContract",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractsApi.md#createContract",
  "http": "POST /contracts",
  "legacyName": "createContractWallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractsApi",
  "method": "deleteContract",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractsApi.md#deleteContract",
  "http": "DELETE /contracts/{contractId}",
  "legacyName": "deleteContractWallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractsApi",
  "method": "deleteContractAsset",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractsApi.md#deleteContractAsset",
  "http": "DELETE /contracts/{contractId}/{assetId}",
  "legacyName": "deleteContractWalletAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractsApi",
  "method": "getContract",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractsApi.md#getContract",
  "http": "GET /contracts/{contractId}",
  "legacyName": "getContractWallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractsApi",
  "method": "getContractAsset",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractsApi.md#getContractAsset",
  "http": "GET /contracts/{contractId}/{assetId}",
  "legacyName": "getContractWalletAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ContractsApi",
  "method": "getContracts",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ContractsApi.md#getContracts",
  "http": "GET /contracts",
  "legacyName": "getContractWallets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "CosignersBetaApi",
  "method": "addCosigner",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/CosignersBetaApi.md#addCosigner",
  "http": "POST /cosigners",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "getApiKey",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/CosignersBetaApi.md#getApiKey",
  "http": "GET /cosigners/{cosignerId}/api_keys/{apiKeyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "getApiKeys",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/CosignersBetaApi.md#getApiKeys",
  "http": "GET /cosigners/{cosignerId}/api_keys",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "getCosigner",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/CosignersBetaApi.md#getCosigner",
  "http": "GET /cosigners/{cosignerId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "getCosigners",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/CosignersBetaApi.md#getCosigners",
  "http": "GET /cosigners",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "getRequestStatus",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/CosignersBetaApi.md#getRequestStatus",
  "http": "GET /cosigners/{cosignerId}/api_keys/{apiKeyId}/{requestId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "pairApiKey",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/CosignersBetaApi.md#pairApiKey",
  "http": "PUT /cosigners/{cosignerId}/api_keys/{apiKeyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "renameCosigner",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/CosignersBetaApi.md#renameCosigner",
  "http": "PATCH /cosigners/{cosignerId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "unpairApiKey",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/CosignersBetaApi.md#unpairApiKey",
  "http": "DELETE /cosigners/{cosignerId}/api_keys/{apiKeyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "CosignersBetaApi",
  "method": "updateCallbackHandler",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/CosignersBetaApi.md#updateCallbackHandler",
  "http": "PATCH /cosigners/{cosignerId}/api_keys/{apiKeyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "DeployedContractsApi",
  "method": "addContractABI",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/DeployedContractsApi.md#addContractABI",
  "http": "POST /tokenization/contracts/abi",
  "legacyName": "saveABI",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "DeployedContractsApi",
  "method": "fetchContractAbi",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/DeployedContractsApi.md#fetchContractAbi",
  "http": "POST /tokenization/contracts/fetch_abi",
  "legacyName": "fetchOrScrapeABI",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "DeployedContractsApi",
  "method": "getDeployedContractByAddress",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/DeployedContractsApi.md#getDeployedContractByAddress",
  "http": "GET /tokenization/contracts/{assetId}/{contractAddress}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "DeployedContractsApi",
  "method": "getDeployedContractById",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/DeployedContractsApi.md#getDeployedContractById",
  "http": "GET /tokenization/contracts/\\{id}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "DeployedContractsApi",
  "method": "getDeployedContracts",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/DeployedContractsApi.md#getDeployedContracts",
  "http": "GET /tokenization/contracts",
  "legacyName": "getContractsByFilter",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "EmbeddedWalletsApi",
  "method": "getPublicKeyInfoForAddressNcw",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/EmbeddedWalletsApi.md#getPublicKeyInfoForAddressNcw",
  "http": "GET\n              /ncw/{walletId}/accounts/{accountId}/{assetId}/{change}/{addressIndex}/public_key_info",
  "legacyName": "getPublicKeyInfoByAccountAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "EmbeddedWalletsApi",
  "method": "getPublicKeyInfoNcw",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/EmbeddedWalletsApi.md#getPublicKeyInfoNcw",
  "http": "GET /ncw/{walletId}/public_key_info",
  "legacyName": "getPublicKeyInfo",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExchangeAccountsApi",
  "method": "convertAssets",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExchangeAccountsApi.md#convertAssets",
  "http": "POST /exchange_accounts/{exchangeAccountId}/convert",
  "legacyName": "convertExchangeAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExchangeAccountsApi",
  "method": "getExchangeAccount",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExchangeAccountsApi.md#getExchangeAccount",
  "http": "GET /exchange_accounts/{exchangeAccountId}",
  "legacyName": "getExchangeAccountById",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExchangeAccountsApi",
  "method": "getExchangeAccountAsset",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExchangeAccountsApi.md#getExchangeAccountAsset",
  "http": "GET /exchange_accounts/{exchangeAccountId}/{assetId}",
  "legacyName": "getExchangeAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExchangeAccountsApi",
  "method": "getPagedExchangeAccounts",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExchangeAccountsApi.md#getPagedExchangeAccounts",
  "http": "GET /exchange_accounts/paged",
  "legacyName": "getExchangeAccountsPaged",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExchangeAccountsApi",
  "method": "internalTransfer",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExchangeAccountsApi.md#internalTransfer",
  "http": "POST /exchange_accounts/{exchangeAccountId}/internal_transfer",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "ExternalWalletsApi",
  "method": "addAssetToExternalWallet",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExternalWalletsApi.md#addAssetToExternalWallet",
  "http": "POST /external_wallets/{walletId}/{assetId}",
  "legacyName": "createExternalWalletAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExternalWalletsApi",
  "method": "createExternalWallet",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExternalWalletsApi.md#createExternalWallet",
  "http": "POST /external_wallets",
  "legacyName": "createExternalWallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExternalWalletsApi",
  "method": "deleteExternalWallet",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExternalWalletsApi.md#deleteExternalWallet",
  "http": "DELETE /external_wallets/{walletId}",
  "legacyName": "deleteExternalWallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExternalWalletsApi",
  "method": "getExternalWallet",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExternalWalletsApi.md#getExternalWallet",
  "http": "GET /external_wallets/{walletId}",
  "legacyName": "getExternalWallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExternalWalletsApi",
  "method": "getExternalWalletAsset",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExternalWalletsApi.md#getExternalWalletAsset",
  "http": "GET /external_wallets/{walletId}/{assetId}",
  "legacyName": "getExternalWalletAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExternalWalletsApi",
  "method": "getExternalWallets",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExternalWalletsApi.md#getExternalWallets",
  "http": "GET /external_wallets",
  "legacyName": "getExternalWallets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExternalWalletsApi",
  "method": "removeAssetFromExternalWallet",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExternalWalletsApi.md#removeAssetFromExternalWallet",
  "http": "DELETE /external_wallets/{walletId}/{assetId}",
  "legacyName": "deleteExternalWalletAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ExternalWalletsApi",
  "method": "setExternalWalletCustomerRefId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ExternalWalletsApi.md#setExternalWalletCustomerRefId",
  "http": "POST /external_wallets/{walletId}/set_customer_ref_id",
  "legacyName": "setCustomerRefIdForExternalWallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "FiatAccountsApi",
  "method": "depositFundsFromLinkedDDA",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/FiatAccountsApi.md#depositFundsFromLinkedDDA",
  "http": "POST /fiat_accounts/{accountId}/deposit_from_linked_dda",
  "legacyName": "depositFromLinkedDDA",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "FiatAccountsApi",
  "method": "getFiatAccount",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/FiatAccountsApi.md#getFiatAccount",
  "http": "GET /fiat_accounts/{accountId}",
  "legacyName": "getFiatAccountById",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "FiatAccountsApi",
  "method": "getFiatAccounts",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/FiatAccountsApi.md#getFiatAccounts",
  "http": "GET /fiat_accounts",
  "legacyName": "getFiatAccounts",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "FiatAccountsApi",
  "method": "redeemFundsToLinkedDDA",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/FiatAccountsApi.md#redeemFundsToLinkedDDA",
  "http": "POST /fiat_accounts/{accountId}/redeem_to_linked_dda",
  "legacyName": "redeemToLinkedDDA",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "GasStationsApi",
  "method": "getGasStationByAssetId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/GasStationsApi.md#getGasStationByAssetId",
  "http": "GET /gas_station/{assetId}",
  "legacyName": "getGasStationInfo",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "GasStationsApi",
  "method": "getGasStationInfo",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/GasStationsApi.md#getGasStationInfo",
  "http": "GET /gas_station",
  "legacyName": "getGasStationInfo",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "GasStationsApi",
  "method": "updateGasStationConfiguration",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/GasStationsApi.md#updateGasStationConfiguration",
  "http": "PUT /gas_station/configuration",
  "legacyName": "setGasStationConfiguration",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "GasStationsApi",
  "method": "updateGasStationConfigurationByAssetId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/GasStationsApi.md#updateGasStationConfigurationByAssetId",
  "http": "PUT /gas_station/configuration/{assetId}",
  "legacyName": "setGasStationConfiguration",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "createInternalWallet",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/InternalWalletsApi.md#createInternalWallet",
  "http": "POST /internal_wallets",
  "legacyName": "createInternalWallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "createInternalWalletAsset",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/InternalWalletsApi.md#createInternalWalletAsset",
  "http": "POST /internal_wallets/{walletId}/{assetId}",
  "legacyName": "createInternalWalletAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "deleteInternalWallet",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/InternalWalletsApi.md#deleteInternalWallet",
  "http": "DELETE /internal_wallets/{walletId}",
  "legacyName": "deleteInternalWallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "deleteInternalWalletAsset",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/InternalWalletsApi.md#deleteInternalWalletAsset",
  "http": "DELETE /internal_wallets/{walletId}/{assetId}",
  "legacyName": "deleteInternalWalletAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "getInternalWallet",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/InternalWalletsApi.md#getInternalWallet",
  "http": "GET /internal_wallets/{walletId}",
  "legacyName": "getInternalWallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "getInternalWalletAsset",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/InternalWalletsApi.md#getInternalWalletAsset",
  "http": "GET /internal_wallets/{walletId}/{assetId}",
  "legacyName": "getInternalWalletAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "getInternalWallets",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/InternalWalletsApi.md#getInternalWallets",
  "http": "GET /internal_wallets",
  "legacyName": "getInternalWallets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "InternalWalletsApi",
  "method": "setCustomerRefIdForInternalWallet",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/InternalWalletsApi.md#setCustomerRefIdForInternalWallet",
  "http": "POST /internal_wallets/{walletId}/set_customer_ref_id",
  "legacyName": "setCustomerRefIdForInternalWallet",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "JobManagementApi",
  "method": "cancelJob",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/JobManagementApi.md#cancelJob",
  "http": "POST /batch/{jobId}/cancel",
  "legacyName": "cancelJob",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "JobManagementApi",
  "method": "continueJob",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/JobManagementApi.md#continueJob",
  "http": "POST /batch/{jobId}/continue",
  "legacyName": "continueJob",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "JobManagementApi",
  "method": "getJob",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/JobManagementApi.md#getJob",
  "http": "GET /batch/{jobId}",
  "legacyName": "getJobById",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "JobManagementApi",
  "method": "getJobTasks",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/JobManagementApi.md#getJobTasks",
  "http": "GET /batch/{jobId}/tasks",
  "legacyName": "getTasksByJobId",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "JobManagementApi",
  "method": "getJobs",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/JobManagementApi.md#getJobs",
  "http": "GET /batch/jobs",
  "legacyName": "getJobsForTenant",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "JobManagementApi",
  "method": "pauseJob",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/JobManagementApi.md#pauseJob",
  "http": "POST /batch/{jobId}/pause",
  "legacyName": "pauseJob",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "KeyLinkBetaApi",
  "method": "createSigningKey",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/KeyLinkBetaApi.md#createSigningKey",
  "http": "POST /key_link/signing_keys",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "createValidationKey",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/KeyLinkBetaApi.md#createValidationKey",
  "http": "POST /key_link/validation_keys",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "disableValidationKey",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/KeyLinkBetaApi.md#disableValidationKey",
  "http": "PATCH /key_link/validation_keys/{keyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "getSigningKey",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/KeyLinkBetaApi.md#getSigningKey",
  "http": "GET /key_link/signing_keys/{keyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "getSigningKeysList",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/KeyLinkBetaApi.md#getSigningKeysList",
  "http": "GET /key_link/signing_keys",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "getValidationKey",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/KeyLinkBetaApi.md#getValidationKey",
  "http": "GET /key_link/validation_keys/{keyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "getValidationKeysList",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/KeyLinkBetaApi.md#getValidationKeysList",
  "http": "GET /key_link/validation_keys",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "setAgentId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/KeyLinkBetaApi.md#setAgentId",
  "http": "PATCH /key_link/signing_keys/{keyId}/agent_user_id",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeyLinkBetaApi",
  "method": "updateSigningKey",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/KeyLinkBetaApi.md#updateSigningKey",
  "http": "PATCH /key_link/signing_keys/{keyId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeysBetaApi",
  "method": "getMpcKeysList",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/KeysBetaApi.md#getMpcKeysList",
  "http": "GET /keys/mpc/list",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "KeysBetaApi",
  "method": "getMpcKeysListByUser",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/KeysBetaApi.md#getMpcKeysListByUser",
  "http": "GET /keys/mpc/list/{userId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "NFTsApi",
  "method": "getNFT",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NFTsApi.md#getNFT",
  "http": "GET /nfts/tokens/\\{id}",
  "legacyName": "getNFT",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "getNFTs",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NFTsApi.md#getNFTs",
  "http": "GET /nfts/tokens",
  "legacyName": "getNFTs",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "getOwnershipTokens",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NFTsApi.md#getOwnershipTokens",
  "http": "GET /nfts/ownership/tokens",
  "legacyName": "getOwnedNFTs",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "listOwnedCollections",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NFTsApi.md#listOwnedCollections",
  "http": "GET /nfts/ownership/collections",
  "legacyName": "listOwnedCollections",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "listOwnedTokens",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NFTsApi.md#listOwnedTokens",
  "http": "GET /nfts/ownership/assets",
  "legacyName": "listOwnedAssets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "refreshNFTMetadata",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NFTsApi.md#refreshNFTMetadata",
  "http": "PUT /nfts/tokens/\\{id}",
  "legacyName": "refreshNFTMetadata",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "updateOwnershipTokens",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NFTsApi.md#updateOwnershipTokens",
  "http": "PUT /nfts/ownership/tokens",
  "legacyName": "refreshNFTOwnershipByVault",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "updateTokenOwnershipStatus",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NFTsApi.md#updateTokenOwnershipStatus",
  "http": "PUT /nfts/ownership/tokens/\\{id}/status",
  "legacyName": "updateNFTOwnershipStatus",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "updateTokensOwnershipSpam",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NFTsApi.md#updateTokensOwnershipSpam",
  "http": "PUT /nfts/ownership/tokens/spam",
  "legacyName": "updateNFTTokenOwnershipSpamStatus",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NFTsApi",
  "method": "updateTokensOwnershipStatus",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NFTsApi.md#updateTokensOwnershipStatus",
  "http": "PUT /nfts/ownership/tokens/status",
  "legacyName": "updateNFTOwnershipsStatus",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "checkThirdPartyRouting",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#checkThirdPartyRouting",
  "http": "GET\n              /network_connections/{connectionId}/is_third_party_routing/{assetType}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "NetworkConnectionsApi",
  "method": "createNetworkConnection",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#createNetworkConnection",
  "http": "POST /network_connections",
  "legacyName": "createNetworkConnection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "createNetworkId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#createNetworkId",
  "http": "POST /network_ids",
  "legacyName": "createNetworkId",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "deleteNetworkConnection",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#deleteNetworkConnection",
  "http": "DELETE /network_connections/{connectionId}",
  "legacyName": "removeNetworkConnection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "deleteNetworkId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#deleteNetworkId",
  "http": "DELETE /network_ids/{networkId}",
  "legacyName": "deleteNetworkId",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "getNetwork",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#getNetwork",
  "http": "GET /network_connections/{connectionId}",
  "legacyName": "getNetworkConnectionById",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "getNetworkConnections",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#getNetworkConnections",
  "http": "GET /network_connections",
  "legacyName": "getNetworkConnections",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "getNetworkId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#getNetworkId",
  "http": "GET /network_ids/{networkId}",
  "legacyName": "getNetworkId",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "getNetworkIds",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#getNetworkIds",
  "http": "GET /network_ids",
  "legacyName": "getDiscoverableNetworkIds",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "getRoutingPolicyAssetGroups",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#getRoutingPolicyAssetGroups",
  "http": "GET /network_ids/routing_policy_asset_groups",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "NetworkConnectionsApi",
  "method": "searchNetworkIds",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#searchNetworkIds",
  "http": "GET /network_ids/search",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "NetworkConnectionsApi",
  "method": "setNetworkIdDiscoverability",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#setNetworkIdDiscoverability",
  "http": "PATCH /network_ids/{networkId}/set_discoverability",
  "legacyName": "setNetworkIdDiscoverability",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "setNetworkIdName",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#setNetworkIdName",
  "http": "PATCH /network_ids/{networkId}/set_name",
  "legacyName": "setNetworkIdName",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "setNetworkIdRoutingPolicy",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#setNetworkIdRoutingPolicy",
  "http": "PATCH /network_ids/{networkId}/set_routing_policy",
  "legacyName": "setNetworkIdRoutingPolicy",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "NetworkConnectionsApi",
  "method": "setRoutingPolicy",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/NetworkConnectionsApi.md#setRoutingPolicy",
  "http": "PATCH /network_connections/{connectionId}/set_routing_policy",
  "legacyName": "setNetworkConnectionRoutingPolicy",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "OTABetaApi",
  "method": "getOtaStatus",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/OTABetaApi.md#getOtaStatus",
  "http": "GET /management/ota",
  "legacyName": "getOtaConfiguration",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "OTABetaApi",
  "method": "setOtaStatus",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/OTABetaApi.md#setOtaStatus",
  "http": "PUT /management/ota",
  "legacyName": "updateOtaConfiguration",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "OffExchangesApi",
  "method": "addOffExchange",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/OffExchangesApi.md#addOffExchange",
  "http": "POST /off_exchange/add",
  "legacyName": "addCollateral",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "OffExchangesApi",
  "method": "getOffExchangeCollateralAccounts",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/OffExchangesApi.md#getOffExchangeCollateralAccounts",
  "http": "GET /off_exchange/collateral_accounts/{mainExchangeAccountId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "OffExchangesApi",
  "method": "getOffExchangeSettlementTransactions",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/OffExchangesApi.md#getOffExchangeSettlementTransactions",
  "http": "GET /off_exchange/settlements/transactions",
  "legacyName": "getSettlementTransactions",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "OffExchangesApi",
  "method": "removeOffExchange",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/OffExchangesApi.md#removeOffExchange",
  "http": "POST /off_exchange/remove",
  "legacyName": "removeCollateral",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "OffExchangesApi",
  "method": "settleOffExchangeTrades",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/OffExchangesApi.md#settleOffExchangeTrades",
  "http": "POST /off_exchange/settlements/trader",
  "legacyName": "settlement",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "PaymentsPayoutApi",
  "method": "createPayout",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/PaymentsPayoutApi.md#createPayout",
  "http": "POST /payments/payout",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "PaymentsPayoutApi",
  "method": "executePayoutAction",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/PaymentsPayoutApi.md#executePayoutAction",
  "http": "POST /payments/payout/{payoutId}/actions/execute",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "PaymentsPayoutApi",
  "method": "getPayout",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/PaymentsPayoutApi.md#getPayout",
  "http": "GET /payments/payout/{payoutId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "PolicyEditorBetaApi",
  "method": "getActivePolicy",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/PolicyEditorBetaApi.md#getActivePolicy",
  "http": "GET /tap/active_policy",
  "legacyName": "getActivePolicy",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "PolicyEditorBetaApi",
  "method": "getDraft",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/PolicyEditorBetaApi.md#getDraft",
  "http": "GET /tap/draft",
  "legacyName": "getDraft",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "PolicyEditorBetaApi",
  "method": "publishDraft",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/PolicyEditorBetaApi.md#publishDraft",
  "http": "POST /tap/draft",
  "legacyName": "publishDraft",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "PolicyEditorBetaApi",
  "method": "publishPolicyRules",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/PolicyEditorBetaApi.md#publishPolicyRules",
  "http": "POST /tap/publish",
  "legacyName": "publishPolicyRules",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "PolicyEditorBetaApi",
  "method": "updateDraft",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/PolicyEditorBetaApi.md#updateDraft",
  "http": "PUT /tap/draft",
  "legacyName": "updateDraft",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "ResetDeviceApi",
  "method": "resetDevice",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/ResetDeviceApi.md#resetDevice",
  "http": "POST /management/users/\\{id}/reset_device",
  "legacyName": "resetDeviceRequest",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "approveDvPTicketTerm",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#approveDvPTicketTerm",
  "http": "PUT /smart_transfers/{ticketId}/terms/{termId}/dvp/approve",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "SmartTransferApi",
  "method": "cancelTicket",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#cancelTicket",
  "http": "PUT /smart-transfers/{ticketId}/cancel",
  "legacyName": "cancelSmartTransferTicket",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "createTicket",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#createTicket",
  "http": "POST /smart-transfers",
  "legacyName": "createSmartTransferTicket",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "createTicketTerm",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#createTicketTerm",
  "http": "POST /smart-transfers/{ticketId}/terms",
  "legacyName": "createSmartTransferTicketTerm",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "findTicketById",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#findTicketById",
  "http": "GET /smart-transfers/{ticketId}",
  "legacyName": "getSmartTransferTicket",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "findTicketTermById",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#findTicketTermById",
  "http": "GET /smart-transfers/{ticketId}/terms/{termId}",
  "legacyName": "getSmartTransferTicketTerms",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "fulfillTicket",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#fulfillTicket",
  "http": "PUT /smart-transfers/{ticketId}/fulfill",
  "legacyName": "fulfillSmartTransferTicket",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "fundDvpTicket",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#fundDvpTicket",
  "http": "PUT /smart_transfers/{ticketId}/dvp/fund",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "SmartTransferApi",
  "method": "fundTicketTerm",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#fundTicketTerm",
  "http": "PUT /smart-transfers/{ticketId}/terms/{termId}/fund",
  "legacyName": "fundSmartTransferTicketTerm",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "getSmartTransferStatistic",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#getSmartTransferStatistic",
  "http": "GET /smart_transfers/statistic",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "SmartTransferApi",
  "method": "getSmartTransferUserGroups",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#getSmartTransferUserGroups",
  "http": "GET /smart-transfers/settings/user-groups",
  "legacyName": "getSmartTransferTicketUserGroups",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "manuallyFundTicketTerm",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#manuallyFundTicketTerm",
  "http": "PUT /smart-transfers/{ticketId}/terms/{termId}/manually-fund",
  "legacyName": "manuallyFundSmartTransferTicketTerms",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "removeTicketTerm",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#removeTicketTerm",
  "http": "DELETE /smart-transfers/{ticketId}/terms/{termId}",
  "legacyName": "deleteSmartTransferTicketTerms",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "searchTickets",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#searchTickets",
  "http": "GET /smart-transfers",
  "legacyName": "getSmartTransferTickets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "setExternalRefId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#setExternalRefId",
  "http": "PUT /smart-transfers/{ticketId}/external-id",
  "legacyName": "setSmartTransferTicketExternalId",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "setTicketExpiration",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#setTicketExpiration",
  "http": "PUT /smart-transfers/{ticketId}/expires-in",
  "legacyName": "setSmartTransferTicketExpiresIn",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "setUserGroups",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#setUserGroups",
  "http": "POST /smart-transfers/settings/user-groups",
  "legacyName": "setSmartTransferTicketUserGroups",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "submitTicket",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#submitTicket",
  "http": "PUT /smart-transfers/{ticketId}/submit",
  "legacyName": "submitSmartTransferTicket",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "SmartTransferApi",
  "method": "updateTicketTerm",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/SmartTransferApi.md#updateTicketTerm",
  "http": "PUT /smart-transfers/{ticketId}/terms/{termId}",
  "legacyName": "updateSmartTransferTicketTerms",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "approveTermsOfServiceByProviderId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#approveTermsOfServiceByProviderId",
  "http": "POST /staking/providers/{providerId}/approveTermsOfService",
  "legacyName": "approveStakingProviderTermsOfService",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "claimRewards",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#claimRewards",
  "http": "POST /staking/chains/{chainDescriptor}/claim_rewards",
  "legacyName": "executeStakingClaimRewards",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "StakingApi",
  "method": "getAllDelegations",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#getAllDelegations",
  "http": "GET /staking/positions",
  "legacyName": "getStakingPositions",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "getChainInfo",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#getChainInfo",
  "http": "GET /staking/chains/{chainDescriptor}/chainInfo",
  "legacyName": "getStakingChainInfo",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "getChains",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#getChains",
  "http": "GET /staking/chains",
  "legacyName": "getStakingChains",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "getDelegationById",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#getDelegationById",
  "http": "GET /staking/positions/{positionId}",
  "legacyName": "getStakingPosition",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "getProviders",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#getProviders",
  "http": "GET /staking/providers",
  "legacyName": "getStakingProviders",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "getSummary",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#getSummary",
  "http": "GET /staking/positions/summary",
  "legacyName": "getStakingPositionsSummary",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "getSummaryByVault",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#getSummaryByVault",
  "http": "GET /staking/positions/summary/vaults",
  "legacyName": "getStakingPositionsSummaryByVault",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "split",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#split",
  "http": "POST /staking/chains/{chainDescriptor}/split",
  "legacyName": "executeStakingSplit",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "stake",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#stake",
  "http": "POST /staking/chains/{chainDescriptor}/stake",
  "legacyName": "executeStakingStake",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "unstake",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#unstake",
  "http": "POST /staking/chains/{chainDescriptor}/unstake",
  "legacyName": "executeStakingUnstake",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "StakingApi",
  "method": "withdraw",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/StakingApi.md#withdraw",
  "http": "POST /staking/chains/{chainDescriptor}/withdraw",
  "legacyName": "executeStakingWithdraw",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "burnCollectionToken",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TokenizationApi.md#burnCollectionToken",
  "http": "POST /tokenization/collections/{collectionId}/tokens/burn",
  "legacyName": "burnNFT",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "createNewCollection",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TokenizationApi.md#createNewCollection",
  "http": "POST /tokenization/collections",
  "legacyName": "createNewCollection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "fetchCollectionTokenDetails",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TokenizationApi.md#fetchCollectionTokenDetails",
  "http": "GET /tokenization/collections/{collectionId}/tokens/{tokenId}",
  "legacyName": "getLinkedCollectionTokenDetails",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "getCollectionById",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TokenizationApi.md#getCollectionById",
  "http": "GET /tokenization/collections/\\{id}",
  "legacyName": "getLinkedCollection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "getLinkedCollections",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TokenizationApi.md#getLinkedCollections",
  "http": "GET /tokenization/collections",
  "legacyName": "getLinkedCollections",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "getLinkedToken",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TokenizationApi.md#getLinkedToken",
  "http": "GET /tokenization/tokens/\\{id}",
  "legacyName": "getLinkedToken",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "getLinkedTokens",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TokenizationApi.md#getLinkedTokens",
  "http": "GET /tokenization/tokens",
  "legacyName": "getLinkedTokens",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "issueNewToken",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TokenizationApi.md#issueNewToken",
  "http": "POST /tokenization/tokens",
  "legacyName": "issueNewToken",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "link",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TokenizationApi.md#link",
  "http": "POST /tokenization/tokens/link",
  "legacyName": "linkToken",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "mintCollectionToken",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TokenizationApi.md#mintCollectionToken",
  "http": "POST /tokenization/collections/{collectionId}/tokens/mint",
  "legacyName": "mintNFT",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "unlink",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TokenizationApi.md#unlink",
  "http": "DELETE /tokenization/tokens/\\{id}",
  "legacyName": "unlinkToken",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TokenizationApi",
  "method": "unlinkCollection",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TokenizationApi.md#unlinkCollection",
  "http": "DELETE /tokenization/collections/\\{id}",
  "legacyName": "unlinkCollection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "cancelTransaction",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#cancelTransaction",
  "http": "POST /transactions/{txId}/cancel",
  "legacyName": "cancelTransactionById",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "createTransaction",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#createTransaction",
  "http": "POST /transactions",
  "legacyName": "createTransaction",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "dropTransaction",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#dropTransaction",
  "http": "POST /transactions/{txId}/drop",
  "legacyName": "dropTransaction",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "estimateNetworkFee",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#estimateNetworkFee",
  "http": "GET /estimate_network_fee",
  "legacyName": "getFeeForAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "estimateTransactionFee",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#estimateTransactionFee",
  "http": "POST /transactions/estimate_fee",
  "legacyName": "estimateFeeForTransaction",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "freezeTransaction",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#freezeTransaction",
  "http": "POST /transactions/{txId}/freeze",
  "legacyName": "freezeTransactionById",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "getTransaction",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#getTransaction",
  "http": "GET /transactions/{txId}",
  "legacyName": "getTransactionById",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "getTransactionByExternalId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#getTransactionByExternalId",
  "http": "GET /transactions/external_tx_id/{externalTxId}",
  "legacyName": "getTransactionByExternalTxId",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "getTransactions",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#getTransactions",
  "http": "GET /transactions",
  "legacyName": "getTransactions",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "setConfirmationThresholdByTransactionHash",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#setConfirmationThresholdByTransactionHash",
  "http": "POST /txHash/{txHash}/set_confirmation_threshold",
  "legacyName": "setConfirmationThresholdForTxHash",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "setTransactionConfirmationThreshold",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#setTransactionConfirmationThreshold",
  "http": "POST /transactions/{txId}/set_confirmation_threshold",
  "legacyName": "setConfirmationThresholdForTxId",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "unfreezeTransaction",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#unfreezeTransaction",
  "http": "POST /transactions/{txId}/unfreeze",
  "legacyName": "unfreezeTransactionById",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TransactionsApi",
  "method": "validateAddress",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TransactionsApi.md#validateAddress",
  "http": "GET /transactions/validate_address/{assetId}/{address}",
  "legacyName": "validateAddress",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TravelRuleBetaApi",
  "method": "getVASPByDID",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TravelRuleBetaApi.md#getVASPByDID",
  "http": "GET /screening/travel_rule/vasp/{did}",
  "legacyName": "getTravelRuleVASPDetails",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TravelRuleBetaApi",
  "method": "getVASPs",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TravelRuleBetaApi.md#getVASPs",
  "http": "GET /screening/travel_rule/vasp",
  "legacyName": "getAllTravelRuleVASPs",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TravelRuleBetaApi",
  "method": "getVaspForVault",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TravelRuleBetaApi.md#getVaspForVault",
  "http": "GET /screening/travel_rule/vault/{vaultAccountId}/vasp",
  "legacyName": "getVaspForVault",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TravelRuleBetaApi",
  "method": "setVaspForVault",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TravelRuleBetaApi.md#setVaspForVault",
  "http": "POST /screening/travel_rule/vault/{vaultAccountId}/vasp",
  "legacyName": "setVaspForVault",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TravelRuleBetaApi",
  "method": "updateVasp",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TravelRuleBetaApi.md#updateVasp",
  "http": "PUT /screening/travel_rule/vasp/update",
  "legacyName": "updateVasp",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "TravelRuleBetaApi",
  "method": "validateFullTravelRuleTransaction",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TravelRuleBetaApi.md#validateFullTravelRuleTransaction",
  "http": "POST /screening/travel_rule/transaction/validate/full",
  "legacyName": "validateFullTravelRuleTransaction",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "TravelRuleBetaApi",
  "method": "validateTravelRuleTransaction",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/TravelRuleBetaApi.md#validateTravelRuleTransaction",
  "http": "POST /screening/travel_rule/transaction/validate",
  "legacyName": "validateTravelRuleTransaction",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "UserGroupsBetaApi",
  "method": "createUserGroup",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/UserGroupsBetaApi.md#createUserGroup",
  "http": "POST /management/user_groups",
  "legacyName": "createUserGroup",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "UserGroupsBetaApi",
  "method": "deleteUserGroup",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/UserGroupsBetaApi.md#deleteUserGroup",
  "http": "DELETE /management/user_groups/\\{id}",
  "legacyName": "deleteUserGroup",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "UserGroupsBetaApi",
  "method": "getUserGroup",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/UserGroupsBetaApi.md#getUserGroup",
  "http": "GET /management/user_groups/\\{id}",
  "legacyName": "getUserGroup",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "UserGroupsBetaApi",
  "method": "getUserGroups",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/UserGroupsBetaApi.md#getUserGroups",
  "http": "GET /management/user_groups",
  "legacyName": "getUserGroups",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "UserGroupsBetaApi",
  "method": "updateUserGroup",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/UserGroupsBetaApi.md#updateUserGroup",
  "http": "PUT /management/user_groups/\\{id}",
  "legacyName": "updateUserGroup",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "UsersApi",
  "method": "getUsers",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/UsersApi.md#getUsers",
  "http": "GET /users",
  "legacyName": "getUsers",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "activateAssetForVaultAccount",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#activateAssetForVaultAccount",
  "http": "POST /vault/accounts/{vaultAccountId}/{assetId}/activate",
  "legacyName": "activateVaultAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "createLegacyAddress",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#createLegacyAddress",
  "http": "POST\n              /vault/accounts/{vaultAccountId}/{assetId}/addresses/{addressId}/create_legacy",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "VaultsApi",
  "method": "createMultipleAccounts",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#createMultipleAccounts",
  "http": "POST /vault/accounts/bulk",
  "legacyName": "createVaultAccountsBulk",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "createVaultAccount",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#createVaultAccount",
  "http": "POST /vault/accounts",
  "legacyName": "createVaultAccount",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "createVaultAccountAsset",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#createVaultAccountAsset",
  "http": "POST /vault/accounts/{vaultAccountId}/{assetId}",
  "legacyName": "createVaultAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "createVaultAccountAssetAddress",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#createVaultAccountAssetAddress",
  "http": "POST /vault/accounts/{vaultAccountId}/{assetId}/addresses",
  "legacyName": "generateNewAddress",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "getAssetWallets",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#getAssetWallets",
  "http": "GET /vault/asset_wallets",
  "legacyName": "getAssetWallets",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "getMaxSpendableAmount",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#getMaxSpendableAmount",
  "http": "GET /vault/accounts/{vaultAccountId}/{assetId}/max_spendable_amount",
  "legacyName": "getMaxSpendableAmount",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "getPagedVaultAccounts",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#getPagedVaultAccounts",
  "http": "GET /vault/accounts_paged",
  "legacyName": "getVaultAccountsWithPageInfo",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "getPublicKeyInfo",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#getPublicKeyInfo",
  "http": "GET /vault/public_key_info",
  "legacyName": "getPublicKeyInfo",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "getPublicKeyInfoForAddress",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#getPublicKeyInfoForAddress",
  "http": "GET\n              /vault/accounts/{vaultAccountId}/{assetId}/{change}/{addressIndex}/public_key_info",
  "legacyName": "getPublicKeyInfoForVaultAccount",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "getUnspentInputs",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#getUnspentInputs",
  "http": "GET /vault/accounts/{vaultAccountId}/{assetId}/unspent_inputs",
  "legacyName": "getUnspentInputs",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "getVaultAccount",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#getVaultAccount",
  "http": "GET /vault/accounts/{vaultAccountId}",
  "legacyName": "getVaultAccountById",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "getVaultAccountAsset",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#getVaultAccountAsset",
  "http": "GET /vault/accounts/{vaultAccountId}/{assetId}",
  "legacyName": "getVaultAccountAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "getVaultAccountAssetAddressesPaginated",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#getVaultAccountAssetAddressesPaginated",
  "http": "GET /vault/accounts/{vaultAccountId}/{assetId}/addresses_paginated",
  "legacyName": "getPaginatedAddresses",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "getVaultAssets",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#getVaultAssets",
  "http": "GET /vault/assets",
  "legacyName": "getVaultAssetsBalance",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "getVaultBalanceByAsset",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#getVaultBalanceByAsset",
  "http": "GET /vault/assets/{assetId}",
  "legacyName": "getVaultBalanceByAsset",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "hideVaultAccount",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#hideVaultAccount",
  "http": "POST /vault/accounts/{vaultAccountId}/hide",
  "legacyName": "hideVaultAccount",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "setCustomerRefIdForAddress",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#setCustomerRefIdForAddress",
  "http": "POST\n              /vault/accounts/{vaultAccountId}/{assetId}/addresses/{addressId}/set_customer_ref_id",
  "legacyName": "setCustomerRefIdForAddress",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "setVaultAccountAutoFuel",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#setVaultAccountAutoFuel",
  "http": "POST /vault/accounts/{vaultAccountId}/set_auto_fuel",
  "legacyName": "setAutoFuel",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "setVaultAccountCustomerRefId",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#setVaultAccountCustomerRefId",
  "http": "POST /vault/accounts/{vaultAccountId}/set_customer_ref_id",
  "legacyName": "setCustomerRefIdForVaultAccount",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "unhideVaultAccount",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#unhideVaultAccount",
  "http": "POST /vault/accounts/{vaultAccountId}/unhide",
  "legacyName": "unhideVaultAccount",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "updateVaultAccount",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#updateVaultAccount",
  "http": "PUT /vault/accounts/{vaultAccountId}",
  "legacyName": "updateVaultAccount",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "updateVaultAccountAssetAddress",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#updateVaultAccountAssetAddress",
  "http": "PUT /vault/accounts/{vaultAccountId}/{assetId}/addresses/{addressId}",
  "legacyName": "setAddressDescription",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "VaultsApi",
  "method": "updateVaultAccountAssetBalance",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/VaultsApi.md#updateVaultAccountAssetBalance",
  "http": "POST /vault/accounts/{vaultAccountId}/{assetId}/balance",
  "legacyName": "refreshVaultAssetBalance",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "Web3ConnectionsApi",
  "method": "create",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/Web3ConnectionsApi.md#create",
  "http": "POST /connections/wc",
  "legacyName": "createWeb3Connection",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "Web3ConnectionsApi",
  "method": "get",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/Web3ConnectionsApi.md#get",
  "http": "GET /connections",
  "legacyName": "getWeb3Connections",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "Web3ConnectionsApi",
  "method": "remove",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/Web3ConnectionsApi.md#remove",
  "http": "DELETE /connections/wc/\\{id}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "Web3ConnectionsApi",
  "method": "submit",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/Web3ConnectionsApi.md#submit",
  "http": "PUT /connections/wc/\\{id}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WebhooksApi",
  "method": "resendTransactionWebhooks",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/WebhooksApi.md#resendTransactionWebhooks",
  "http": "POST /webhooks/resend/{txId}",
  "legacyName": "resendTransactionWebhooksById",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "WebhooksApi",
  "method": "resendWebhooks",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/WebhooksApi.md#resendWebhooks",
  "http": "POST /webhooks/resend",
  "legacyName": "resendWebhooks",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "createWebhook",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/WebhooksV2BetaApi.md#createWebhook",
  "http": "POST /webhooks",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "deleteWebhook",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/WebhooksV2BetaApi.md#deleteWebhook",
  "http": "DELETE /webhooks/{webhookId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "getNotification",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/WebhooksV2BetaApi.md#getNotification",
  "http": "GET /webhooks/{webhookId}/notifications/{notificationId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "getNotifications",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/WebhooksV2BetaApi.md#getNotifications",
  "http": "GET /webhooks/{webhookId}/notifications",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "getWebhook",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/WebhooksV2BetaApi.md#getWebhook",
  "http": "GET /webhooks/{webhookId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "getWebhooks",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/WebhooksV2BetaApi.md#getWebhooks",
  "http": "GET /webhooks",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WebhooksV2BetaApi",
  "method": "updateWebhook",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/WebhooksV2BetaApi.md#updateWebhook",
  "http": "PATCH /webhooks/{webhookId}",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "WhitelistIpAddressesApi",
  "method": "getWhitelistIpAddresses",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/WhitelistIpAddressesApi.md#getWhitelistIpAddresses",
  "http": "GET /management/api_users/{userId}/whitelist_ip_addresses",
  "legacyName": "getWhitelistedAddresses",
  "newSdk": true,
  "legacySdk": true
}, {
  "cls": "WorkspaceStatusBetaApi",
  "method": "getWorkspaceStatus",
  "methodUrl": "https://github.com/fireblocks/ts-sdk/blob/master/docs/apis/WorkspaceStatusBetaApi.md#getWorkspaceStatus",
  "http": "GET /management/workspace_status",
  "legacyName": "-",
  "newSdk": true,
  "legacySdk": false
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /vault/accounts/{vaultAccountId}/{assetId}/addresses",
  "legacyName": "getDepositAddresses",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /exchange_accounts",
  "legacyName": "getExchangeAccounts",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST\n              /exchange_accounts/{exchangeAccountId}/{assetId}/transfer_to_subaccount",
  "legacyName": "transferToSubaccount",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST\n              /exchange_accounts/{exchangeAccountId}/{assetId}/transfer_from_subaccount",
  "legacyName": "transferFromSubaccount",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /transactions",
  "legacyName": "getTransactionsWithPageInfo",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /vault/accounts/{vaultAccountId}/{asset}/lock_allocation",
  "legacyName": "allocateFundsToPrivateLedger",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /vault/accounts/{vaultAccountId}/{asset}/release_allocation",
  "legacyName": "deallocateFundsFromPrivateLedger",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /vault/accounts/{vaultAccountId}/{assetId}/max_bip44_index_used",
  "legacyName": "getMaxBip44IndexUsed",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /off_exchange_accounts",
  "legacyName": "getOffExchangeAccounts",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /off_exchange_accounts/\\{id}",
  "legacyName": "getOffExchangeAccountById",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /off_exchange_accounts/\\{id}/settle",
  "legacyName": "settleOffExchangeAccountById",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /fee_payer/{baseAsset}",
  "legacyName": "setFeePayerConfiguration",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /fee_payer/{baseAsset}",
  "legacyName": "getFeePayerConfiguration",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "DELETE /fee_payer/{baseAsset}",
  "legacyName": "removeFeePayerConfiguration",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "PUT /connections/wc/{sessionId}",
  "legacyName": "submitWeb3Connection",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "DELETE /connections/wc/{sessionId}",
  "legacyName": "removeWeb3Connection",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /audits",
  "legacyName": "getAudits",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /tokenization/templates/{contractTemplateId}/deploy_function",
  "legacyName": "getContractTemplateDeployFunction",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET\n              /tokenization/templates/{contractTemplateId}/supported_blockchains",
  "legacyName": "getSupportedBlockchains",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /contract-service/contract/{contractId}/function",
  "legacyName": "getContractAbiFunction",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET\n              /contract_interactions/base_asset_id/{baseAssetId}/tx_hash/{txHash}",
  "legacyName": "getContractAddress",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET\n              /contract_interactions/base_asset_id/{baseAssetId}/contract_address/{contractAddress}",
  "legacyName": "getContractByAddress",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /tokenization/tokens/count",
  "legacyName": "getLinkedTokensCount",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /tokenization/tokens/link",
  "legacyName": "linkContractByAddress",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /tokenization/tokens",
  "legacyName": "getPendingLinkedTokens",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "PUT /screening/travel-rule/vasp/update",
  "legacyName": "updateVasp",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "PUT /screening/config",
  "legacyName": "updateTenantScreeningConfiguration",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /screening/supported_assets/{provider}",
  "legacyName": "getSupportedAssetsForScreening",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /staking/chains/{chainDescriptor}/claimRewards",
  "legacyName": "executeStakingClaimRewards",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/wallets/supported_assets",
  "legacyName": "getSupportedAssets",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /ncw/wallets",
  "legacyName": "createWallet",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/wallets/{walletId}",
  "legacyName": "getWallet",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/wallets/{walletId}/backup/latest",
  "legacyName": "getLatestBackup",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "PUT /ncw/wallets/{walletId}/enable",
  "legacyName": "enableWallet",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/wallets/{walletId}/devices/{deviceId}",
  "legacyName": "getWalletDevice",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/wallets/{walletId}/devices/",
  "legacyName": "getWalletDevices",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "PUT /ncw/wallets/{walletId}/devices/{deviceId}/enable",
  "legacyName": "enableWalletDevice",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /ncw/wallets/{walletId}/devices/{deviceId}/invoke",
  "legacyName": "invokeWalletRpc",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /ncw/wallets/{walletId}/accounts",
  "legacyName": "createWalletAccount",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/wallets",
  "legacyName": "getWallets",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/wallets/{walletId}/accounts",
  "legacyName": "getWalletAccounts",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/wallets/{walletId}/accounts/{accountId}",
  "legacyName": "getWalletAccount",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/wallets/{walletId}/accounts/{accountId}/assets",
  "legacyName": "getWalletAssets",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/wallets/{walletId}/accounts/{accountId}/assets/{assetId}",
  "legacyName": "getWalletAsset",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "POST /ncw/wallets/{walletId}/accounts/{accountId}/assets/{assetId}",
  "legacyName": "activateWalletAsset",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET\n              /ncw/wallets/{walletId}/accounts/{accountId}/assets/{assetId}/addresses",
  "legacyName": "getWalletAssetAddresses",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET\n              /ncw/wallets/{walletId}/accounts/{accountId}/assets/{assetId}/balance",
  "legacyName": "getWalletAssetBalance",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "PUT\n              /ncw/wallets/{walletId}/accounts/{accountId}/assets/{assetId}/balance",
  "legacyName": "refreshWalletAssetBalance",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/wallets/{walletId}/setup_status",
  "legacyName": "getWalletSetupStatus",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/wallets/{walletId}/devices/{deviceId}/setup_status",
  "legacyName": "getDeviceSetupStatus",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "PATCH /ncw/wallets/{walletId}/required_algorithms",
  "legacyName": "setWalletRequiredAlgorithms",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "GET /ncw/{walletId}/accounts/{accountId}/{assetId}/unspent_inputs",
  "legacyName": "getUnspentInputs",
  "newSdk": false,
  "legacySdk": true
}, {
  "cls": "-",
  "method": "-",
  "methodUrl": "",
  "http": "DELETE /ncw/wallets/{walletId}/remove_signing_algorithm/{algorithm}",
  "legacyName": "deleteSigningAlgorithm",
  "newSdk": false,
  "legacySdk": true
}];

export const SdkMigrationTable = ({rows = []}) => {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(r => {
      if (filter === "newOnly" && !(r.newSdk && !r.legacySdk)) return false;
      if (filter === "legacyOnly" && !(r.legacySdk && !r.newSdk)) return false;
      if (!q) return true;
      const hay = `${r.cls} ${r.method} ${r.http} ${r.legacyName}`.toLowerCase();
      return hay.includes(q);
    });
  }, [rows, filter, query]);
  const btn = (id, label) => {
    const active = filter === id;
    return <button type="button" onClick={() => setFilter(id)} style={{
      padding: "6px 14px",
      fontSize: 13,
      fontWeight: 500,
      border: "1px solid",
      borderColor: active ? "#0052ec" : "#d1d5db",
      background: active ? "#0052ec" : "white",
      color: active ? "white" : "#374151",
      borderRadius: 6,
      cursor: "pointer",
      marginRight: 8
    }}>
        {label}
      </button>;
  };
  return <div style={{
    margin: "16px 0"
  }}>
      <div style={{
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginBottom: 12
  }}>
        {btn("all", "Show all")}
        {btn("newOnly", "New only")}
        {btn("legacyOnly", "Legacy only")}
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search method, class, endpoint…" style={{
    flex: "1 1 240px",
    minWidth: 240,
    padding: "6px 12px",
    fontSize: 13,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    outline: "none"
  }} />
        <span style={{
    fontSize: 12,
    color: "#6b7280"
  }}>
          {filtered.length} of {rows.length}
        </span>
      </div>

      <div style={{
    maxHeight: 600,
    overflowY: "auto",
    overflowX: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: 6
  }}>
        <table style={{
    width: "100%",
    minWidth: 880,
    borderCollapse: "collapse",
    fontSize: 13
  }}>
          <thead style={{
    position: "sticky",
    top: 0,
    background: "#f9fafb",
    zIndex: 1
  }}>
            <tr>
              {["Class", "Method", "HTTP Request", "Legacy Method Name", "New SDK", "Legacy SDK"].map(h => <th key={h} style={{
    textAlign: "left",
    padding: "12px 24px",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: 600,
    color: "#374151",
    whiteSpace: "nowrap"
  }}>
                  {h}
                </th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => <tr key={i} style={{
    borderBottom: "1px solid #f3f4f6"
  }}>
                <td style={{
    padding: "12px 24px",
    color: "#374151"
  }}>{r.cls}</td>
                <td style={{
    padding: "12px 24px"
  }}>
                  {r.methodUrl ? <a href={r.methodUrl} target="_blank" rel="noopener noreferrer" style={{
    color: "#0052ec",
    textDecoration: "none"
  }}>
                      {r.method}
                    </a> : r.method}
                </td>
                <td style={{
    padding: "12px 24px",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    color: "#374151"
  }}>{r.http}</td>
                <td style={{
    padding: "12px 24px",
    color: "#374151"
  }}>{r.legacyName}</td>
                <td style={{
    padding: "12px 24px",
    textAlign: "center"
  }}>{r.newSdk ? "✅" : "❌"}</td>
                <td style={{
    padding: "12px 24px",
    textAlign: "center"
  }}>{r.legacySdk ? "✅" : "❌"}</td>
              </tr>)}
            {filtered.length === 0 && <tr>
                <td colSpan={6} style={{
    padding: 24,
    textAlign: "center",
    color: "#6b7280"
  }}>
                  No methods match the current filter.
                </td>
              </tr>}
          </tbody>
        </table>
      </div>
    </div>;
};

Learn how to migrate to the latest version of the Fireblocks SDK.

We've upgraded the Fireblocks SDKs to enhance performance and streamline integration. To ensure uninterrupted functionality, we strongly recommend migrating to the new SDK as soon as possible. Migrating will give you access to the latest features, optimized performance, and ongoing support.

This document will help you to:

* Understand the latest features and improvements
* Map changes between the legacy and new SDKs
* Complete the migration to the new SDKs with actionable steps

<Warning>
  ### Migrate now to avoid disruptions and keep access to features and updates

  The legacy SDKs are being deprecated in phases, reducing its functionality and support over time. Here are important dates to remember:

  * **February 15, 2025:** Legacy SDKs enter maintenance mode. No new API endpoints will be added, and only critical bug fixes will be provided.
  * **August 1, 2026:** Legacy SDKs reach end-of-life (EOL). No further updates, bug fixes, or support will be provided, and the SDK will no longer be actively maintained.
</Warning>

## Key improvements

* **Fully Typed:** Reduces runtime errors and improves code reliability.
* **Complete API Alignment:** Fully consistent with the API specification.
* **Inline Guidance:** Provides detailed descriptions for function arguments.
* **Code Samples:** Includes practical examples for every function.
* **Comprehensive Documentation:** Clear and detailed resources, including method explanations and HTTP request structures.

## Key actions for migration

1. **Upgrade your environment:**
   1. Update your Python to **3.8 or newer** for the latest Python SDK
   2. Upgrade to **Node.js v16 or newer** for the latest TypeScript SDK.
2. **Install the latest SDK versions:** Ensure you have the latest SDK packages by checking all the relevant links for each SDK.
   1. [TypeScript SDK](/reference/typescript-sdk)
      1. Please note that the new TS SDK does *NOT* include PII encryption.
   2. [Java SDK](/reference/java-sdk)
   3. [Python SDK](/reference/new-python-sdk)
3. **Update your codebase:** Replace the outdated methods with the new ones [here](/reference/new-python-sdk).
4. **Get support if needed:** Reach out to your Customer Success Manager (CSM) or Fireblocks Support if you experience any migration issues.

## GitHub repository mapping: Legacy to New

| Legacy SDK                                                                        | New SDK                                                           |
| :-------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| [Fireblocks JS SDK (Legacy)](https://github.com/fireblocks/fireblocks-sdk-js)     | [Fireblocks TypeScript SDK](https://github.com/fireblocks/ts-sdk) |
| [Fireblocks Python SDK (Legacy)](https://github.com/fireblocks/fireblocks-sdk-py) | [Fireblocks Python SDK](https://github.com/fireblocks/py-sdk)     |

## SDK mapping: JS SDK (Legacy) to New TypeScript SDK

<SdkMigrationTable rows={TS_SDK_ROWS} />

## SDK Mapping: Python (Legacy) to New Python SDK

<SdkMigrationTable rows={PY_SDK_ROWS} />

## FAQs

### Why are the current SDKs being deprecated?

The legacy SDKs are being phased out to provide a more reliable, efficient, and developer-friendly experience through our new SDKs. The new versions are fully typed, better aligned with our API, and include improved documentation and inline guidance.

### Can I continue using the legacy SDKs after August 1, 2026?

Yes, but we strongly advise against it. The SDKs will no longer be maintained, which may result in security risks, compatibility issues, and a lack of support, potentially impacting your application.

### Which programming languages are supported in the new SDKs?

We offer SDKs for TypeScript, Python, and Java. Developers using other languages should integrate directly with our API.

### What happens if I don't migrate before August 1, 2026?

If you continue using the legacy SDKs:

* It will no longer receive updates or bug fixes
* Security vulnerabilities may arise over time
* New API endpoints and features will not be available
* Fireblocks Support will no longer assist with issues related to the legacy SDKs

### Will Fireblocks Support provide extended support for the legacy SDKs?

No. There will be no extended support after August 1, 2026. To avoid any disruptions, migrate as soon as possible.
