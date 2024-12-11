pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE = 'docker-compose'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build and Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        
        stage('Stop Previous Stack') {
            steps {
                sh '${DOCKER_COMPOSE} down || true'
            }
        }
        
        stage('Deploy Stack') {
            steps {
                sh '${DOCKER_COMPOSE} up -d'
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    // Esperar a que los servicios estén disponibles
                    sh 'sleep 30'
                    
                    // Verificar aplicación
                    sh 'curl -f http://localhost:3000/health || exit 1'
                    
                    // Verificar Prometheus
                    sh 'curl -f http://localhost:9090/-/healthy || exit 1'
                    
                    // Verificar Grafana
                    sh 'curl -f http://localhost:3001/api/health || exit 1'
                }
            }
        }
    }
    
    post {
        failure {
            sh '${DOCKER_COMPOSE} down'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
    }
}