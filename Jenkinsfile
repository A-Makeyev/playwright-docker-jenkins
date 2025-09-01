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
                    echo "Starting setup stage..."
                    apt-get update
                    apt-get install -y curl unzip openjdk-21-jdk
                    curl -fsSL https://bun.sh/install | bash
                    export PATH=$BUN_INSTALL/bin:$PATH
                    bun --version || { echo "Bun not found"; exit 1; }
                    bun install
                    bunx playwright install --with-deps
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    export PATH=$BUN_INSTALL/bin:$PATH
                    export HOME=/root
                    bunx playwright test
                '''
            }
        }

        stage('Report') {
            steps {
                sh '''
                    export PATH=$BUN_INSTALL/bin:$PATH
                    export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
                    export PATH=$JAVA_HOME/bin:$PATH
                    bun --version
                    bun report:generate || true
                '''
            }
        }
    }

    post {
        always {
            // Wrap junit and archiveArtifacts in a node block
            node('') {
                junit allowEmptyResults: true, testResults: 'junit-results/results.xml' // Corrected path to match Playwright config
                archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
            }
        }
        cleanup {
            // Wrap cleanWs in a node block
            node('') {
                cleanWs()
            }
        }
    }
}