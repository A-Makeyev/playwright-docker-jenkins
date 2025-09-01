pipeline {
    agent any

    tools {
        // Use the Node.js tool name you configured in Jenkins
        nodejs 'NodeJS 18' 
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                script {
                    // Use 'catchError' to ensure report generation continues even if tests fail
                    catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                        // Use your defined script for running all tests
                        sh 'npm run test'
                    }
                }
            }
        }

        stage('Publish Reports') {
            steps {
                // Publish JUnit report first for quick test result visibility
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
            // Archive the generated reports for later access
            archiveArtifacts artifacts: 'allure-report/**', fingerprint: true
            archiveArtifacts artifacts: 'junit-report.xml', fingerprint: true
        }
    }
}
