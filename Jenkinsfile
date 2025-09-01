pipeline {
    agent any

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }

            steps {
                sh '''
                    echo "Node version: $(node --version)"
                    echo "NPM version: $(npm --version)"

                    # Example build (replace with real build commands if needed)
                    mkdir -p build
                    echo "<html><body>Build output</body></html>" > build/index.html
                '''
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.55.0-noble'
                    reuseNode true
                    args '--ipc=host --user root'
                }
            }

            environment {
                CI = 'true'
                PATH = "/root/.bun/bin:${env.PATH}"
                ALLURE_RESULTS_DIR = 'allure-results'
                ALLURE_REPORT_DIR = 'allure-report'
            }

            steps {
                script {
                    sh '''
                        echo "CI variable: $CI"
                        ls -la

                        # Install system dependencies for Playwright + Allure
                        apt-get update && apt-get install -y curl unzip openjdk-11-jre git

                        # Install Bun if not already installed
                        if [ ! -f "/root/.bun/bin/bun" ]; then
                          curl -fsSL https://bun.sh/install | bash
                        fi
                        export PATH="/root/.bun/bin:$PATH"
                        bun --version

                        # Ensure build exists (skip if not needed)
                        test -f build/index.html || true

                        # Install project dependencies
                        bun install

                        # Install Playwright browsers with dependencies
                        bunx playwright install --with-deps

                        # Run tests
                        bunx playwright test || true

                        # Generate Allure report
                        bunx allure generate $ALLURE_RESULTS_DIR --clean -o $ALLURE_REPORT_DIR || true
                    '''
                }
            }

            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test-results/results.xml'
                    archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
                }
                failure {
                    echo "Some tests failed, check Allure report for details."
                }
            }
        }
    }
}
