import { get, show } from '../models/RumahSakitModel.js'
import paginationDB from '../config/PaginationDB.js'
import Joi from 'joi'
import joiDate from "@joi/date"

export const getRumahSakit = (req, res) => {
    const joi = Joi.extend(joiDate) 

    const schema = joi.object({
        provinsiId: joi.string().allow(''),
        kabKotaId: joi.string().allow('').allow(null),
        nama: joi.string().allow(''),
        pelayanan: joi.string().allow(''),
        aktive: joi.number(),
        startModifiedAt: joi.date().format("YYYY-MM-DD"),
        endModifiedAt: joi.date().format('YYYY-MM-DD'),
        page: joi.number(),
        limit: joi.number()
    })

    const { error, value } =  schema.validate(req.query)

    if (error) {
        res.status(400).send({
            status: false,
            message: error.details[0].message
        })
        return
    }
    
    get(req, (err, results) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }

        const paginationDBObject = new paginationDB(results.totalRowCount, results.page, results.limit, results.data)
        const remarkPagination = paginationDBObject.getRemarkPagination()
        const message = results.data.length ? 'data found' : 'data not found'

        res.status(200).send({
            status: true,
            message: message,
            pagination: remarkPagination,
            data: results.data
        })
    })
}

export const showRumahSakit = (req, res) => {
    show(req.params.id, (err, results) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }

        const message = results.length ? 'data found' : 'data not found'
        const data = results.length ? results[0] : null

        res.status(200).send({
            status: true,
            message: message,
            data: data
        })
    })
}