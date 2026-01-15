## Relevant Information for Users
---

### Important Notice:

🔐 __Using the VPN is mandatory starting from this version.__

Make sure you are connected to the corporate VPN before opening Allure Reporter; otherwise, you will not be able to reach the tool.

---

### Allure Reporter – First‑Time User Quick Guide


1. __Authenticate using the link on the right side of the page__
   
    Click the “Automatic Log In” option, this uses your SSO credentials to access the tool.

2. __Select the JAMA instance you want to work with__

    Choose the correct JAMA environment from the dropdown menu to ensure that all interactions (uploads, updates, queries) point to the right project space.

3. __Drag and drop your results files__

    Drop your _allure‑results_ files. 

    This enables the JAMA connection and activates all available features for updating test cases.

---


### Limitations: 

* __Result reporting:__

    If an unhandled exception occurs during test case execution, some of the subsequent steps may not be executed (and therefore not reported).

    The absence of this information could cause some test cases to appear as passed even though specific steps were not executed. This is neither valid nor acceptable, as the test case design would be incomplete and the test case result inaccurate.
    For this reason, it is essential to ensure that the execution has completed successfully without exceptions before generating the report. The automation code must implement mechanisms to avoid generating partial results and to detect incomplete executions.

    The use of the new “Upload Step Results Mode” option serves as a mitigation for this abnormal and undesired behavior as it checks the number of steps and exact content. 

* __.NET results (using NUnit):__

    The test header will only display the string specified in the **tmslink tag**.

* __Retries of the same Test Case:__

  The reporting of several retries of the same Test Case is not supported using the JSON format, as it is interpreted incorrectly (each retry is merged when the last one should be reported)

* __Test Case upload into JAMA:__

  The Test Case with status __PASS__ and __FAILED__ are the eligible ones to be uploaded into JAMA, other status won't be processed. 
