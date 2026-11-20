# E-Raport Automation Testing

Automated functional and end-to-end testing for an Electronic Report Card (E-Raport) web application using Playwright, JavaScript, and the Page Object Model (POM) design pattern.

## Project Overview

This repository contains Playwright test automation for selected features of an E-Raport web application. The tests are organized by application module, while reusable page locators and actions are maintained in separate page classes.

## Objectives

- Automate functional checks for important E-Raport features.
- Verify user flows, form validation, and page behavior.
- Organize reusable browser interactions with the Page Object Model.
- Keep test scripts and execution evidence maintainable.

## Tools and Technologies

- JavaScript
- Node.js
- Playwright
- Page Object Model (POM)
- Git and GitHub
- Jira Cloud (test documentation and tracking)

## Project Structure

```text
e-raport-automation/
├── pages/
│   ├── AkunPage.js
│   ├── DashboardPage.js
│   ├── GuruPage.js
│   ├── LaporanPage.js
│   ├── MapelPage.js
│   ├── NilaiPage.js
│   └── SiswaPage.js
├── tests/
│   ├── akun/
│   ├── dashboard/
│   ├── guru/
│   ├── laporan/
│   ├── mapel/
│   ├── Nilai/
│   └── siswa/
├── playwright.config.js
├── package.json
└── package-lock.json
```

## Test Coverage

The following 32 test cases have been reported as passing in the project test runs shared during development:

| Module | Passing test cases |
|---|---:|
| Mata Pelajaran (Subjects) | 8 |
| Akun Pengguna (User Accounts) | 8 |
| Siswa (Students) | 8 |
| Nilai (Grades) | 8 |
| **Total** | **32** |

Additional test specifications exist for Dashboard, Guru, and Laporan. Their full execution results have not yet been confirmed for this portfolio summary.

## Example Scenarios

- Verify that module pages and their main elements are visible.
- Verify table headers and displayed records.
- Validate required form fields.
- Add, edit, and delete student records.
- Reject duplicate student identification numbers (NIS).
- Select subjects assigned to a teacher.
- Validate grade inputs and grade calculations.
- Apply semester filters.
- Verify user-account management actions.

## Getting Started

### Prerequisites

- Node.js and npm
- The E-Raport application running locally
- Valid test accounts for the required roles

### Installation

Clone the repository:

```bash
git clone https://github.com/ermilaamanda102/e-raport-automation.git
cd e-raport-automation
```

Install dependencies and the Chromium browser:

```bash
npm install
npx playwright install chromium
```

### Configure test credentials

Set credentials in PowerShell before running tests. Use your own local test accounts; do not commit credentials to Git.

```powershell
$env:ADMIN_USERNAME="your_admin_username"
$env:ADMIN_PASSWORD="your_admin_password"
$env:GURU_USERNAME="your_teacher_username"
$env:GURU_PASSWORD="your_teacher_password"
```

### Run tests

Run all tests in Chromium:

```bash
npx playwright test --project=chromium
```

Run one module:

```bash
npx playwright test tests/mapel/mapel-pom.spec.js --project=chromium
```

Run with the browser visible and one worker:

```bash
npx playwright test --headed --workers=1 --project=chromium
```

The local E-Raport application must be running at the base URL configured in the test project before execution.

## Playwright HTML Report

After a test run, open the HTML report with:

```bash
npx playwright show-report
```

## Repository

[GitHub: ermilaamanda102/e-raport-automation](https://github.com/ermilaamanda102/e-raport-automation)

## Author

**Ermila Amanda**

QA Automation Testing Portfolio Project

Skills demonstrated: Functional Testing, End-to-End Testing, Test Automation, Playwright, JavaScript, Page Object Model, Test Documentation, and Git/GitHub.
