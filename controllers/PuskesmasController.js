import { get } from '../models/PuskesmasModel.js'
import paginationDB from '../config/PaginationDB.js'
import Joi from 'joi'

export const getPuskesmas = (req, res) => {
    const schema = Joi.object({
        provinsiId: Joi.string().allow(''),
        kabKotaId: Joi.string().allow('').allow(null),
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

        const group = results.data.reduce((acc, curr) => {

            const key = `${curr.id}-${curr.nama}`;
                if (!acc[key]) {
                    acc[key] = {
                        id: curr.id,
                        nama: curr.nama,
                        rmeRecord: []
                    };
                }
                acc[key].rmeRecord.push({
                    email : curr.email,
                    statusRME : curr.statusRME,
                    jenisPengembangSIM : curr.jenisPengembangSIM,
                    idPengembangSIM : curr.idPengembangSIM,
                    namaPengembangSIM : curr.namaPengembangSIM,
                    idPersetujuanKetentuanAPISatSet : curr.idPersetujuanKetentuanAPISatSet
                });
                return acc
            }, {})

        const paginationDBObject = new paginationDB(results.totalRowCount, results.page, results.limit, results.data)
        const remarkPagination = paginationDBObject.getRemarkPagination()
        const message = results.data.length ? 'data found' : 'data not found'

        res.status(200).send({
            status: true,
            message: message,
            pagination: remarkPagination,
            data: Object.values(group)
        })
    })
}
