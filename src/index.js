const express = require("express")
const { createServer } = require("node:http")
const cors = require("cors")
const user = require("./routes/user")
const { Server } = require("socket.io")

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "https://lightref-social.vercel.app"
  }
})

app.use(cors())
app.use(express.json())

app.use("/api/v1/user", user)

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on("join_room", (data) => {
    console.log(data)
    socket.join(data)
  })

  socket.on("message", (data) => {
    io.to(data[1]).to(data[2]).emit("messageResponse", data[0])
  })
})

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000")
})