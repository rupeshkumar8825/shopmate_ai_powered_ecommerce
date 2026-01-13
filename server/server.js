import app from "./app.js"

// create the server here with all the configuration done 
// in the app.js

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
})