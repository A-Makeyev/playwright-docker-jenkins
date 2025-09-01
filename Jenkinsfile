pipeline {
    agent any

    stages {
        stage('Test') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.55.0-noble'
                    reuseNode true
                    args '--ipc=host --user root'
                }
            }

            environment {
                CI = 'true'
            }

            steps {
                sh '''
                    echo "CI variable: $CI"
                    ls -la
                    apt-get update
                    apt-get install -y openjdk-11-jre
                    npm install -g bun
                    bun --version
                    bun install
                    bunx playwright install --with-deps
                    bun test || true
                    bun report:generate || true
                '''
            }

            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test-results/results.xml'
                    archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
                }
            }
        }
    }
}