
const express = require('express')

const fsService = require('./fs.service')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/users', async (req, res) => {
    const users = await fsService.reader()
    res.json(users)
})

app.get('/users/:id', async (req, res) => {
    const {id} = req.params
    const users = await fsService.reader()
    const user = users.find(user => user.id === Number(id))
    res.json(user)
})

app.post('/users', async (req, res) => {
    try {
        const {name, age, gender, email} = req.body
        if (!name || name.length <= 2) {
            throw new Error('incorrect name')
        }
        if (!age || age < 4) {
            throw new Error('invalid age')
        }
        if (!gender && gender !== "Female" && gender !== "Male") {
            throw new Error('invalid value of gender')
        }
        if (!email || !email.includes('@')) {
            throw new Error('invalid email')
        }

        const users = await fsService.reader();

        const lasId = users[users.length - 1].id
        const newUser = {id: lasId + 1, name, age, gender, email}
        users.push(newUser)
        await fsService.writer(users)
        res.status(201).json(newUser)
    } catch (e) {
        res.status(400).json(e.message)
    }
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