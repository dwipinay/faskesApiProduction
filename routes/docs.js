import express from 'express'
const router = express.Router()

import fs from "fs";
import swaggerUi from 'swagger-ui-express'
// import apiDocs from '../documentations/apiDocs-1.json' assert { type: "json" };

const apiDocsDTO1 = JSON.parse(
    fs.readFileSync(new URL("../documentations/apiDocsDTO-1.json", import.meta.url), {
        encoding: "utf-8",
    })
)

const apiDocsDitjenNakes1 = JSON.parse(
    fs.readFileSync(new URL("../documentations/apiDocsDitjenNakes-1.json", import.meta.url), {
        encoding: "utf-8",
    })
)

const apiDocsInfoHumas1 = JSON.parse(
    fs.readFileSync(new URL("../documentations/apiDocsInfoHumas-1.json", import.meta.url), {
        encoding: "utf-8",
    })
)

// DTO-PUSDATIN
router.use('/faskes/apidocs-1-dto', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDocsDTO1);
    res.send(html);
})

// Ditjen Nakes
router.use('/faskes/apidoc-1-ditjen-nakes', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDocsDitjenNakes1);
    res.send(html);
})

// Ditjen Nakes
router.use('/faskes/apidoc-1-info-humas', swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(apiDocsInfoHumas1);
    res.send(html);
})

export default router