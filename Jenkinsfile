pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.55.0-jammy'  // Playwright official image
            args '-u root'
        }
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Install') {
            steps {
                // Install project dependencies
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                // Run Playwright tests with both JUnit + Allure reporters
                sh 'npx playwright test --reporter=line,junit,allure-playwright'
            }
            post {
                always {
                    // Collect JUnit results so Jenkins can parse them
                    junit 'playwright-report/results.xml'
                    
                    // Save allure results for later report generation
                    archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
                }
            }
        }

        stage('Allure Report') {
            steps {
                // Generate the HTML report inside Jenkins workspace
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
            echo "✅ Pipeline finished. Check JUnit + Allure reports in Jenkins."
        }
    }
}
