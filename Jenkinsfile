pipeline {
    agent any

    triggers {
            githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/stamp-web/stamp-plateflaw-browser.git',
                        credentialsId: 'jadrake-github'
                    ]]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Notify Trigger') {
            steps {
                sh 'echo "${JOB_NAME} ${BUILD_ID}" > /tmp/build-stampweb-pf-browser.trigger'
            }
        }
    }

    post {
        success {
            // archive build outputs if needed
            archiveArtifacts artifacts: 'dist/**', fingerprint: true
        }
    }
}