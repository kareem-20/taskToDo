const mongoose = require("mongoose");

// connect to database
mongoose.connect(
    process.env.DB_URL, {
    dbName: process.env.DB_NAME,
    user: "kareem",
    pass: "192001",
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log('mongoose is connected')
    })
    .catch((err) => console.log(err.message));


mongoose.connection.on('connected', () => {
    console.log('mongoose connected to db')
})


mongoose.connection.on('error', (err) => {
    console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
    console.log('mongoose is disconnected with db')
})

// if server stop ----> mongoose disconnecte
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
})