const express = require('express')
const fs = require('fs/promises')
import { Request, Response } from 'express';



const router = express.Router()
type Task = {
    id: number,
    name: string,
    time: string,
    done: boolean,
    users: [number],
    priority: number
}
type User = {
    id: number,
    username: string,
    password: string,
    JWTtoken: string
}

//получение списка
router.get('/gettasks', async (request: Request, response: Response) => {
    if (await CheckJWT(request.headers.authorization)) {
        const tasks = await fs.readFile('src/tasks/tasks.json')
        response.send(tasks)
    }
    else {
        response.status(404).send('пользователь не авторизован')
    }
})

//пополнение списка
router.post('/posttask', async (request: Request, response: Response) => {
    if (await CheckJWT(request.headers.authorization)) {
        let tasks = await fs.readFile('src/tasks/tasks.json')
        tasks = JSON.parse(tasks)
        let temp = request.body
        temp.id = tasks.tasks[tasks.tasks.length - 1].id + 1
        tasks.tasks.push(temp)
        tasks = JSON.stringify(tasks)
        await fs.writeFile('src/tasks/tasks.json', tasks)
        response.send(temp)
    }
    else {
        response.status(404).send('пользователь не авторизован')
    }
})
//редактирование iddasdadas
//done
router.post('/reddone', async (request: Request, response: Response) => {
    if (await CheckJWT(request.headers.authorization)) {
        let tasks = await fs.readFile('src/tasks/tasks.json')
        tasks = JSON.parse(tasks)
        tasks.tasks[request.body.id].done = request.body.done
        tasks = JSON.stringify(tasks)
        await fs.writeFile('src/tasks/tasks.json', tasks)
        response.send('++++')
    }
    else {
        response.status(404).send('пользователь не авторизован')
    }

})
//priority
router.post('/redpriority', async (request: Request, response: Response) => {
    if (await CheckJWT(request.headers.authorization)) {
        let tasks = await fs.readFile('src/tasks/tasks.json')
        tasks = JSON.parse(tasks)
        tasks.tasks[request.body.id].priority = request.body.priority
        tasks = JSON.stringify(tasks)
        await fs.writeFile('src/tasks/tasks.json', tasks)
        response.send('++++')
    }
    else {
        response.status(404).send('пользователь не авторизован')
    }

})
//users
router.post('/adduser', async (request: Request, response: Response) => {
    if (await CheckJWT(request.headers.authorization)) {
        let tasks = await fs.readFile('src/tasks/tasks.json')
        tasks = await JSON.parse(tasks)
        const temp = await request.body.user
        tasks.tasks[request.body.id].users.push(temp)
        tasks = JSON.stringify(tasks)
        await fs.writeFile('src/tasks/tasks.json', tasks)
        response.send('++++')
    }
    else {
        response.status(404).send('пользователь не авторизован')
    }

})
//delete users
router.post('/deleteuser', async (request: Request, response: Response) => {
    if (await CheckJWT(request.headers.authorization)) {
        let tasks = await fs.readFile('src/tasks/tasks.json')
        tasks = await JSON.parse(tasks)
        for (let i = 0; i < tasks.tasks[request.body.id].users.length; i++) {
            if (tasks.tasks[request.body.id].users[i] === request.body.user) {
                tasks.tasks[request.body.id].users.splice(i, 1)
                break
            }
        }
        tasks.tasks[request.body.id].users
        tasks = JSON.stringify(tasks)
        await fs.writeFile('src/tasks/tasks.json', tasks)
        response.send('++++')
    }
    else {
        response.status(404).send('пользователь не авторизован')
    }

})
//delete task
router.delete('/delete', async (request: Request, response: Response) => {
    if (await CheckJWT(request.headers.authorization)) {
        let tasks = await fs.readFile('src/tasks/tasks.json')
        tasks = JSON.parse(tasks)
        for (let i = 0; i < tasks.tasks.length; i++) {
            if (tasks.tasks[i].id === request.body.id) {
                tasks.tasks.splice(i, 1)
                break
            }
        }

        tasks = JSON.stringify(tasks)
        await fs.writeFile('src/tasks/tasks.json', tasks)
        response.send('delete')
    }
    else {
        response.status(404).send('пользователь не авторизован')
    }

})
// проверка токена

const CheckJWT = async (token: string) => {
    let temp = await fs.readFile('usesrs/users.json')
    temp = JSON.parse(temp)
    token = token.substring(7)
    for (let i = 0; i < temp.users.length; i++) {
        if (temp.users[i].JWTtoken === token)
            return true
    }
    return false
}


module.exports = router
