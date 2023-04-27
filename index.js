import express from "express"
import {} from 'dotenv/config'
import router from "./routes/index.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import  { databaseFKTP, databaseFKRTL  } from "./config/Database.js"

const app = express()

try {
    await databaseFKTP.authenticate()
    await databaseFKRTL.authenticate()
    console.log('database connected...')
} catch (error) {
    console.log(error)
}

app.use(cors( {credentials: true, origin: [process.env.ORIGIN]}))
app.use(cookieParser())
app.use(express.json())
app.use(router)

app.listen(5000, () => {
    console.log("server running at port 5000")
})