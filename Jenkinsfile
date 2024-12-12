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
        
        stage('Stop Previous Stack') {
            steps {
                script {
                    sh '''
                        if [ -x "$(command -v docker-compose)" ]; then
                            docker-compose -f ${DOCKER_COMPOSE_FILE} down || true
                        else
                            echo "Docker Compose not found, installing..."
                            curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                            chmod +x /usr/local/bin/docker-compose
                            docker-compose -f ${DOCKER_COMPOSE_FILE} down || true
                        fi
                    '''
                }
            }
        }
        
        stage('Deploy Stack') {
    steps {
        sh '''
            # Verify prometheus.yml exists and set permissions
            ls -la prometheus.yml
            chmod 644 prometheus.yml
            
            # Deploy stack
            docker-compose -f ${DOCKER_COMPOSE_FILE} up -d
        '''
    }
}
        
        stage('Health Check') {
            steps {
                script {
                    sh '''
                        sleep 30
                        set +e
                        curl -f http://localhost:3000/health || echo "App health check failed"
                        curl -f http://localhost:9090/-/healthy || echo "Prometheus health check failed"
                        curl -f http://localhost:3001/api/health || echo "Grafana health check failed"
                    '''
                }
            }
        }
    }
    
    post {
        failure {
            script {
                sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} down || true'
            }
            echo 'Pipeline failed. Check logs for details.'
        }
        
        success {
            echo 'Pipeline completed successfully!'
        }
    }
}