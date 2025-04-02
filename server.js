const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://chatwave-two.vercel.app",  
        methods: ["GET", "POST"]
    }
});

app.use(cors({ origin: "https://chatwave-two.vercel.app" }));

let users = [];

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    
    socket.on("join_chat", (username) => {
        users.push({ id: socket.id, username });
        io.emit("update_users", users);
    });

    
    socket.on("send_message", (data) => {
        io.emit("receive_message", data); 
    });


    socket.on("disconnect", () => {
        users = users.filter((user) => user.id !== socket.id);
        io.emit("update_users", users);
        console.log("A user disconnected:", socket.id);
    });
});

app.get("/", (req, res) => {
    res.send("Chat server is running");
});

server.listen(5000, () => {
    console.log("Server is running on port 5000");
});
