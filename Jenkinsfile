pipeline {
    agent {
        docker {
            image 'custom-playwright:latest'
            args '--user root'  // Use root to avoid permission issues with DinD
            registryUrl ''  // Local image
            alwaysPull false
        }
    }
    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t custom-playwright:latest .'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'bunx playwright test'  // Runs all tests per your config
            }
        }
        stage('Generate Allure Report') {
            steps {
                sh 'bunx allure generate allure-results --clean -o allure-report'
            }
        }
    }
    post {
        always {
            allure includeProperties: false, jdk: '', results: [[path: 'allure-report']]  // Publishes report
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true  // Archives for download
        }
    }
}