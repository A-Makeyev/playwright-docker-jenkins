pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.55.0-noble'
            args '--ipc=host --user root'
            reuseNode true
        }
    }

    options {
        buildDiscarder(logRotator(
            daysToKeepStr: '30',   // delete builds older than 30 days
            numToKeepStr: '10',    // keep only 10 latest builds
            artifactDaysToKeepStr: '7',  // delete artifacts older than 7 days
            artifactNumToKeepStr: '5'    // keep artifacts only for last 5 builds
        ))
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
                        sh '''
                            export PATH=$BUN_INSTALL/bin:$PATH
                            export HOME=/root
                            bun run test:ui
                        '''
                    }
                }

                stage('API Test') {
                    steps {
                        sh '''
                            export PATH=$BUN_INSTALL/bin:$PATH
                            export HOME=/root
                            bun run test:api
                        '''
                    }
                }
                
                stage('Concurrent Test') {
                    steps {
                        sh '''
                            export PATH=$BUN_INSTALL/bin:$PATH
                            export HOME=/root
                            bun run test --repeat-each=2 --workers=2
                        '''
                    }
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