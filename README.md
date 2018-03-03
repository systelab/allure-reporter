# Allure Reporter

This application generates a printable document from Allure results files. [Allure](http://allure.qatools.ru) is an [open-source framework](https://github.com/allure-framework/allure2) designed to create test execution reports that are clear to everyone in the team.

Only Allure 2 compatible files, in json format, are supported.

## Getting Started

To get you started you can simply clone the `allure-reporter` repository and install the dependencies:

### Prerequisites

You need [git][git] to clone the `allure-reporter` repository.

You will need [Node.js][node] and [npm][npm].

### Clone `allure-reporter`

Clone the `allure-reporter` repository using git:

```bash
git clone https://github.com/alfonsserra/allure-reporter.git
cd seed-angular
```

If you just want to start a new project without the `allure-reporter` commit history then you can do:

```bash
git clone --depth=1 https://github.com/alfonsserra/allure-reporter.git <your-project-name>
```

The `depth=1` tells git to only pull down one commit worth of historical data.

### Install Dependencies

To install the dependencies you must run:

```bash
npm install
```
### Run

To run the application use the following command:

```bash
ng serve
```

### Generate

To generate the application use the following command:

```bash
ng build
```

[git]: https://git-scm.com/
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[Angular]: https://angular.io/
