import escapeHTML from "./escape_html"
import { TestResult, TestStatus } from "./test_parser"

const unnamedTestCase = "<no name>"

export function textSummary(result: TestResult): string {
    const count = result.counts
    let summary = ""

    if (count.passed > 0) {
        summary += `${count.passed} passed`
    }
    if (count.failed > 0) {
        summary += `${summary ? ", " : ""}${count.failed} failed`
    }
    if (count.skipped > 0) {
        summary += `${summary ? ", " : ""}${count.skipped} skipped`
    }

    return summary
}

export function textResults(result: TestResult, show: number): string {
    let count = 0
    let text = `===============\n${statusTitle(show)}:\n===============\n\n`

    for (const suite of result.suites) {
        for (const testcase of suite.cases) {
            if (show !== 0 && (show & testcase.status) === 0) {
                continue
            }

            text += (testcase.name || unnamedTestCase)

            if (testcase.description) {
                text += ": "
                text += testcase.description
            }

            text += "\n\n"

            if (testcase.message) {
                text += "------ Message: '"
                text += testcase.message
            }

            if (testcase.details) {
                text += "------ Details:\n"
                text += testcase.details
                text += "\n"
            }

            if (testcase.stdout) {
                text += "------ stdout log:\n"
                text += testcase.stdout
                text += "\n"
            }

            if (testcase.stderr) {
                text += "------ stderr log:\n"
                text += testcase.stderr
                text += "\n"
            }


            count++

            text += "===============\n"
        }
    }

    if (count === 0) {
        return ""
    }

    return text
}

function statusTitle(status: TestStatus): string {
    switch (status) {
        case TestStatus.Fail:
            return "Test failures"
        case TestStatus.Skip:
            return "Skipped tests"
        case TestStatus.Pass:
            return "Passing tests"
        default:
            return "Test results"
    }
}
