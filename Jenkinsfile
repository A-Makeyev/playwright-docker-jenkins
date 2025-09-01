pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.55.0-noble'
            args '--ipc=host --user root'
            reuseNode true
        }
    }

    environment {
        CI = 'true'
        HOME = "${WORKSPACE}"
        BUN_INSTALL = "/root/.bun"
        PATH = "${BUN_INSTALL}/bin:${PATH}"
    }

    stages {
        stage('Setup') {
            steps {
                sh '''
                    apt-get update
                    apt-get install -y curl unzip openjdk-17-jre
                    curl -fsSL https://bun.sh/install | bash
                    export PATH=$BUN_INSTALL/bin:$PATH
                    bun --version || { echo "Bun not found"; exit 1; }
                    bun install
                    bunx playwright install --with-deps
                '''
            }
        }

        stage('Run Tests') {
            parallel {
                stage('UI Test') {
                    steps {
                        sh 'bun run test:ui'
                    }
                }
                stage('API Test') {
                    steps {
                        sh 'bun run test:api'
                    }
                }
                stage('Concurrent Test') {
                    steps {
                        sh 'bun run test --repeat-each=2 --workers=2'
                    }
                }
            }
        }

        stage('Report') {
            steps {
                sh '''
                    bun --version || { echo "Bun not found"; exit 1; }
                    bunx allure generate allure-results --clean -o allure-report || true
                '''
            }
        }
    }

    post {
        always {
            node {
                junit allowEmptyResults: true, testResults: 'test-results/results.xml'
                archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
            }
        }
        cleanup {
            node {
                cleanWs()
                sh 'docker rm -f $(docker ps -aq -f "ancestor=mcr.microsoft.com/playwright:v1.55.0-noble") || true'
            }
        }
    }
}