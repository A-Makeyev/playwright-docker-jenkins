pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.55.0-jammy'  // official Playwright Docker image
            args '-u root'  // run as root so we can install dependencies
        }
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                // Run Playwright tests with JUnit + Allure
                sh 'npx playwright test --reporter=line,junit,allure-playwright'
            }
            post {
                always {
                    // Archive raw results
                    junit 'playwright-report/results.xml'
                    archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
                }
            }
        }

        stage('Allure Report') {
            steps {
                // Generate allure report
                sh 'npx allure generate allure-results --clean -o allure-report || true'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished. Reports generated."
        }
    }
}
