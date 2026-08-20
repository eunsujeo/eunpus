> ## Documentation Index
> Fetch the complete documentation index at: https://developers.fireblocks.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Common errors

# Unexpected physicalDeviceId

When thrown by any SDK function, this error indicates that the `physicalDeviceId` associated with the `deviceId` in Fireblocks and the `physicalDeviceId` sent with the request are not identical.

The `physicalDeviceId` is an ID the SDK provisions when the SDK is initialized on a new web browser or mobile device. After the `generateMPCKeys` function generates key shares or an end user completes the recovery procedure, Fireblocks assigns the `deviceId` to the `physicalDeviceId`. This means that the same `deviceId` cannot issue requests (e.g., sign transactions) from any other SDK initialization.

<Note>
  **Reminder**

  The SDK initialization occurs with a specific `deviceId`.
</Note>

Below are some scenarios that may result in an **Unexpected physicalDeviceId** exception.

## Unexpected physicalDeviceId after recovery

As described [here](https://ncw-developers.fireblocks.com/docs/backup-recovery-1#additional-recovery-info), encrypted key share backups are associated with a corresponding `deviceId`. When an end-user recovers a key share from a new device (i.e., a different `physicalDeviceId` than their original device), the `deviceId` of the original device is no longer associated with the key share.

### Example

If Device A (`physicalDeviceId: pd1` and `deviceId: d1`) generates a key share, and Device B (`physicalDeviceId: pd2`) recovers Device A's key share, the NCW SDK will throw the **Unexpected physicalDeviceId** error message when Device A attempts to sign a transaction since `pd1` is no longer associated with `d1`.

## Unexpected physicalDeviceId after key generation abruptly stopped

During the key generation process, Fireblocks associates the `physicalDeviceId` with the `deviceId`. If the process is interrupted and then restarted with the same `deviceId` but a different `physicalDeviceId`, the NCW SDK will throw the **Unexpected physicalDeviceId** error message.

### Examples

* Reinstalling the app, clearing the storage, and then calling `generateMPCKeys` again
* Calling `generateMPCKeys` from another device
