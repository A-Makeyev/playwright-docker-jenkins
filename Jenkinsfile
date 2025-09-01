pipeline {
    agent {
        // Specify a Docker agent using an official Playwright image that includes browsers and Node.js
        // Choose a tag that corresponds to your Playwright version
        docker {
            image 'mcr.microsoft.com/playwright:v1.49.1' // Example version; replace with your version
        }
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies with Bun') {
            steps {
                // Installs project dependencies using Bun
                sh 'bun install --frozen-lockfile'
            }
        }

        stage('Run Playwright Tests with Bun') {
            steps {
                script {
                    // Use 'catchError' to ensure report generation continues even if tests fail
                    catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                        // Use bunx to run Playwright tests
                        sh 'bunx playwright test'
                    }
                }
            }
        }

        stage('Publish Reports') {
            steps {
                // Publish JUnit report
                junit 'junit-report.xml'

                // Generate and publish Allure report
                allure([
                    includeProperties: false,
                    reportBuildPolicy: 'ALWAYS',
                    results: [[path: 'allure-results']],
                ])
            }
        }
    }

    post {
        always {
            echo "Build finished. Archiving reports."
            archiveArtifacts artifacts: 'allure-report/**', fingerprint: true
            archiveArtifacts artifacts: 'junit-report.xml', fingerprint: true
        }
    }
}
