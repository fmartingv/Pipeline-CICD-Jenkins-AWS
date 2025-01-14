#!/bin/bash
CONTAINER_NAME="pipeline_app_1"
CONTAINER_PORT=3000

while true; do
  # Más información del contenedor
  CONTAINER_STATUS=\$(docker ps -f name=\$CONTAINER_NAME --format '{{.Status}}')
  CONTAINER_CPU=\$(docker stats --no-stream \$CONTAINER_NAME --format "{{.CPUPerc}}")
  CONTAINER_MEM=\$(docker stats --no-stream \$CONTAINER_NAME --format "{{.MemUsage}}")
  
  # Verificar puerto
  PORT_STATUS=\$(curl -s -o /dev/null -w "%{http_code}" http://localhost:\$CONTAINER_PORT || echo "failed")
  
  # Log más detallado
  echo "----------------------------------------"
  echo "\$(date)"
  echo "Container Name: \$CONTAINER_NAME"
  echo "Status: \$CONTAINER_STATUS"
  echo "CPU Usage: \$CONTAINER_CPU"
  echo "Memory Usage: \$CONTAINER_MEM"
  echo "Port \$CONTAINER_PORT Status: \$PORT_STATUS"
  echo "----------------------------------------" >> /home/ec2-user/app_metrics.log
  
  sleep 10
done
