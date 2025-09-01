pipeline {
    agent any

    environment {
        // Path to store Allure results
        ALLURE_RESULTS = 'allure-results'
        ALLURE_REPORT = 'allure-report'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build') {
            steps {
                sh '''
                docker run --rm -v $PWD:/app -w /app node:18-alpine sh -c "
                    bun install
                "
                '''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh '''
                docker run --rm -v $PWD:/app -w /app mcr.microsoft.com/playwright:v1.55.0-noble sh -c "
                    bunx playwright install --with-deps &&
                    mkdir -p $ALLURE_RESULTS &&
                    bunx playwright test --reporter=list,allure-playwright --output=$ALLURE_RESULTS
                "
                '''
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh '''
                docker run --rm -v $PWD:/app -w /app quay.io/allure/allure:2.21.0 sh -c "
                    allure generate $ALLURE_RESULTS --clean -o $ALLURE_REPORT
                "
                '''
            }
        }

        stage('Publish Allure Report') {
            steps {
                allure includeProperties: false, jdk: '', results: [[path: '$ALLURE_RESULTS']]
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '$ALLURE_REPORT/**', allowEmptyArchive: true
        }
    }
}
