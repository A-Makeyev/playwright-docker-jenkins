pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.55.0-noble'
            args '--ipc=host --user root'
            reuseNode true
        }
    }

    environment {
        CI = 'true'
        HOME = "${WORKSPACE}"
        BUN_INSTALL = "/root/.bun"
        JAVA_HOME = "/usr/lib/jvm/java-21-openjdk-amd64"
        PATH = "${BUN_INSTALL}/bin:${JAVA_HOME}/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
    }

    stages {
        stage('Setup') {
            steps {
                sh '''
                    echo "Starting setup stage..."
                    apt-get update
                    apt-get install -y curl unzip openjdk-21-jdk xz-utils tar
                    curl -fsSL https://bun.sh/install | bash -s -- --yes
                    export PATH=$BUN_INSTALL/bin:$JAVA_HOME/bin:$PATH
                    bun --version || { echo "Bun not found"; exit 1; }
                    bun install
                    bunx playwright install --with-deps
                    mkdir -p allure-results allure-report
                    chmod -R 777 allure-results allure-report
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    export PATH=$BUN_INSTALL/bin:$JAVA_HOME/bin:$PATH
                    export HOME=/root
                    bunx playwright test || true
                '''
            }
        }

        stage('Report') {
            steps {
                sh '''
                    export PATH=$BUN_INSTALL/bin:$JAVA_HOME/bin:$PATH
                    bun --version
                    java -version
                    bun report:generate || true
                    chmod -R 777 allure-results allure-report
                '''
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results/results.xml'
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
        }
        cleanup {
            cleanWs()
        }
    }
}
