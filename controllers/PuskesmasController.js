

import { get, show } from '../models/PuskesmasModel.js'
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

            const key = `${curr.id}-${curr.nama}-${curr.statusRME}-${curr.jenisPengembangSIM}-${curr.idPengembangSIM}-${curr.namaPengembangSIM}-${curr.idPersetujuanKetentuanAPISatSet}`;
                if (!acc[key]) {
                    acc[key] = {
                        id: curr.id,
                        nama: curr.nama,
                        emailInstitusi:curr.email_institusi,
                        statusRME : curr.statusRME,
                    jenisPengembangSIM : curr.jenisPengembangSIM,
                    idPengembangSIM : curr.idPengembangSIM,
                    namaPengembangSIM : curr.namaPengembangSIM,
                    idPersetujuanKetentuanAPISatSet : curr.idPersetujuanKetentuanAPISatSet,
                        daftarEmail: []
                    };
                }
                acc[key].daftarEmail.push(
                    curr.email,
                   );
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



export const showPuskesmas = (req, res) => {
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