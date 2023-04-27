import express from 'express'
const router = express.Router()

import fs from "fs";
import swaggerUi from 'swagger-ui-express'
// import apiDocs from '../documentations/apiDocs-1.json' assert { type: "json" };

const apiDocs = JSON.parse(
    fs.readFileSync(new URL("../documentations/apiDocs-1.json", import.meta.url), {
        encoding: "utf-8",
    })
)

// DTO-PUSDATIN
router.use('/faskes/apidocs-1-dto', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDocs);
    res.send(html);
})

// Ditjen Nakes
// router.use('/apidoc-dfasyankesonline-2023-03-01-ditjen-nakes', swaggerUi.serve, (req, res) => {
//     let html = swaggerUi.generateHTML(apiDocs);
//     res.send(html);
// })

export default router