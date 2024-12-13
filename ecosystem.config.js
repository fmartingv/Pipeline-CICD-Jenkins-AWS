module.exports = {
    apps: [{
      name: "mi-app",
      script: "./server.js",
      instances: "max",
      exec_mode: "cluster",
      watch: true,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production"
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log"
    }]
  };