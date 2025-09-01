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
                    apt-get install -y curl unzip openjdk-17-jre  # install Java for Allure
                    curl -fsSL https://bun.sh/install | bash
                    export PATH=$BUN_INSTALL/bin:$PATH
                    bun --version || { echo "Bun not found"; exit 1; }
                    bun install
                    npx playwright install --with-deps
                    echo "Setup completed."
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    echo "Starting test stage..."
                    export PATH=$BUN_INSTALL/bin:$PATH
                    export HOME=/root
                    # Run Playwright tests and generate Allure + JUnit results
                    npx playwright test --reporter=line,allure-playwright,junit
                    echo "Tests completed."
                '''
            }
        }

        stage('Report') {
            steps {
                sh '''
                    echo "Starting report stage..."
                    export PATH=$BUN_INSTALL/bin:$PATH
                    bun --version || { echo "Bun not found"; exit 1; }

                    # Generate Allure report (requires Java, installed in Setup stage)
                    npx allure generate allure-results --clean -o allure-report || true

                    echo "Report generation completed."
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results/results.xml'
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
        }
        cleanup {
            cleanWs()
        }
    }
}
