pipeline {
    agent any

    environment {
        BUN_IMAGE = 'jarredsumner/bun:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                node {
                    docker.image(env.BUN_IMAGE).inside {
                        sh 'bun install'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                node {
                    docker.image(env.BUN_IMAGE).inside {
                        sh 'bun test'
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                node {
                    docker.image(env.BUN_IMAGE).inside {
                        sh 'bun add allure-cli --global || true'
                        sh 'allure generate allure-results --clean -o allure-report'
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
        }
    }
}
