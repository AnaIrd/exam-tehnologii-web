const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const cors = require("cors")
const { Op } = require('sequelize')

//PT HEROKU
// const path = require('path')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'examen_tehnologii_web.db',
    define: {
        timestamps: false
    }
})

//PT HEROKU
// const sequelize = new Sequelize(process.env.DATABASE_URL,{
//     dialect: 'postgres',
//     protocol: 'postgres',
//     dialectOptions :{
//         ssl:{
//             require: true,
//             rejectUnauthorized: false
//         }
//     }
// })

const port = 7777;

// Definirea primei entități - 0.3
const VirtualShelf = sequelize.define('virtualShelf', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descriere: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: 3
        }
    },
    data: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true
        },
        defaultValue: Sequelize.NOW
    }
})

// Definire celei de-a doua entități - 0.3
const Book = sequelize.define('book', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titlu: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: 5
        }
    },
    gen_literar: {
        type: Sequelize.ENUM({
            values: ['COMEDY', 'TRAGEDY', 'ROMANCE', 'SF', 'POETRY']
        }),
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        validate: {
            isUrl: true
        },
        allowNull: false
    }
})
// Definirea relației dintre cele două entități - 0.3
VirtualShelf.hasMany(Book)

const app = express()
app.use(cors())

//PT HEROKU
// app.use(express.static(path.join(__dirname, 'build')))

app.use(bodyParser.json())

// sincronizare baza de date 
app.get('/sync', async (req, res) => {
    try {
        await sequelize.sync({ force: true })
        res.status(201).json({ message: 'created' })
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// Operație GET pentru prima entitate - 0.3
app.get('/virtualShelves', async (req, res) => {
    try {
        const query = {}
        let size = 10

        // Filtrare după două câmpuri pentru prima entitate - 0.3
        const allowedFilters = ['descriere', 'data']
        const filterKeys = Object.keys(req.query).filter(e => allowedFilters.indexOf(e) !== -1)
        if (filterKeys.length > 0) {
            query.where = {}
            for (const key of filterKeys) {
                if (key !== 'data') {
                    query.where[key] = {
                        [Op.like]: `%${req.query[key]}%`
                    }
                } else {
                    query.where[key] = {
                        [Op.like]: `${req.query[key]}`
                    }
                }
            }
        }

        // Sortare după un câmp pentru prima entitate - 0.3
        const sortField = req.query.sortField
        let sort = 'ASC'
        if (req.query.sort && req.query.sort === '-1') {
            sort = 'DESC'
        }

        // Paginare pentru prima entitate - 0.3
        if (req.query.size) {
            size = parseInt(req.query.size)
        }

        if (sortField)
            query.order = [[sortField, sort]]

        if (!isNaN(parseInt(req.query.page))) {
            query.limit = size
            query.offset = size * parseInt(req.query.page)
        }

        const records = await VirtualShelf.findAll(query)
        const count = await VirtualShelf.count()
        res.status(200).json({ records, count })
    }
    catch (err) {
        console.warn(err)
        res.status(500).json({ message: 'server error' })
    }
})

// Operație POST pentru prima entitate - 0.3
app.post('/virtualShelves', async (req, res) => {
    try {
        await VirtualShelf.create(req.body)
        res.status(201).json({ message: 'created' })
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// Operație PUT pentru prima entitate - 0.3
app.put('/virtualShelves/:id', async (req, res) => {
    try {
        let virtualShelf = await VirtualShelf.findByPk(req.params.id)
        if (virtualShelf) {
            await virtualShelf.update(req.body)
            res.status(202).json({ message: 'accepted' })
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// Operație DELETE pentru prima entitate - 0.3
app.delete('/virtualShelves/:id', async (req, res) => {
    try {
        let virtualShelf = await VirtualShelf.findByPk(req.params.id)
        if (virtualShelf) {
            await virtualShelf.destroy()
            res.status(202).json({ message: 'accepted' })
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// Operație GET pentru a doua entitate ca subresursă - 0.3
app.get('/virtualShelves/:id/books', async (req, res) => {
    try {
        const virtualShelf = await VirtualShelf.findByPk(req.params.id)
        if (virtualShelf) {
            const records = await virtualShelf.getBooks()
            const count = await Book.count()
            res.status(200).json({ records, count })
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// Operație POST pentru a doua entitate ca subresursă - 0.3
app.post('/virtualShelves/:id/books', async (req, res) => {
    try {
        const virtualShelf = await VirtualShelf.findByPk(req.params.id)
        if (virtualShelf) {
            const book = await Book.create(req.body)
            virtualShelf.addBook(book)
            await virtualShelf.save()
            res.status(201).json({ message: 'created' })
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// Operație PUT pentru a doua entitate ca subresursă - 0.3
app.put('/virtualShelves/:sid/books/:bid', async (req, res) => {
    try {
        let virtualShelf = await VirtualShelf.findByPk(req.params.sid)
        if (virtualShelf) {
            let books = await virtualShelf.getBooks({ where: { id: req.params.bid } })
            let book = books.shift()
            if (book) {
                await book.update(req.body)
                res.status(202).json({ message: 'accepted' })
            }
            else {
                res.status(404).json({ message: 'not found' })
            }
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// Operație DELETE pentru a doua entitate ca subresursă - 0.3
app.delete('/virtualShelves/:sid/books/:bid', async (req, res) => {
    try {
        let virtualShelf = await VirtualShelf.findByPk(req.params.sid)
        if (virtualShelf) {
            let books = await virtualShelf.getBooks({ where: { id: req.params.bid } })
            let book = books.shift()
            if (book) {
                await book.destroy(req.body)
                res.status(202).json({ message: 'accepted' })
            }
            else {
                res.status(404).json({ message: 'not found' })
            }
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// Import - 0.2
app.post("/virtualShelves/import", async (req, res) => {
    try {
        const registru = {}
        for (let vs of req.body) {
            const virtualShelf = await VirtualShelf.create(vs)
            for (let b of vs.books) {
                const book = await Book.create(b)
                registru[b.key] = book
                virtualShelf.addBook(book)

            }
            await virtualShelf.save()
        }
        res.status(202).json({ message: 'accepted' })
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// Export - 0.2
app.post("/virtualShelves/export", async (req, res) => {
    try {
        const result = []
        for (let vs of await VirtualShelf.findAll()) {
            const virtualShelf = {
                id: vs.id,
                descriere: vs.descriere,
                data: vs.data,
                books: []
            }
            for (let b of await vs.getBooks()) {
                virtualShelf.books.push({
                    id: b.id,
                    titlu: b.titlu,
                    gen_literar: b.gen_literar,
                    url: b.url
                })
            }
            result.push(virtualShelf)
        }
        if (result.length > 0) {
            res.json(result)
        } else {
            res.sendStatus(204)
        }

    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// pornire server
app.listen(port)

//PT HEROKU
// app.listen(process.env.PORT)