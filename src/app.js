const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/Chat.html")
})

const messages = []
const members = {}

io.on('connection', (socket) =>{
    var clientIp = socket.request.connection._peername.address
    var id = socket.id
    var name = `nickname ${id}`
    members[id] = name

    console.log(`${clientIp} is connected!`)
    
    socket.on('chat message', (msg) => {
        //console.log('socket on')
        messages.push(msg)
        io.emit('chat message', msg)
    })

    socket.on('disconnect', () => {
        console.log(`${clientIp} disconnected!`)
        delete members[id]
        io.emit('update members', members)
    })

    socket.broadcast.emit('member joined', name)
    socket.emit('update chat', messages)
    socket.emit('update members', members)
})

let port = 1020
http.listen(port, () => { console.log(`Listening at port ${port}`) })