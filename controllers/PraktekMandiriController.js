import { get, getAsri, show } from '../models/PraktekMandiriModel.js'
import paginationDB from '../config/PaginationDB.js'
import Joi from 'joi'

export const getPraktekMandiri = (req, res) => {
    const schema = Joi.object({
        provinsiId: Joi.string().allow(''),
        kabKotaId: Joi.string().allow('').allow(null),
        kategoriId: Joi.number().allow('').allow(null),
        nama: Joi.string().allow(''),
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

export const showPraktekMandiri = (req, res) => {
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

export const getPraktekMandiriAsri = (req, res) => {
    const schema = Joi.object({
        kodeFaskes: Joi.string().allow(''),
    })

    const { error, value } =  schema.validate(req.query)

    if (error) {
        res.status(400).send({
            status: false,
            message: error.details[0].message
        })
        return
    }
    
    getAsri(req, (err, results) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }


        const group = results.data.reduce((acc, curr) => {

            const key = `${curr.id}-${curr.nama}-${curr.kategori}`;
                if (!acc[key]) {
                    acc[key] = {
                        id: curr.id,
                        nama: curr.nama,
                        email : curr.email,
                        kategori : curr.kategori,
                        daftarNakes: []
                    };
                }
                acc[key].daftarNakes.push({
                    namaNakes : curr.namaNakes,
                    profesiNakes :curr.profesiNakes}
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