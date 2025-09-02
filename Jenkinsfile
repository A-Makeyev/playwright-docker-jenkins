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
            artifactNumToKeepStr: '5',
            numToKeepStr: '5'
        ))
    }

    environment {
        CI = 'true'
        HOME = "${WORKSPACE}"
        BUN_INSTALL = "/root/.bun"
        PATH = "${BUN_INSTALL}/bin:${PATH}"
    }

    stages {
        stage('Build') {
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

        stage('Test') {
            parallel {
                stage('Client') {
                    steps {
                        sh '''
                            export PATH=$BUN_INSTALL/bin:$PATH
                            export HOME=/root
                            bun run test
                        '''
                    }
                }

                // stage('Server') {
                //     steps {
                //         sh '''
                //             export PATH=$BUN_INSTALL/bin:$PATH
                //             export HOME=/root
                //             bun run test:api
                //         '''
                //     }
                // }   

                // stage('Concurrent') {
                //     steps {
                //         sh '''
                //             export PATH=$BUN_INSTALL/bin:$PATH
                //             export HOME=/root
                //             bun run test --workers=5
                //         '''
                //     }
                // }
            }
        }

        stage('Report') {
            steps {
                sh '''
                    export PATH=$BUN_INSTALL/bin:$PATH
                    bun --version || { echo "Bun not found"; exit 1; }
                    bun run report:generate
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