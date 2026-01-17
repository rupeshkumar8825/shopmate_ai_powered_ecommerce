import app from "./app"
import dotenv from "dotenv"
dotenv.config();
import { ENV } from "./config/env";


const PORT = ENV.PORT ?? 4000;
console.log(`The value of the port is ${PORT}`)

// listening to the server on PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

