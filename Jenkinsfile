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
                '''
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.55.0-noble'
                    reuseNode true
                    args '--ipc=host'
                }
            }

            steps {
                sh '''
                    apt-get update && apt-get install -y curl unzip openjdk-11-jre
                    curl -fsSL https://bun.sh/install | bash
                    export PATH=$PATH:/root/.bun/bin
                    test -f build/index.html
                    bun install
                    bunx playwright install --with-deps
                    bun test
                    bun report:generate
                '''
            }

            post {
                always {
                    junit 'test-results/results.xml'
                    archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
                }
            }
        }
    }
}