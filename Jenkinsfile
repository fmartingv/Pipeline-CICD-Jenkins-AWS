pipeline {
    agent {
        docker {
            image 'node:latest'
            args '-v /var/run/docker.sock:/var/run/docker.sock -v /usr/local/bin/docker-compose:/usr/local/bin/docker-compose'
        }
    }
    environment {
        DOCKER_COMPOSE = 'docker-compose'
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }
    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/fmartingv/Final_Automatizaci-n',
                    credentialsId: 'github-access-token',
                    branch: 'main'
                )
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t players-app .'
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // Stop and remove existing containers
                    sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} down || true'
                    // Deploy new containers
                    sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} up -d --build'
                    // Verify deployment
                    sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} ps'
                }
            }
        }
    }
    post {
        success {
            echo 'Pipeline completado con éxito'
        }
        failure {
            echo 'Pipeline falló'
            script {
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} logs'
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} down'
            }
        }
        always {
            cleanWs()
        }
    }
}