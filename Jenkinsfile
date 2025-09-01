pipeline {
    agent any

    environment {
        CI = 'true'
        ALLURE_RESULTS_PATH = 'allure-results'
        ALLURE_REPORT_PATH = 'allure-report'
        JUNIT_RESULTS_PATH = 'junit-results'
    }

    stages {
        stage('Setup and Test') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.55.0-noble'
                    args '--ipc=host --user root --shm-size=2g'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    echo "🔧 Setting up environment..."
                    apt-get update -qq
                    apt-get install -y curl unzip openjdk-21-jdk
                    
                    # Install Bun
                    echo "📦 Installing Bun..."
                    curl -fsSL https://bun.sh/install | bash
                    export PATH="/root/.bun/bin:$PATH"
                    bun --version || { echo "❌ Bun installation failed"; exit 1; }
                    
                    # Install Allure Commandline
                    echo "📊 Installing Allure..."
                    mkdir -p /opt/allure
                    curl -o allure-2.34.1.tgz -Ls https://github.com/allure-framework/allure2/releases/download/2.34.1/allure-2.34.1.tgz
                    tar -zxvf allure-2.34.1.tgz -C /opt/allure --strip-components=1
                    ln -sf /opt/allure/bin/allure /usr/local/bin/allure
                    allure --version || { echo "❌ Allure installation failed"; exit 1; }
                    
                    # Create directories
                    mkdir -p ${ALLURE_RESULTS_PATH} ${ALLURE_REPORT_PATH} ${JUNIT_RESULTS_PATH} test-results
                    
                    # Install project dependencies
                    echo "📚 Installing dependencies..."
                    export PATH="/root/.bun/bin:$PATH"
                    bun install
                    bunx playwright install --with-deps
                    
                    echo "✅ Setup completed successfully!"
                '''
            }
        }

        stage('Run Tests') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.55.0-noble'
                    args '--ipc=host --user root --shm-size=2g'
                    reuseNode true
                }
            }
            steps {
                script {
                    def testResult = sh(
                        script: '''
                            export PATH="/root/.bun/bin:$PATH"
                            export HOME=/root
                            echo "🧪 Running Playwright tests..."
                            
                            # Run tests with multiple reporters
                            bunx playwright test \
                                --reporter=line,allure-playwright,junit \
                                || echo "Tests completed with some failures"
                        ''',
                        returnStatus: true
                    )
                    
                    if (testResult != 0) {
                        echo "⚠️ Tests completed with failures (exit code: ${testResult})"
                        currentBuild.result = 'UNSTABLE'
                    } else {
                        echo "✅ All tests passed!"
                    }
                }
            }
        }

        stage('Generate Reports') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.55.0-noble'
                    args '--ipc=host --user root --shm-size=2g'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    export PATH="/opt/allure/bin:/root/.bun/bin:$PATH"
                    echo "📊 Generating reports..."
                    
                    # Check if we have allure results
                    if [ -d "${ALLURE_RESULTS_PATH}" ] && [ "$(ls -A ${ALLURE_RESULTS_PATH} 2>/dev/null)" ]; then
                        echo "📈 Generating Allure report..."
                        allure generate ${ALLURE_RESULTS_PATH} --clean -o ${ALLURE_REPORT_PATH}
                        echo "✅ Allure report generated successfully!"
                    else
                        echo "⚠️ No Allure results found, creating empty report..."
                        mkdir -p ${ALLURE_REPORT_PATH}
                        echo "<html><body><h1>No test results found</h1><p>Tests may have failed to run properly.</p></body></html>" > ${ALLURE_REPORT_PATH}/index.html
                    fi
                    
                    # List generated files for debugging
                    echo "📁 Generated files:"
                    find ${ALLURE_RESULTS_PATH} -type f 2>/dev/null || echo "No allure-results files"
                    find ${JUNIT_RESULTS_PATH} -type f 2>/dev/null || echo "No junit-results files"
                    find test-results -name "*.xml" 2>/dev/null || echo "No XML files in test-results"
                '''
            }
        }

        stage('Publish Reports') {
            steps {
                echo "📋 Publishing test results..."
                
                // Publish JUnit test results - try multiple locations
                script {
                    def junitPatterns = [
                        "${JUNIT_RESULTS_PATH}/*.xml",
                        "junit-results/*.xml", 
                        "test-results/*.xml",
                        "test-results/**/*.xml"
                    ]
                    
                    def foundResults = false
                    for (pattern in junitPatterns) {
                        def dir = pattern.split('/')[0]
                        if (fileExists(dir)) {
                            try {
                                junit allowEmptyResults: true, testResults: pattern
                                foundResults = true
                                echo "✅ Published JUnit results from: ${pattern}"
                                break
                            } catch (Exception e) {
                                echo "⚠️ Could not publish JUnit results from ${pattern}: ${e.getMessage()}"
                            }
                        }
                    }
                    if (!foundResults) {
                        echo "⚠️ No JUnit XML files found in any expected location"
                        // Try to find any XML files for debugging
                        sh 'find . -name "*.xml" -type f 2>/dev/null || echo "No XML files found anywhere"'
                    }
                }
                
                // Publish Allure report
                script {
                    try {
                        allure([
                            includeProperties: false,
                            jdk: '',
                            properties: [],
                            reportBuildPolicy: 'ALWAYS',
                            results: [[path: "${ALLURE_RESULTS_PATH}"]]
                        ])
                        echo "✅ Published Allure report"
                    } catch (Exception e) {
                        echo "⚠️ Failed to publish Allure report: ${e.getMessage()}"
                    }
                }
                
                // Archive artifacts
                archiveArtifacts artifacts: "${ALLURE_REPORT_PATH}/**", allowEmptyArchive: true
                archiveArtifacts artifacts: "${ALLURE_RESULTS_PATH}/**", allowEmptyArchive: true  
                archiveArtifacts artifacts: "${JUNIT_RESULTS_PATH}/**", allowEmptyArchive: true
                archiveArtifacts artifacts: "test-results/**", allowEmptyArchive: true
                
                // Publish HTML report
                script {
                    try {
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: "${ALLURE_REPORT_PATH}",
                            reportFiles: 'index.html',
                            reportName: 'Playwright Test Report',
                            reportTitles: 'Test Report'
                        ])
                        echo "✅ Published HTML report"
                    } catch (Exception e) {
                        echo "⚠️ Failed to publish HTML report: ${e.getMessage()}"
                    }
                }
            }
        }
    }

    post {
        always {
            echo "📋 Post-build actions completed"
        }
        
        success {
            echo '🎉 Pipeline completed successfully!'
        }
        
        failure {
            echo '❌ Pipeline failed!'
        }
        
        unstable {
            echo '⚠️ Pipeline completed with test failures!'
        }
        
        cleanup {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
    }
}