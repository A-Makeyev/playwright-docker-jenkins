pipeline {
    agent {
        docker {
            image 'custom-playwright:latest'
            args '--user root -v /var/run/docker.sock:/var/run/docker.sock' 
            registryUrl '' 
            alwaysPull false
        }
    }
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build('custom-playwright:latest', '.')
                }
            }
        }
        stage('Run Tests') {
            steps {
                sh 'bunx playwright test' 
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
            allure includeProperties: false, jdk: '', results: [[path: 'allure-report']]  
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true 
        }
    }
}