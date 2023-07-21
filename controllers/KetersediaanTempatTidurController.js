import { get } from '../models/KetersediaanTempatTidurModel.js'
import paginationDB from '../config/PaginationDB.js'
import Joi from 'joi'

export const getKetersediaanTempatTidur = (req, res) => {
    const schema = Joi.object({
        provinsiId: Joi.string().required(),
        kabKotaId: Joi.string(),
        rsId: Joi.string(),
        tglUpdate: Joi.string(),
        page: Joi.number(),
        limit: Joi.number()
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