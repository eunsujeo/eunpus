# 12-Interoperability-with-Other-Protocols



12-Interoperability-with-Other-Protocols [#12-interoperability-with-other-protocols]

1\. Check the VASP List [#1-check-the-vasp-list]

On Dashboard [#on-dashboard]

* **Main Tabs:** **Info**
* **Dropdown Menu:**
  * **List of Available VASPs** (Select)
  * Company Info

**List of Available VASPs** [#list-of-available-vasps]

> **Information Note:**
>
> * Dashboar will display the list of VASPs that you can integrate via CodeVASP, actual integration status may vary depending on your internal policy.
> * The 'Server Status' represents the VASP's server condition, not integration status. May differ from real-time information.
> * Exchanges integrated with the VerifyVASP solution support only domestic transactions within South Korea, transactions with exchanges outside Korea are not possible.

By checking the response of the 'VASP List Search' API or the 'Info - List of Available VASPs' page on the dashboard, you can view the list of VASPs and their respective `allianceName` (travel rule solution). Currently, CodeVASP is integrated with solutions such as Verify VASP, GTR, and Sygna, providing a wide-ranging network.

2\. Integration process with VASPs from other protocols [#2-integration-process-with-vasps-from-other-protocols]

The list shows VASPs that are TECHNICALLY integrated with CodeVASP, but may not be integrated from a policy perspective. For actual transaction integration, a risk assessment (Due Diligence) may be required.

After thorough consultation with your internal compliance team, if integration is deemed necessary, please discuss the procedure with CodeVASP first. We will provide separate guidance on the process for each VASP.

3\. Invocation Method [#3-invocation-method]

Members of the CodeVASP Travel Rule Alliance can exchange traffic with members of other alliances that use different travel rule solutions. The invocation method and travel rule process are the same for all VASPs within the CodeVASP network.

However, the required fields may vary depending on the travel rule solution provider (`allianceName`).

3-1. General Guidelines [#3-1-general-guidelines]

* Additional parameter in request body - Please read [API reference](https://code-docs-en.readme.io/reference/request-asset-transfer-authorization#/)
  * 'address': Address of beneficiary's wallet.
  * 'tag': This is mandatory when a tag is present (e.g., XRP).
  * 'network': Please refer to the table below.

3-2. GTR [#3-2-gtr]

* GTR : [https://www.globaltravelrule.com/](https://www.globaltravelrule.com/)
* For natural person deposits and withdrawals, both the Originator and Beneficiary must provide the 'dateOfBirth' field within 'DateAndPlaceOfBirth'. This requirement does not apply to legal entities.
* When sending to Binance, transactions are pre-verified under the Standard \[communication scenario] (aligned with the existing process). For incoming transactions, verification is conducted under the Sunrise \[communication scenario].
* To communicate with Binance and other GTR member VASPs, the fields `address`, `tag`, and `network` specified in section **3-1. General Guidelines** are mandatory.

3-3. Sygna [#3-3-sygna]

* Sygna : [https://www.sygna.io/](https://www.sygna.io/)
* Following parameters are required in the 'originator' object.
  * **customerIdentification**
  * **nationalIdentification**
  * **geographicAddress**
  * **dateAndPlaceOfBirth**

4\. Network by Coins [#4-network-by-coins]

You can visit [Network by Coins](https://main.d1tjdguub6i7tp.amplifyapp.com/network/en) to check the network by coins.
