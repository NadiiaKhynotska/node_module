// const Events = require("node:events");
// const eventEmitter = new Events();
//
// eventEmitter.on('click', ()=>{
//     console.log('Click, click, click')
// })
//
// eventEmitter.emit('click')
// eventEmitter.emit('click')
// eventEmitter.emit('click')
// eventEmitter.emit('click')
//
// eventEmitter.once('hello', ()=>{
//     console.log('Hello, hello, hello')
// })
// console.log(eventEmitter.eventNames())
// eventEmitter.emit('hello')
// eventEmitter.emit('hello')
// eventEmitter.emit('hello')
// eventEmitter.emit('hello')
// console.log(eventEmitter.eventNames())

// const fs = require('fs')
// const path = require('path')
// const mainPath = path.join(__dirname, 'folder')
// const filePath = path.join(mainPath, 'file.txt')
// // fs.mkdir(mainPath,err => {})
// // fs.writeFile(filePath, 'text in file', err => {})
//
// const readStream = fs.createReadStream(filePath,{highWaterMark: 30})
// const writeStream = fs.createWriteStream(path.join(mainPath, 'file2.txt')
// )
//
// readStream.on('data', (chunk)=>{
//     console.log(chunk)
//     writeStream.write(chunk)
// })
//
// // readStream.pipe(writeStream)
//
// readStream.on('error', ()=>{
//     console.log('error happened');
//     readStream.destroy()
//     writeStream.end('Error')
// })

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const users = [
    {
        id: 1,
        name: "John Smith",
        age: 25,
        gender: "Male",
        email: "john.smith@example.com"
    },
    {
        id: 2,
        name: "Jane Doe",
        age: 30,
        gender: "Female",
        email: "jane.doe@example.com"
    },
    {
        id: 3,
        name: "Michael Johnson",
        age: 22,
        gender: "Male",
        email: "michael.johnson@example.com"
    },
    {
        id: 4,
        name: "Emily Williams",
        age: 28,
        gender: "Female",
        email: "emily.williams@example.com"
    },
    {
        id: 5,
        name: "Robert Brown",
        age: 35,
        gender: "Male",
        email: "robert.brown@example.com"
    },
    {
        id: 6,
        name: "Sarah Taylor",
        age: 29,
        gender: "Female",
        email: "sarah.taylor@example.com"
    },
    {
        id: 7,
        name: "David Anderson",
        age: 40,
        gender: "Male",
        email: "david.anderson@example.com"
    },
    {
        id: 8,
        name: "Linda Martinez",
        age: 26,
        gender: "Female",
        email: "linda.martinez@example.com"
    },
    {
        id: 9,
        name: "William Wilson",
        age: 32,
        gender: "Male",
        email: "william.wilson@example.com"
    },
    {
        id: 10,
        name: "Olivia Jones",
        age: 27,
        gender: "Female",
        email: "olivia.jones@example.com"
    },
    {
        id: 11,
        name: "James Davis",
        age: 24,
        gender: "Male",
        email: "james.davis@example.com"
    },
    {
        id: 12,
        name: "Maria Garcia",
        age: 31,
        gender: "Female",
        email: "maria.garcia@example.com"
    },
    {
        id: 13,
        name: "Daniel Brown",
        age: 23,
        gender: "Male",
        email: "daniel.brown@example.com"
    },
    {
        id: 14,
        name: "Ella White",
        age: 33,
        gender: "Female",
        email: "ella.white@example.com"
    },
    {
        id: 15,
        name: "Thomas Clark",
        age: 36,
        gender: "Male",
        email: "thomas.clark@example.com"
    }
]


app.get('/users', (req, res) => {
    res.json({
        data: users
    })
})

app.get('/users/:id', (req, res) => {

    const {id} = req.params

    res.json({
        data: users[+id - 1]
    })
})

app.post('/users', (req, res) => {
    users.push(req.body)
    res.status(201).json({message: 'user created'})
})

app.delete('/users/:id',(req, res)=>{
    const {id} = req.params;

    users.splice(+id-1, 1)

    res.sendStatus(204)
})

app.put('/users/:id',(req, res)=>{
    const {id} = req.params;

    users[id] = res.body;

    res.json({massage: 'user updated'})
})
const Port = 5001
app.listen(Port, () => {
    console.log(`server has successfully started on port ${Port}`)
})