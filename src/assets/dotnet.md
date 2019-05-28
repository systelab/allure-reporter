## .NET
---
### Prerequisites
To use AllureNUnit in a C# project it is necessary install:
- Download Nuget NUnit 3 https://nunit.org/
- Download Nuget NUnit.Allure v.1.0.6-beta30 https://www.nuget.org/packages/NUnit.Allure
- Configure allureConfig.json
- Set AllureNUnit attribute under test fixture
- Use other attributes if needed 

### Writing a Test case
The [AllureNUnit] tag it is necessary to generate the JSON files.
The [Description] tag is the step test case.   
The [AllureTms] tag is the test case name defined in Jama.

NUnit.Allure attribute | Allure model location | allure-reporter field | JAMA field
--- | --- | --- | --- 
AllureEpic | as `label` with name `epic` | Not supported | Not supported
AllureTms | as `links` field `name` | Title | Test Name
AllureFeature | `feature` | Subtitle | Not supported
Description | `action` | Action | Action

*note: The tag [step] is not implemented yet, for this reason, the expected result is managed by the JSON and takes the `steps` field `name`.
The name is the function name.*

Use the following example as a basis for your test cases:

```C#
    [TestFixture("Test1", "units1")]
    [TestFixture("Test2", "")]
    [AllureNUnit]
    public class CustomerTestCases : UnitTestBase<CustomerAnalyzer>
    {
        string code;
        string unit;
        string flag;

        XDocument translatedResult = null;
        OBSR01 observationMessage = null;
        HELR01 helloMessage = null;

        public CustomerTestCases(string code, string unit)
        {
            this.code = code;
            this.unit = unit;
        }

        [AllureEpic("CusomerTestCase")]
        [AllureTms("When the device has a control result for upload, Then the message shall be upload to the middleware")]
        [AllureFeature("SYN-TC-2643 - The scope of this scenario is to verify that the translator returns the message as expected. QC results are shown in the middleware.")]
        [Description("Send a Patient message.")]
        [Test]
        public void MessageTranslated_As_Expected()
        {
            HELR01 helloMessage = this.Analyzer.SendHelloMessage();
            this.Analyzer.SendStatusMessage(newObservations: 1);
            OBSR02 observationMessage = this.Analyzer.SendControlResultsMessage(
                this.Analyzer.MessageBuilder.WithTest(code, unit));
            this.Analyzer.WaitForTerminateMessage();
            XDocument translatedResult = this.middleware.WaitForResults(1)?.Message;
            translatedResult.Should().NotBeNull();
            using (new AssertionScope())
            {
			...
			}

        }
    }
```
