import {
  analyzeProblem,
  buildResultBlueprint,
  buildResultOutput,
  interpretAnswers,
  type ResultOutput,
} from './interpreter'
import { PROBLEM_ANALYZER_TEST_CASES } from './fixtures'

export type ProblemAnalyzerSnapshot = {
  caseName: string
  problemStatement: string
  output: ResultOutput
}

export function exportProblemAnalyzerSnapshots(): ProblemAnalyzerSnapshot[] {
  return PROBLEM_ANALYZER_TEST_CASES.map((testCase) => ({
    caseName: testCase.caseName,
    problemStatement: testCase.problemStatement,
    output: analyzeProblem(testCase.answers, testCase.confidenceByQuestion),
  }))
}

export function logProblemAnalyzerSnapshotsJson() {
  console.log(JSON.stringify(exportProblemAnalyzerSnapshots(), null, 2))
}

export function runProblemAnalyzerTests() {
  let passCount = 0

  for (const testCase of PROBLEM_ANALYZER_TEST_CASES) {
    const interpretation = interpretAnswers(testCase.answers, testCase.confidenceByQuestion)
    const blueprint = buildResultBlueprint(
      interpretation,
      testCase.answers,
      testCase.confidenceByQuestion
    )
    const output = buildResultOutput(blueprint)

    const pass =
      interpretation.primaryRisk === testCase.expected.primaryRisk &&
      interpretation.recommendationType === testCase.expected.recommendationType &&
      interpretation.nextFocusType === testCase.expected.nextFocusType

    if (pass) {
      passCount += 1
    }

    console.log('---')
    console.log(testCase.caseName)
    console.log('Problem:', testCase.problemStatement)
    console.log('Expected:')
    console.log(testCase.expected)
    console.log('Actual:')
    console.log({
      primaryRisk: interpretation.primaryRisk,
      recommendationType: interpretation.recommendationType,
      nextFocusType: interpretation.nextFocusType,
    })
    console.log('Diagnosis:')
    console.table(interpretation.diagnosis)
    console.log('Signals:', output.signals)
    console.log('Summary:', output.summary)
    console.log('Recommendation:', output.recommendation.title)
    console.log('Next Focus:', output.nextFocus.title)
    console.log('Confidence:', output.confidence.level)
    console.log(pass ? 'PASS' : 'FAIL')
  }

  console.log('---')
  console.log(`Completed ${PROBLEM_ANALYZER_TEST_CASES.length} cases`)
  console.log(`Passed: ${passCount}`)
  console.log(`Failed: ${PROBLEM_ANALYZER_TEST_CASES.length - passCount}`)
  logProblemAnalyzerSnapshotsJson()
}

export function exportLlmSimulationPayloads() {
  return PROBLEM_ANALYZER_TEST_CASES.map((testCase) => {
    const interpretation = interpretAnswers(testCase.answers, testCase.confidenceByQuestion)
    const blueprint = buildResultBlueprint(
      interpretation,
      testCase.answers,
      testCase.confidenceByQuestion
    )
    const output = buildResultOutput(blueprint)

    return {
      caseName: testCase.caseName,
      problemStatement: testCase.problemStatement,
      structuredAnalysis: {
        overallAssessment: blueprint.overallAssessment,
        primaryRisk: blueprint.primaryRisk,
        strengths: blueprint.selectedStrengths,
        risks: blueprint.selectedRisks,
        recommendationType: blueprint.recommendationType,
        nextFocusType: blueprint.nextFocusType,
        confidenceLevel: blueprint.confidenceLevel,
      },
      deterministicOutput: output,
    }
  })
}

export function logLlmSimulationPayloadsJson() {
  console.log(JSON.stringify(exportLlmSimulationPayloads(), null, 2))
}
