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
                    bun --version
                    bun install
                    bunx playwright install --with-deps
                    # Install Allure Commandline
                    curl -L https://repo.maven.apache.org/maven2/io/qameta/allure/allure-commandline/2.32.0/allure-commandline-2.32.0.zip -o allure.zip
                    unzip allure.zip -d /opt
                    rm allure.zip
                    export PATH=$PATH:/opt/allure-2.32.0/bin
                    allure --version
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    export PATH=$BUN_INSTALL/bin:$PATH:/opt/allure-2.32.0/bin
                    export HOME=/root
                    bunx playwright test --reporter=line,allure-playwright,junit
                    # Fix permissions for Allure plugin access
                    chmod -R 777 allure-results
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