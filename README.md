# Aplicación CRUD de Fútbol - Documentación 

## 📋 Descripción
Aplicación CRUD (Create, Read, Update, Delete) que permite gestionar una lista de jugadores de fútbol. La aplicación está desplegada en AWS y utiliza Jenkins para la integración continua y despliegue continuo (CI/CD).

## 🛠️ Tecnologías Utilizadas
- Frontend: HTML, CSS, JavaScript
- Base de datos: JSON
- Contenedorización: Docker
- CI/CD: Jenkins
- Cloud: AWS EC2
- Monitorización: PM2
- Gestión de proyecto: Miro, Trello

## 🚀 Configuración y Despliegue

### Prerequisitos
- Cuenta de AWS
- Instancia EC2 t2.medium
- Docker instalado
- Node.js y npm

### Pasos para el Despliegue

1. **Configuración de AWS EC2**
   - Crear una instancia EC2 t2.medium
   - Configurar los grupos de seguridad para permitir tráfico HTTP
   - Conectar a la instancia vía SSH

2. **Configuración de Jenkins**
   - Utilizar el archivo `jenkins-compose.yml` proporcionado en el repositorio
   - Instalar los plugins necesarios:
     - Docker Pipeline
     - Docker

3. **Configuración del Pipeline**
   - Crear un nuevo pipeline en Jenkins
   - Configurar las credenciales de GitHub
   - Utilizar el Jenkinsfile del repositorio que incluye:
     - Clonación del repositorio
     - Instalación de dependencias
     - Ejecución de tests
     - Construcción y despliegue con Docker

4. **Monitorización**
   - Instalar PM2
   - Ejecutar el script `monitor.sh` para monitorizar:
     - Uso de CPU
     - Uso de memoria
     - Puertos activos
     - Actualización cada 15 segundos

## 📈 Gestión del Proyecto
- **Miro**: Utilizado para el diseño y planificación del proyecto, incluyendo diferentes iteraciones del diseño.
- **Trello**: Gestión de tareas e historias de usuario, incluyendo:
  - Seguimiento de tests
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

## 📝 Notas Adicionales
- La aplicación está completamente containerizada usando Docker
- El sistema de CI/CD está automatizado a través de Jenkins
- La monitorización en tiempo real está implementada con PM2

---
Para más detalles sobre la implementación o consultas, por favor revisa el código fuente o abre un issue en el repositorio.
