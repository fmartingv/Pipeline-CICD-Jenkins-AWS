# 📚 Documentación Técnica Completa

## 📋 Descripción General del Proyecto
Esta aplicación es una solución CRUD (Create, Read, Update, Delete) diseñada específicamente para la gestión de jugadores de fútbol. El sistema está completamente desplegado en la infraestructura de Amazon Web Services (AWS) y utiliza Jenkins como herramienta principal para implementar prácticas modernas de integración continua y despliegue continuo (CI/CD).

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML**: Estructura semántica moderna
- **CSS**: Estilos responsivos y adaptables
- **JavaScript**: Interactividad del lado del cliente
- **Node.js**: Runtime de JavaScript para el servidor

### Almacenamiento de Datos
- **JSON**: Almacenamiento de datos ligero y flexible
- Sistema de persistencia mediante archivos JSON

### Containerización y Orquestación
- **Docker**: Containerización de la aplicación
- Gestión de contenedores mediante Docker Compose

### Integración Continua y Despliegue
- **Jenkins**: Automatización de CI/CD
- Pipeline configurado para despliegues automáticos
- Integración con GitHub para control de versiones

### Infraestructura Cloud
- **AWS EC2**: Instancia t2.medium

### Monitorización y Logging
- **PM2**: Gestor de procesos de Node.js
- Monitorización en tiempo real

### Herramientas de Gestión
- **Miro**: Diseño y planificación visual
- **Trello**: Gestión ágil del proyecto

## 🚀 Guía de Configuración y Despliegue

### 1. Configuración del Entorno AWS EC2

Crearemos una instancia m2.medium porqu ela t2.micro puede que se nos quede corta a la hora de eejcutar el pipeline en jenkins

#### Configuración de Seguridad
- Abrir puerto 80 (HTTP)
- Abrir puerto 443 (HTTPS)
- Abrir puerto 8080 (Jenkins)

### 2. Instalación y Configuración de Jenkins


#### Jenkins Docker Compose
Con esto podremos ejecutar jenkins en nuestro ec2
```yaml
version: '3.8'
services:
  jenkins:
    image: jenkins/jenkins:lts
    privileged: true
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker
    environment:
      - DOCKER_HOST=unix:///var/run/docker.sock
```

#### Plugins Necesarios
- Docker Pipeline
- Docker

### 3. Configuración del Pipeline

#### Jenkinsfile
Este será el código de nuestro pipeline.
```groovy
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
                    sh 'docker-compose up -d --build'
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
```

### 4. Sistema de Monitorización

#### Script de Monitorización (monitor.sh)
De esta manera una vez este en funcionamiento la app acada 15 segundos nos llegara información sobre nuestar app
```bash
#!/bin/bash
CONTAINER_NAME="pipeline_app_1"
CONTAINER_PORT=3000
while true; do
  # Más información del contenedor
  CONTAINER_STATUS=$(docker ps -f name=$CONTAINER_NAME --format '{{.Status}}')
  CONTAINER_CPU=$(docker stats --no-stream $CONTAINER_NAME --format "{{.CPUPerc}}")
  CONTAINER_MEM=$(docker stats --no-stream $CONTAINER_NAME --format "{{.MemUsage}}")
  
  # Verificar puerto
  PORT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$CONTAINER_PORT || echo "failed")
  
  # Log más detallado
  echo "----------------------------------------"
  echo "$(date)"
  echo "Container Name: $CONTAINER_NAME"
  echo "Status: $CONTAINER_STATUS"
  echo "CPU Usage: $CONTAINER_CPU"
  echo "Memory Usage: $CONTAINER_MEM"
  echo "Port $CONTAINER_PORT Status: $PORT_STATUS"
  echo "----------------------------------------" >> /home/ec2-user/app_metrics.log
  
  sleep 10
done
```

## 📈 Gestión del Proyecto
- **Miro**: Utilizado para el diseño y planificación del proyecto, incluyendo diferentes iteraciones del diseño.
- **Trello**: Gestión de tareas e historias de usuario, incluyendo:
  - Organización de tareas
  - Historias de usuario

## 🧪 Testing
La aplicación incluye pruebas para todas las operaciones CRUD:
- Añadir jugador
- Editar jugador
- Eliminar jugador
- Listar jugadores

## 📹 Demostración
Se incluye un video de 5 minutos que muestra el proceso completo de despliegue utilizando Jenkins.
