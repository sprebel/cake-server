/**
 * npm install
 * npm install express
 * npm install socket.io
 */
console.log('check');
const express = require('express')
const app = express()

const server = require('http').createServer(app)

const io = require('socket.io')(server, {
    cors: { origin: "*" } 
});

app.get('/broadcast', async(req, res) => {

    var returnResp
    var params = req.query
    
    if(params.channel && params.message) {
        var socket = app.get('WebSocket')
        socket.broadcast.emit(params.channel, params.message) 
        returnResp = {'status': true, 'message': 'Broadcast success'}
    } else {
        returnResp = {'status': false, 'message': 'Invalid Request'}
    }

    return res.json(returnResp).status(200)
});

io.on('connection', (socket) => {
    //Assign the socket variable to WebSocket variable so we can use it the GET method
    app.set('WebSocket', socket)
    
    socket.on('sendNotificationToUser', (obj) => {
        socket.broadcast.emit('receiveNotificationToUser_'+obj.user, obj.message)
    })
})

const port = 6589

server.listen(port, () => {
    console.log('Server is running. Port: '+port)
});
