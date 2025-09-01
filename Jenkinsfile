pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:bionic' // Official Playwright Docker image
            args '-u root:root' // run as root inside container
        }
    }

    environment {
        CI = 'true'
        ALLURE_RESULTS_DIR = 'allure-results'
        ALLURE_REPORT_DIR = 'allure-report'
        PATH = "${env.HOME}/.bun/bin:${env.PATH}"
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Bun & Dependencies') {
            steps {
                ansiColor('xterm') {
                    sh '''
                        # Install Bun
                        if [ ! -f "$HOME/.bun/bin/bun" ]; then
                          curl -fsSL https://bun.sh/install | bash
                        fi
                        export PATH="$HOME/.bun/bin:$PATH"

                        # Install project dependencies
                        bun install

                        # Install Playwright browsers
                        bunx playwright install
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                ansiColor('xterm') {
                    sh '''
                        export PATH="$HOME/.bun/bin:$PATH"
                        bunx playwright test
                    '''
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                ansiColor('xterm') {
                    sh '''
                        export PATH="$HOME/.bun/bin:$PATH"
                        mkdir -p $ALLURE_RESULTS_DIR
                        bunx allure generate $ALLURE_RESULTS_DIR --clean -o $ALLURE_REPORT_DIR
                    '''
                }
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
