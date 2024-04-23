import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

const mongourl = process.env.MONGO_URL
const mongoclient = new MongoClient(mongourl, {})

mongoclient.connect().then(() => {
    console.log("Connected to MongoDB")
})

app.get('/', (req, res) => {
    res.send('/')
})

app.get('/hello', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

app.get('/todos', async (req, res) => {
    try {
        const todos = await mongoclient.db('todo-ai').collection('todo').find({}).toArray()
        res.status(200).json(todos)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'error' })
    }
})

app.post('/add-todo', async (req, res) => {
    try {
        const todo = req.body
        if (!todo.name || Object.keys(todo).length !== 1) {
            res.status(400).json({ message: 'bad request' })
            return
        }
        await mongoclient.db('todo-ai').collection('todo').insertOne(todo)
        res.status(201).json({ message: 'success' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'error' })
    }
})

app.post('/delete-todo', async (req, res) => {
    try {
        const todo = req.body
        if (!todo.name || Object.keys(todo).length !== 1) {
            res.status(400).json({ message: 'bad request' })
            return
        }
        await mongoclient.db('todo-ai').collection('todo').deleteOne(todo)
        res.status(201).json({ message: 'success' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'error' })
    }
})