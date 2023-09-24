const express = require("express");
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const db = require('./models');

// ROUTERS
const todoListRouter = require("./routes/TodoList");

app.use("/todolist", todoListRouter);

db.sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
});