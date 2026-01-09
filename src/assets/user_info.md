## Relevant Information for Users
---
### Limitations in result reporting

If an unhandled exception occurs during test case execution, some of the subsequent steps may not be executed (and therefore not reported).

The absence of this information could cause some test cases to appear as passed even though specific steps were not executed. This is neither valid nor acceptable, as the test case design would be incomplete and the test case result inaccurate.
For this reason, it is essential to ensure that the execution has completed successfully without exceptions before generating the report. The automation code must implement mechanisms to avoid generating partial results and to detect incomplete executions.

The use of the new “Upload Step Results Mode” option serves as a mitigation for this abnormal and undesired behavior as it checks the number of steps and exact content. 

#### For .NET results (using NUnit)

The test header will only display the string specified in the **tmslink tag**.

#### Retries of the same Test Case

The reporting of several retries of the same Test Case is not supported using the JSON format, as it is interpreted incorrectly (each retry is merged when the last one should be reported)
