pipeline {
    agent {
        docker {
            image 'jarredsumner/bun:latest'
            args '-u root:root'
        }
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'bun install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'bun run test'
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh 'bun run allure generate allure-results --clean -o allure-report'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'allure-report/**', fingerprint: true
        }
    }
}
