const base64url = require('base64url');
const express = require('express')
const fs = require('fs/promises')
import { Request, Response } from 'express';
type User = {
    id: number,
    username: string,
    password: string,
    JWTtoken: string
}

const routerUser = express.Router()

routerUser.post('', async (request: Request, response: Response) => {   //авторизация
    let users = await fs.readFile('usesrs/users.json')
    users = await JSON.parse(users)
    let check = -1
    for (let i = 0; i < users.users.length; i++) {
        if (users.users[i].username === request.body.username) {
            if (users.users[i].password === request.body.password) {
                check = i

            }
        }
    }

    if (check === -1) {
        response.status(404).send('такого пользователя нет')
    }
    else {
        users.users[check].JWTtoken = GeneratorJWT(request.body.username)
        let names = users.users.map((item: User) => { return (item.username) })
        response.send({ token: users.users[check].JWTtoken, users: names })
        users = JSON.stringify(users)
        await fs.writeFile('usesrs/users.json', users)
    }
})





module.exports = routerUser



function GeneratorJWT(login: string) {      //генератор токена
    const header = { alg: "HS256", typ: "JWT" }
    const payload = { userName: login, exp: 215158651 }
    const signature = 'efsgfr'
    const token = 'Bearer ' + base64url(JSON.stringify(header)) + '.' + base64url(JSON.stringify(payload)) + '.' + base64url(signature)

    return (token)
}
