if (process.env.NODE_ENV !== 'production') {
    require('dotenv').toString()
}

const express = require('express')
const app = express()
// const expressLayouts = require('express-ejs-layouts')

app.set('view engine', 'ejs')
// app.set('views', __dirname + '/views')
// app.set('layout', 'layouts/layout')
// app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const Document = require("./models/Document")
const mongoose = require('mongoose')

// process.env.DATABASE_URL
mongoose.connect("mongodb://localhost/nik_bin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected To Mongoose'))

app.get('/', (req, res) => {

    const code = `Welcome TO Nik_Bin!!
    
Use the commands in the top right corner to create a new file to share with others.`
    res.render("code-display", { code, language: 'plaintext' })
})
app.get('/new', (req, res) => {
    res.render("new")
})

app.post('/save', async (req, res) => {
    const value = req.body.value
    try {
        const document = await Document.create({ value })
        res.redirect(`/${document.id}`)
    } catch (e) {
        res.render("new", { value })
    }
})

app.get('/:id/duplicate', async (req, res) => {
    const id = req.params.id
    try {
        const document = await Document.findById(id)
        res.render('new', { value: document.value })
    } catch (e) {
        res.redirect(`/${id}`)
    }
})

app.get('/:id', async (req, res) => {
    const id = req.params.id
    try {
        const document = await Document.findById(id)

        res.render('code-display', { code: document.value, id })
    } catch (e) {
        res.redirect('/')
    }
})
// app.listen(3000)
app.listen(process.env.PORT || 3000)