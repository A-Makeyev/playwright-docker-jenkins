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
                    export HOME=${WORKSPACE}
                    bunx playwright test
                    ls -la ${WORKSPACE}/junit-results || echo "junit-results not found"
                '''
            }
        }

        stage('Report') {
            steps {
                sh '''
                    export PATH=$BUN_INSTALL/bin:$PATH
                    export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
                    export PATH=$JAVA_HOME/bin:$PATH
                    bun report:generate
                    ls -la ${WORKSPACE}/allure-report || echo "allure-report not found"
                '''
            }
        }
    }

    post {
        always {
            node('') {
                junit allowEmptyResults: true, testResults: 'junit-results/results.xml'
                archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
            }
        }
        cleanup {
            node('') {
                cleanWs()
            }
        }
    }
}