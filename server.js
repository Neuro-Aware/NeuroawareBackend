const http = require('http')
const app = require('./app')
const port = 3000;
const server = http.createServer(app);

const heartbeatUrl = process.env.SERVER_URL + '/heartbeat';

const sendHeartbeat = () => {
    fetch(heartbeatUrl, { timout: 60000 })
        .then(response => {
            if (response.status !== 200) {
                throw new Error('Failed to send heartbeat');
            }
            setTimeout(sendHeartbeat, 600000);
        })
        .catch(error => {
            console.log("Error sending heartbeat: ", error);
            setTimeout(sendHeartbeat, 30000);
        });
};

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    sendHeartbeat();
});
