pipeline {
    agent {
        docker {
            image 'your-custom-image:tag' // Replace with 'mcr.microsoft.com/playwright:v1.55.0-noble' if not using a custom image
            args '--ipc=host --user root -v bun-cache:/root/.bun -v node-modules:/workspace/node_modules'
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
                    if [ ! -d "$BUN_INSTALL" ]; then
                        apt-get update
                        apt-get install -y curl unzip openjdk-17-jre
                        curl -fsSL https://bun.sh/install | bash
                    fi
                    bun --version || { echo "Bun not found"; exit 1; }
                    if [ ! -d "node_modules" ]; then
                        bun install
                        bunx playwright install --with-deps
                    fi
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
                    bunx allure generate allure-results --clean -o allure-report || { echo "Allure report generation failed"; exit 0; }
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
                sh 'docker rm -f $(docker ps -aq -f "ancestor=your-custom-image:tag") || true' // Replace image name if needed
            }
        }
    }
}