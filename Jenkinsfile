pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.jenkins.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose -f ${COMPOSE_FILE} build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose -f ${COMPOSE_FILE} up -d --remove-orphans'
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded — app running on port 4000'
        }
        failure {
            sh 'docker compose -f ${COMPOSE_FILE} logs --tail=50'
        }
    }
}
