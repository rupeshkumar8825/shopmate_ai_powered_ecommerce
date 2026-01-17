// this is the server which will start on a specific port.
// please note that all configurations related to the app is in app.ts file 
// further in this we will set up the config as well so that we are ready with all 
// the config setups or environment variables 
import dotenv from "dotenv"
dotenv.config();
import { ENV } from "./config/env"
import app from "./app"


app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
});