> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# EW API errors

# Overview

This page covers API errors associated with the Fireblocks Embedded Wallet. Every error is accompanied by the correct HTTP error code and a message structured as follows:

```javascript theme={"system"}
{
	error: 'HTTP Error description',
	message: 'Error message'
}
```

# 4XX errors

## 400 - Bad Request

| Error Name                                     | Error Message                                                                                                                                     |
| :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| No active webhook subscriptions                | The workspace was not configured with a Webhook endpoint that is required for NCW async communication.                                            |
| Unsupported algorithm                          | The provided algorithm for MPC key generation is not supported. Learn more [here](https://ncw-developers.fireblocks.com/docs/mpc-key-generation). |
| Pagination limit too large                     | The provided pagination limit parameter is higher than 50.                                                                                        |
| Validation failed (numeric string is expected) | The API call was made with an invalid NCW wallet identifier or account ID.                                                                        |

## 403 - Forbidden

| Error Name      | Error Message                                                                 |
| :-------------- | :---------------------------------------------------------------------------- |
| Wallet disabled | The requested NCW is disabled. Learn more [here](/reference/enablewallet).    |
| Device disabled | The requested device is disabled. Learn more [here](/reference/enabledevice). |
| Tenant disabled | The entire Fireblocks workspace is disabled.                                  |

## 404 - Not Found

| Error Name       | Error Message                         |
| :--------------- | :------------------------------------ |
| Wallet not found | The provided wallet ID was not found. |
| Device not found | The provided device ID was not found. |
| Tenant not found | The provided tenant ID was not found. |

## 409 - Conflict

| Error Name                      | Error Message                              |
| :------------------------------ | :----------------------------------------- |
| Incomplete MPC Setup            | The MPC Key generation was not completed.  |
| Ongoing setup already in motion | MPC Key generation ceremony is in process. |

***

# 1XXX errors

## 1000 - Incomplete Wallet

| Error Name        | Error Message                                                                                                                                |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| Incomplete Wallet | None of the devices in the Wallet have a COMPLETE status. Learn more [here](https://ncw-developers.fireblocks.com/docs/multiple-algorithms). |

## 1001 - Incomplete Device

| Error Name        | Error Message                                                                                                                     |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| Incomplete Device | The device key status is in status INCOMPLETE. Learn more [here](https://ncw-developers.fireblocks.com/docs/multiple-algorithms). |

## 1002 - Incomplete Backup

| Error Name        | Error Message                                                                                                                                                                                                                    |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Incomplete Backup | The device key was not backed up. Learn more about backups [here](https://ncw-developers.fireblocks.com/docs/backup-recovery-1)  and multiple algorithms [here](https://ncw-developers.fireblocks.com/docs/multiple-algorithms). |

## 1003 - Unsupported Algorithms

| Error Name             | Error Message                                                                                                                       |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| Unsupported Algorithms | The Algorithm is not supported by the workspace. Learn more [here](https://ncw-developers.fireblocks.com/docs/multiple-algorithms). |
