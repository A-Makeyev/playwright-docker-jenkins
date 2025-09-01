pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.55.0-noble'
            args '--ipc=host --user root'
            reuseNode true
        }
    }

    stages {
        stage('Setup') {
            steps {
                sh '''
                    apt-get update
                    apt-get install -y curl openjdk-21-jdk
                    npm install
                    npx playwright install --with-deps
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    npx playwright test --reporter=line,allure-playwright,junit
                    chmod -R 777 allure-results
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results/results.xml'
            allure results: [[path: 'allure-results']]
            archiveArtifacts artifacts: 'allure-results/**,test-results/**', allowEmptyArchive: true
        }
        cleanup {
            cleanWs()
        }
    }
}