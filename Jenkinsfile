pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.55.0-noble'
            args '--ipc=host --user 1000:1000' // Adjust to Jenkins user ID (e.g., 1000:1000)
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
        stage('Checkout') {
            steps {
                checkout scm 
            }
        }

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
                        sh '''
                            export PATH=$BUN_INSTALL/bin:$PATH
                            export HOME=/root
                            bun run test:ui || { echo "UI tests failed"; exit 1; }
                        '''
                    }
                }

                stage('API Test') {
                    steps {
                        sh '''
                            export PATH=$BUN_INSTALL/bin:$PATH
                            export HOME=/root
                            bun run test:api || { echo "API tests failed"; exit 1; }
                        '''
                    }
                }
                
                stage('Concurrent Test') {
                    steps {
                        sh '''
                            export PATH=$BUN_INSTALL/bin:$PATH
                            export HOME=/root
                            bun run test --repeat-each=2 --workers=2 || { echo "Concurrent tests failed"; exit 1; }
                        '''
                    }
                }
            }
            post {
                always {
                    sh '''
                        echo "Workspace: $WORKSPACE"
                        ls -l test-results/ || echo "No test-results directory found"
                    '''
                }
            }
        }

        stage('Report') {
            steps {
                sh '''
                    export PATH=$BUN_INSTALL/bin:$PATH
                    bun --version || { echo "Bun not found"; exit 1; }
                    bunx allure generate allure-results --clean -o allure-report || true
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, skipPublishingChecks: true, testResults: 'test-results/*.xml'
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
        }
        cleanup {
            cleanWs()
        }
    }
}