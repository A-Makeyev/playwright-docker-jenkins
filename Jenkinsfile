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
        ALLURE_HOME = "/opt/allure"
    }

    stages {
        stage('Setup') {
            steps {
                sh '''
                    apt-get update
                    apt-get install -y curl unzip openjdk-21-jdk
                    
                    # Install Bun
                    curl -fsSL https://bun.sh/install | bash
                    export PATH=$BUN_INSTALL/bin:$PATH
                    bun --version || { echo "Bun not found"; exit 1; }
                    
                    # Install Allure Commandline
                    mkdir -p /opt/allure
                    curl -o allure-2.34.1.tgz -Ls https://github.com/allure-framework/allure2/releases/download/2.34.1/allure-2.34.1.tgz
                    tar -zxvf allure-2.34.1.tgz -C /opt/allure --strip-components=1
                    ln -sf /opt/allure/bin/allure /usr/local/bin/allure
                    
                    # Install project dependencies
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
                    # Run tests with Allure reporter
                    bunx playwright test --reporter=line,allure-playwright
                '''
            }
        }

        stage('Report') {
            steps {
                sh '''
                    export PATH=/opt/allure/bin:$BUN_INSTALL/bin:$PATH
                    # Generate Allure report
                    allure generate allure-results --clean -o allure-report
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results/*.xml'
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            archiveArtifacts artifacts: 'allure-report/**/*', allowEmptyArchive: true
        }
        cleanup {
            cleanWs()
        }
    }
}