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
                    
                    # Install required packages
                    apt-get update
                    apt-get install -y curl unzip openjdk-21-jdk
                    curl -fsSL https://bun.sh/install | bash
                    export PATH=$BUN_INSTALL/bin:$PATH
                    bun --version || { echo "Bun not found"; exit 1; }
                    
                    # Install dependencies
                    bun install
                    bunx playwright install --with-deps

                    # Fix workspace permissions for Jenkins
                    chown -R jenkins:jenkins $WORKSPACE
                    chmod -R 775 $WORKSPACE
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
                    # Set Java home for Allure
                    export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))
                    export PATH=$JAVA_HOME/bin:$BUN_INSTALL/bin:$PATH

                    # Generate Allure report
                    bun report:generate || true

                    # Fix permissions so Jenkins can read the report
                    chown -R jenkins:jenkins allure-report allure-results
                    chmod -R 775 allure-report allure-results
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results/results.xml'
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true

            // Optional: clean workspace
            cleanWs()
        }
    }
}
