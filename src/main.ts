// Подключение библиотек 
import express = require('express')
import bodyParser = require('body-parser')
const Router = require('./controller')
const RouterUser = require('./login')
// Инстанс приложения
const app = express()

// Additional Middlewares
app.use(bodyParser.json())
app.use('/api', Router)
app.use('/login', RouterUser)

app.listen(3000, () => {
    console.log('Сервер успешно запущен')
})