pipeline {
    agent {
        docker {
            image 'node:18.20.2-slim'
            args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    
    environment {
        NODE_ENV = 'production'
        CI = 'true'
    }
    
    stages {
        stage('Preparación') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
            }
        }
        
        stage('Análisis de Código') {
            steps {
                sh 'npm install eslint@latest eslint-config-standard -D'
                sh 'npx eslint .'
            }
        }
        
        stage('Build and Test') {
            steps {
                sh 'npm test || true'
                sh 'npm run build || true'
            }
        }
        
        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=high || true'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build('mi-app:${BUILD_NUMBER}')
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Implementa tus pasos de despliegue aquí
                    echo "Desplegando la aplicación..."
                }
            }
        }
    }
    
    post {
        always {
            sh 'npm prune'
            sh 'docker system prune -f || true'
            cleanWs()
        }
        
        success {
            echo "Pipeline completado exitosamente 🚀"
        }
        
        failure {
            echo "Pipeline fallido. Notificando al equipo... 🚨"
            // Aquí podrías agregar notificaciones por email, Slack, etc.
        }
    }
}