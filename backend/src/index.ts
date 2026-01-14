import app from "./app"
import dotenv from "dotenv"

dotenv.config();

const PORT = process.env.PORT || 4000;


// listening to the server on PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})