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
        
        stage('Build and Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    # Parar y eliminar contenedores existentes
                    docker-compose -f ${DOCKER_COMPOSE_FILE} down || true
                    # Eliminar imágenes antiguas
                    docker-compose -f ${DOCKER_COMPOSE_FILE} rm -f || true
                    # Construir y levantar nuevos contenedores
                    docker-compose -f ${DOCKER_COMPOSE_FILE} up -d --build
                '''
            }
        }
    }
    
    post {
        always {
            script {
                sh '''
                    echo "Collecting container logs for debugging..."
                    docker-compose -f ${DOCKER_COMPOSE_FILE} logs app || true
                    docker-compose -f ${DOCKER_COMPOSE_FILE} down || true
                '''
            }
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
    }
}