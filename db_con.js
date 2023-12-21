require('dotenv').config();
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
db_con=mongoose.connect(process.env.DB_CON_STRING,{sslValidate: false})
mongoose.connection.on("error", err => {
    console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
    console.log("🔥 Mongoose Connected 🤪")
})

module.exports = {db_con,mongoose}
