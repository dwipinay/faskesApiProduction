import express from 'express'
const router = express.Router()

import swaggerUi from 'swagger-ui-express'
import apiDocs from '../documentations/apiDocs-1.json' assert { type: "json" };

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