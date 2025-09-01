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
        JAVA_HOME = "/usr/lib/jvm/java-21-openjdk-amd64"
        PATH = "${JAVA_HOME}/bin:${PATH}"
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
                    export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
                    bunx playwright test
                '''
            }
        }

        stage('Report') {
            steps {
                sh '''
                    export PATH=$BUN_INSTALL/bin:$PATH
                    export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
                    bun report:generate || true
                '''
            }
        }
    }

    post {
        always {
            // Archive HTML report so you can download
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
            // Publish Allure report in Jenkins UI (requires Allure Jenkins Plugin)
            allure includeProperties: false, 
                   jdk: '', 
                   results: [[path: 'allure-results']]
            junit allowEmptyResults: true, testResults: 'test-results/results.xml'
        }
        cleanup {
            cleanWs()
        }
    }
}
