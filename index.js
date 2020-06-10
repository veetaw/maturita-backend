const User = require('./models/user')
const Item = require('./models/item')
const Opening = require('./models/opening')
const Order = require('./models/order')
const Owner = require('./models/owner')
const Pizzeria = require('./models/pizzeria')

const populate_db = require('./utils/populate_db')

const config = require('./config')

const sequelize = require('./db/db')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet');


// create all models {force: true} to delelete all before creating
sequelize.sync({ logging: config.env == 'dev', force: config.env == 'testing' })
    .then(_ => {
        const app = express()
        if (config.env == 'dev')
            app.use(cors())
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json())
        if (config.env == 'dev')
            app.use(morgan('dev'))
        else
            app.use(helmet())

        app.use('/api', require('./routes/api'))

        app.listen(config.api.port, '0.0.0.0', () => {
            console.log(`Express is running on port ${config.api.port}`)
        })

    })

