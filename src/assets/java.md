## Java
---
### Prerequisites with Maven

In order to use Allure in your Java project you will need to add the following dependencies:

```
<dependency>
	<groupId>io.qameta.allure</groupId>
	<artifactId>allure-maven</artifactId>
	<version>2.9</version>
	<scope>test</scope>
</dependency>
```

And the dependency for JUnit depending on the version

```
<dependency>
	<groupId>io.qameta.allure</groupId>
	<artifactId>allure-junit4</artifactId>
	<version>LATEST_VERSION</version>
	<scope>test</scope>
</dependency>
```

```
<dependency>
	<groupId>io.qameta.allure</groupId>
	<artifactId>allure-junit5</artifactId>
	<version>LATEST</version>
	<scope>test</scope>
</dependency>
```

Please refer to the official documentation at https://docs.qameta.io/allure#_junit_4 and https://docs.qameta.io/allure#_junit_5


Additionally you will have to add the following plugin in the reporting goal:


```
<plugin>
	<groupId>io.qameta.allure</groupId>
	<artifactId>allure-maven</artifactId>
	<version>2.9</version>
</plugin>
```

Please refer to the official documentation at https://github.com/allure-framework/allure-maven


And finally you have to setup the *maven-surefire-plugin* with allure. 

```
<properties>
	<aspectj.version>1.8.10</aspectj.version>
</properties>

<build>
	<plugins>
		<plugin>
			<groupId>org.apache.maven.plugins</groupId>
			<artifactId>maven-surefire-plugin</artifactId>
			<version>2.20</version>
			<configuration>
				<testFailureIgnore>false</testFailureIgnore>
				<argLine>
					-javaagent:"${settings.localRepository}/org/aspectj/aspectjweaver/${aspectj.version}/aspectjweaver-${aspectj.version}.jar"
				</argLine>
				<properties>
					<property>
						<name>listener</name>
						<value>io.qameta.allure.junit4.AllureJunit4</value>
					</property>
				</properties>
				<systemProperties> 
					<property>
						<name>allure.results.directory</name>
						<value>${project.build.directory}/allure-results</value>
					</property>
				</systemProperties>
			</configuration>
        
			<dependencies>
				<dependency>
					<groupId>org.aspectj</groupId>
					<artifactId>aspectjweaver</artifactId>
					<version>${aspectj.version}</version>
				</dependency>
			</dependencies>
		</plugin>
	</plugins>
</build>
```

 
Once the configuration is done, you can run your tests typing the following command:

```bash
mvn clean test 
```

You can generate a report using one of the following:

```bash
mvn allure:serve
```

Report will be generated into temp folder. Web server with results will start.

```bash
mvn allure:report
```

Report will be generated tо directory: target/site/allure-maven/index.html


#### Troubleshooting

In case the libraries "com.fasterxml.jackson.core" (jackson-core, jackson-annotations and jackson-databind) were already included in the dependencies, it's required to pre-define the version in the pom.xml to resolve the conflict.

```
<dependency>
	<groupId>com.fasterxml.jackson.core</groupId>
	<artifactId>jackson-databind</artifactId>
	<version>2.7.0</version>
	<scope>test</scope>
</dependency>
<dependency>
	<groupId>com.fasterxml.jackson.core</groupId>
	<artifactId>jackson-annotations</artifactId>
	<version>2.7.0</version>
	<scope>test</scope>
</dependency>
<dependency>
	<groupId>com.fasterxml.jackson.core</groupId>
	<artifactId>jackson-core</artifactId>
	<version>2.7.0</version>
	<scope>test</scope>
</dependency>
```

### Prerequisites with Gradle
Add the following configuration file "build.gradle" as follows:
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath "io.qameta.allure:allure-gradle:2.5"
    }
}

apply plugin: 'java'
apply plugin: 'io.qameta.allure'

repositories {
    mavenCentral()
}

allure {
    autoconfigure = true
    version = '2.6.0'

    useJUnit4 {
        version = '2.6.0'
    }

}

test {
    useJUnit()
}

### Writing a Test case

Use the following example as a basis for your test cases.
For further details, refer to the https://github.com/systelab/seed-jee/tree/master/src/test

```java
@Epic("QC")  //Epic tag is optional
@TmsLink("MLG_TC1086_LAB_QC_StatisticalCalculations")
@Feature("Goal: This test case is intended to verify the correct calculation of the different Statistical Calculations of the QC module" + "\n\n Environment:N/A "
+ "\n\nSpecial Considerations: To have a control for a test with minimum 2 QC valid results received (no omitted and no outliers) different between them. RiliBÄK enabled and number of valid points greater than NR. Biological Variation enabled")
public class QCTestDataTest
{
    @Description("Execute the Performance calculation without filters (all the values of the control and test")
    @Test
    public void statisticalCalculations_GeneralCaseWithoutFilters()
    {
        ....
        TestUtil.checkField("SD", 2, qcdata.getSD);
    }
  
    @Step("Action: Perform Login")
    public static void login()
    {
        //perform the action
    }
}
 
public class TestUtil
{
    @Step("Field {0} must be {1}") //or "Expected result: Field {0} must be {1}"
    public static void checkField(String field, String expectedValue, String returnedValue)
    {
           Assert.assertEquals(expectedValue, returnedValue);
    } 
}
```

