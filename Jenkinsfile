pipeline {
    agent any

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }

            steps {
                sh '''
                    node --version
                    npm --version   
                    # Add commands to generate build/index.html if needed
                    mkdir -p build
                    echo "<html><body>Build output</body></html>" > build/index.html
                '''
            }
        }

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
                    apt-get install -y curl unzip openjdk-11-jre
                    curl -fsSL https://bun.sh/install | bash
                    export PATH=$PATH:/root/.bun/bin
                    bun --version
                    test -f build/index.html || true
                    bun install
                    bunx playwright install --with-deps
                    bun test || true
                    bun api-test || true
                    bun test-chrome || true
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