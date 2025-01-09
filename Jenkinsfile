pipeline {
    agent any
    environment {
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
                    // Despliega usando solo el docker-compose del proyecto
                    sh 'docker-compose up -d --build'
                    // Verificar despliegue
                    sh 'docker-compose ps'
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
                sh 'docker-compose logs'
                sh 'docker-compose down'
            }
        }
        always {
            cleanWs()
        }
    }
}
