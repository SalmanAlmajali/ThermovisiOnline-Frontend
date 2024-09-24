module.exports = {
    apps: [
        {
            script: 'npm start',
        },
    ],

    deploy: {
        production: {
            user: 'root',
            host: '103.23.30.133',
            ref: 'origin/main',
            repo:
                'https://github.com/SalmanAlmajali/ThermovisiOnline-Frontend.git',
            path: '/home/node',
            'pre-deploy-local': '',
            'post-deploy':
                'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
            'pre-setup': '',
        },
    },
}
