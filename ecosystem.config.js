module.exports = {
    apps: [{
      name: "players-app",
      script: "./server.js",
      
      // Configuraciones de escalado y monitoreo
      instances: "max",  // Usar todos los núcleos de CPU
      exec_mode: "cluster",
      
      // Configuraciones de reinicio
      watch: true,  // Reiniciar si hay cambios en archivos
      ignore_watch: ["node_modules", "logs"],
      
      // Configuraciones de memoria y reinicio
      max_memory_restart: "300M",
      
      // Configuración de logs
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      
      // Variables de entorno
      env: {
        NODE_ENV: "development",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }]
  }