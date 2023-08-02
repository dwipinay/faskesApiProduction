import { insert, update, softDelete } from '../models/RumahSakitNakesModel.js'
import Joi from 'joi'

export const insertRumahSakitNakes = async (req, res) => {
    const schema = Joi.object({
        pekerjaan_id: Joi.number().required(),
        biodata_id: Joi.number().required(),
        kode_rs: Joi.string().required(),
        nama: Joi.string().required(),
        nik: Joi.string().required(),
        no_str: Joi.string().required().allow('').allow(null),
        no_sip: Joi.string().required().allow('').allow(null),
        jenis_nakes_id: Joi.number().required(),
        jenis_nakes_nama: Joi.string().required(),
        sub_kategori_nakes_id: Joi.number().required().allow(null),
        sub_kategori_nakes_nama: Joi.string().required().allow(null)
    });

    const { error, value } =  schema.validate(req.body)
    if (error) {
        res.status(404).send({
            status: false,
            message: error.details[0].message
        })
        return
    }
    
    insert(req, (err, results) => {

        if (err) {
            if (err.name == "SequelizeUniqueConstraintError") {
                res.status(409).send({
                    success: false,
                    message: 'duplicate entry'
                })
            } else {
                res.status(400).send({
                    success: false,
                    message: err
                })
            }
            return
        }

        res.status(200).send({
            success: true,
            message: 'data berhasil disimpan'
        })
    })
}

export const updateRumahSakitNakes = async (req, res) => {
    const schema = Joi.object({
        biodata_id: Joi.number().required(),
        nama: Joi.string().required(),
        nik: Joi.string().required(),
        no_str: Joi.string().required().allow('').allow(null),
        no_sip: Joi.string().required().allow('').allow(null),
        jenis_nakes_id: Joi.number().required(),
        jenis_nakes_nama: Joi.string().required(),
        sub_kategori_nakes_id: Joi.number().required().allow(null),
        sub_kategori_nakes_nama: Joi.string().required().allow(null),
        is_active: Joi.number().required()
    });

    const { error, value } =  schema.validate(req.body)
    if (error) {
        res.status(404).send({
            status: false,
            message: error.details[0].message
        })
        return
    }

    update(req, req.params.id, (err, result) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }
        if (result == 'row not matched') {
            res.status(404).send({
                status: false,
                message: 'data not found'
            })
            return
        }
        res.status(200).send({
            status: true,
            message: "data updated successfully"
        })
    })
}

export const deleteRumahSakitNakes = async (req, res) => {
    softDelete(req.params.id, (err, result) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }
        if (result == 'row not matched') {
            res.status(404).send({
                status: false,
                message: 'data not found'
            })
            return
        }
        res.status(200).send({
            status: true,
            message: "data deleted successfully",
            data: result
        })
    })
}