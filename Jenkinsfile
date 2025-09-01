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
                    apt-get update && apt-get install -y curl unzip
                    curl -fsSL https://bun.sh/install | bash
                    export PATH=$PATH:/root/.bun/bin
                    test -f build/index.html
                    bun install
                    bunx playwright test
                '''
            }

            post {
                always {
                    junit 'test-results/junit.xml'
                }
            }
        }
    }
}