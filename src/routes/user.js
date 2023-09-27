const express = require("express")
const bcrypt = require("bcrypt")
const connection = require("../database/conn")
const router = express.Router()

router.get("/", async (req, res) => {
  const getAll = await connection.query("SELECT * FROM `user`")
  res.json(getAll[0])
})

router.post("/create", async (req, res) => {
  const name = req.body.name 
  const email = req.body.email 
  const password = req.body.password

  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = await connection.query("INSERT INTO `user`(`id`, `name`, `email`, `password`) VALUES (DEFAULT,?,?,?)", [name, email, passwordHash])

  res.send(user)
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const verify = await connection.query("SELECT * FROM `user` WHERE `email` = ?", [email])
    if(verify.length === 0){
      res.status(401).send({ msg: "Email or Password incorrect" })
    }

    const checkPassword = await bcrypt.compare(password, verify[0][0].password)

    if (!checkPassword) {
      res.status(422).json({ msg: "Email or Password incorrect" })
    }
 
    res.send({ verify })
  } catch (error) {
    console.log("Email or Password incorrect")
  }
})

router.post("/sendMessage", async (req, res) => {
  const { message, sender, receiver } = req.body

  try {
    const sendedMessage = await connection.query("INSERT INTO `message`(`id`, `message`, `sender`, `receiver`) VALUES (DEFAULT,?,?,?)", [message, sender, receiver])

    res.send({ sendedMessage })
  } catch {
    console.log("Server Error")
  }
})

router.get("/getMessages/:sender/:receiver", async (req, res) => {
  const { sender, receiver } = req.params

  const getMessages = await connection.query("SELECT * FROM `message` WHERE `sender` = ? and `receiver` = ?", [ sender, receiver ])

  res.send({ getMessages })
})

module.exports = router