module.exports = {
  apps: [{
    name: 'kosocial-site',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/kosocial',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 8083,
      NEXT_PUBLIC_PLATFORM_URL: 'https://slowbill.xyz'
    },
    error_file: '/var/www/kosocial/logs/error.log',
    out_file: '/var/www/kosocial/logs/out.log',
    log_file: '/var/www/kosocial/logs/combined.log',
    time: true
  }]
}
