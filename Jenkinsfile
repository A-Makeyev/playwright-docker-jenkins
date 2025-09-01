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
                    bun --version || { echo "Bun installation failed"; exit 1; }
                    bun install
                    bunx playwright install --with-deps
                    echo "Workspace contents after setup:"
                    ls -la ${WORKSPACE}
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    export PATH=$BUN_INSTALL/bin:$PATH
                    export HOME=${WORKSPACE}
                    echo "Running Playwright tests..."
                    bunx playwright test || { echo "Playwright tests failed"; exit 1; }
                    echo "Workspace contents after tests:"
                    ls -la ${WORKSPACE}
                    echo "Checking JUnit results:"
                    ls -la ${WORKSPACE}/junit-results || echo "junit-results directory not found"
                    ls -la ${WORKSPACE}/junit-results/results.xml || echo "junit-results/results.xml not found"
                    echo "Checking Allure results:"
                    ls -la ${WORKSPACE}/allure-results || echo "allure-results directory not found"
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
                    echo "Generating Allure report..."
                    bun report:generate
                    echo "Allure report contents:"
                    ls -la ${WORKSPACE}/allure-report || echo "allure-report directory not found"
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