pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.55.0-noble'
            args '--ipc=host --user root'  // Keep root for now, but we'll fix permissions
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
                    apt-get install -y curl unzip openjdk-21-jdk
                    curl -fsSL https://bun.sh/install | bash
                    export PATH=$BUN_INSTALL/bin:$PATH
                    bun --version
                    bun install
                    bunx playwright install --with-deps
                    # Fix permissions for the workspace
                    chmod -R u+rwX "${WORKSPACE}"
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    export PATH=$BUN_INSTALL/bin:$PATH
                    export HOME=/root
                    bunx playwright test --reporter=line,allure-playwright,junit
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results/results.xml'
            allure results: [[path: 'allure-results']]
            archiveArtifacts artifacts: 'allure-results/**', allowEmptyArchive: true
        }
        cleanup {
            cleanWs()
        }
    }
}