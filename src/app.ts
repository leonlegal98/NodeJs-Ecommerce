import "reflect-metadata";

import express from 'express';
import RandomUser from "./services/randomUser";

import { createConnection, getConnection, In } from "typeorm";
import { User } from "./Models/User";
import { Product } from "./Models/Products";
import * as bodyParser from 'body-parser'
import * as sha512 from 'js-sha512'
import * as jwt from 'jsonwebtoken'
import { userInfo } from "os";
import { Ingredient } from "./Models/Ingredients";
import { from } from "zen-observable";
import { Command } from "./Models/Commands";
import cors from 'cors'
// import * as jwtexpress from 'express-jwt'

var jwtexpress = require('express-jwt');

const app = express();
const port = 3009;

app.use(cors())
app.use(bodyParser.json())

app.use(jwtexpress({ secret: 'ThisIsMySecretSentenceBlaBlaBla', algorithms: ['HS256'] }).unless({
    path: [
        '/auth',
        '/inscription'

    ]
}));

createConnection({
    type: "mysql",
    host: "localhost",
    port: 8889,
    username: "root",
    password: "root",
    database: "shop_sushis",
    entities: [
        User,
        Product,
        Ingredient,
        Command
        // __dirname + "/Models/*.ts"
    ],
    synchronize: true,
    logging: false
})

app.get('/', async (req, res) => {

    // let user = new User();
    // user.firstname = "John"
    // user.lastname = "Doe"

    // let result = await getConnection().manager.save(user)

    // let result = await User.findOne({where: { firstname: "John" }})

    let result = await User.find()


    res.json({ status: 200, data: result })

});

app.post('/auth', async (req, res) => {
    console.log({
        email: req.body.email,
        password: sha512.sha512(req.body.password)
    })
    let user = await User.findOne({
        where: {
            email: req.body.email,
            password: sha512.sha512(req.body.password)
        }
    })

    let token = jwt.sign({ id: user.id }, 'ThisIsMySecretSentenceBlaBlaBla');

    res.json({ status: 200, data: token })

})

app.get('/test', (req, res) => {
    res.json({ status: 200, data: "URL de TEST" })
})

app.get('/users/me', async (req, res) => {
    // @ts-ignore
    let user = await User.findOne({ where: { id: req.user.id } })

    res.json({ status: 200, data: user })
})
app.post('/inscription', async (req, res) => {
    // @ts-ignore
    let newUser = new User()
    newUser.name = req.body.name
    newUser.email = req.body.email
    newUser.password = sha512.sha512(req.body.password)
    newUser.role = req.body.USER
    newUser.save()
    res.json({ status: 200 })
})
app.post('/product', async (req, res) => {
    // @ts-ignore
    let newProducts = new Product()
    newProducts.name = req.body.name
    newProducts.prix = req.body.prix

    newProducts.save()
    res.json({ status: 200 })
})
app.post('/ingredient', async (req, res) => {
    // @ts-ignore
    let newIngredients = new Ingredient()
    newIngredients.name = req.body.name
    newIngredients.stock = req.body.stock
    newIngredients.products = req.body.product
    newIngredients.save()
    res.json({ status: 200 })
})
app.post('/command', async (req, res) => {
    // @ts-ignore
    let newCommands = new Command()
    newCommands.status = req.body.status
    newCommands.date = req.body.date
    newCommands.products = req.body.products
    newCommands.save()
    res.json({ status: 200 })
})
app.get('/productall', async (req, res) => {

    let product = await Product.find()
    res.json({ status: 200, data: product })

})
app.get('/commandall', async (req, res) => {
    // @ts-ignore

    let command = await Command.find()

    res.json({ status: 200, data: command })
})
app.get('/ingrediantall', async (req, res) => {
    // @ts-ignore

    let ingredient = await Ingredient.find()
    res.json({ status: 200, data: ingredient })
})
app.use(express.json()) // parse json body content



app.get('/ingredient/:id', async (req, res) => {
    // @ts-ignore
    let ingredient = await Ingredient.findOne({ where: { id: req.params.id } })

    res.json({ status: 200, data: ingredient })
})
app.use(express.json())

app.put('/ingredient/mod/:id', async (req, res) => {
    // @ts-ignore
    let ingredient = await Ingredient.findOne({ where: { id: req.params.id } })

    if (!ingredient) {
        return res.status(404).send('Product not found')
    }

    ingredient.name = req.body.name
    ingredient.stock = req.body.stock

    await ingredient.save()

    res.status(200).json('ingredient updated')

})
app.use(express.json())

app.put('/product/mod/:id', async (req, res) => {
    // @ts-ignore
    let product = await Product.findOne({ where: { id: req.params.id }, relations: ["ingredients"] })

    if (!product) {
        return res.status(404).send('Product not found')
    }

    product.name = req.body.name
    product.prix = req.body.prix
    product.ingredients = await Ingredient.find({ where: { id: In(req.body.ingredients) } })

    await product.save()


    res.status(200).json('produit updated')

})
app.use(express.json())

app.delete('/ingredient/delete/:id', async (req, res) => {
    // @ts-ignore
    let ingredient = await Ingredient.findOne({ where: { id: req.params.id } })
    console.log(ingredient)
    await ingredient.remove()
    res.json({ status: 200, data: "ingredient supprimé" })
})
app.use(express.json())

app.delete('/product/delete/:id', async (req, res) => {
    // @ts-ignore
    let product = await Product.findOne({ where: { id: req.params.id } })
    await Product.delete({
        id: product.id,
    });
    res.json({ status: 200, data: "product supprimé" })
})
app.use(express.json())

app.get('/ingredientProduct', async (req, res) => {
    // @ts-ignore

    let ingredientProduct = await Product.find({ loadRelationIds: { Ingredient: ["products_has_ingredients"] } })

    res.json({ status: 200, data: ingredientProduct })
})


app.get('/Productingred', async (req, res) => {
    // @ts-ignore

    let ingredientProduct = await Ingredient.find({ loadRelationIds: { Product: ["products_has_ingredients"] } })

    res.json({ status: 200, data: ingredientProduct })
})

app.listen(port);