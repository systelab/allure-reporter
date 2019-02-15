## .NET
---
### Prerequisites
In order to use Allure in your .Net project with the following exemple you will need used NUnit with NuGet NUnit.Allure

### Writing a Test case
The tag [AllureNUnit] its necessary to generate the JSON files.
In this exemple, the [Description] tag is set as step test case in the allure-reporter tool.  
The [AllureTms] tag contains the test case name in Jama.

Use the following example as a basis for your test cases.

```C#
    [TestFixture("ACR", "mg/mmol")]
    [TestFixture("Chol/HDL", "")]
    [AllureNUnit]
    public class QCAfinionTestCases : UnitTestBase<AfinionAnalyzer>
    {
        string code;
        string unit;
        string flag;

        XDocument translatedResult = null;
        OBSR01 observationMessage = null;
        HELR01 helloMessage = null;

        public QCAfinionTestCases(string code, string unit)
        {
            this.code = code;
            this.unit = unit;
        }

        [AllureEpic("TestAfinion")]
        [AllureTms("When the device has a control result for upload, Then the message shall be upload to GWP")]
        [AllureFeature("SYN-TC-2643 - The scope of this scenario is to verify that the translator returns the message as expected. QC results are shown in GEM Web Plus.")]
        [Description("Check that the mapping for ACR is correct.")]
        [Test]
        public void MessageTranslated_As_Expected()
        {
            HELR01 helloMessage = this.Analyzer.SendHelloMessage();
            this.Analyzer.SendStatusMessage(newObservations: 1);
            OBSR02 observationMessage = this.Analyzer.SendControlResultsMessage(
                this.Analyzer.MessageBuilder.WithTest(code, unit));
            this.Analyzer.WaitForTerminateMessage();
            XDocument translatedResult = this.Gwp.WaitForResults(1)?.Message;
            translatedResult.Should().NotBeNull();
            using (new AssertionScope())
            {
			...
			}

        }
    }
```