pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:bionic' // Official Playwright image
            args '-u root:root' // optional, run as root inside container
        }
    }

    environment {
        CI = 'true' // so headless: !!process.env.CI works
        ALLURE_RESULTS_DIR = 'allure-results'
        ALLURE_REPORT_DIR = 'allure-report'
    }

    options {
        timestamps()
        ansiColor('xterm')
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Bun & Dependencies') {
            steps {
                sh '''
                    curl -fsSL https://bun.sh/install | bash
                    export PATH="$HOME/.bun/bin:$PATH"
                    bun install
                    bunx playwright install
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    export PATH="$HOME/.bun/bin:$PATH"
                    bunx playwright test
                '''
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh '''
                    export PATH="$HOME/.bun/bin:$PATH"
                    mkdir -p $ALLURE_RESULTS_DIR
                    bunx allure generate $ALLURE_RESULTS_DIR --clean -o $ALLURE_REPORT_DIR
                '''
            }
        }

        stage('Publish Allure Report') {
            steps {
                allure includeProperties: false, jdk: '', results: [[path: "$ALLURE_RESULTS_DIR"]]
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
            junit 'test-results/**/*.xml'
        }
        failure {
            echo 'Tests failed!'
        }
    }
}