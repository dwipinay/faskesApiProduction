import { insert } from '../models/SatuSehatModel.js'
import Joi from 'joi'

export const insertSatuSehatId = async (req, res) => {
    const schema = Joi.object().keys({
            kodeBaru: Joi.string().required(),
            secretKey: Joi.string().required(),
            clientId: Joi.string().required(),
            organizationId: Joi.string().required()
        })
    //     resultReviews: Joi.array()
    //         .items(Joi.object().keys({
    //             code: Joi.string().required(),
    //             type: Joi.string().required(),
    //             questionDescription: Joi.string().required(),
    //             answer: Joi.string().required(),
    //             answerPoint: Joi.number().required(),
    //             answerTime: Joi.string().required(),
    //             subQuestion: Joi.array().items(Joi.object().keys({
    //                 code: Joi.string().required(),
    //                 type: Joi.string().required(),
    //                 questionDescription: Joi.string().required(),
    //                 answer: Joi.string().required(),
    //                 answerPoint: Joi.number().required(),
    //                 answerTime: Joi.string().allow(''),
    //             })
    //             )
    //         })
    //         )
    //         .required(),
    // });

    const { error, value } = schema.validate(req.body);
    if (error) {
        res.status(400).send({
            error: true,
            message: error.details[0].message,
        });
        return;
    }

    insert(req, (err, results) => {

        if (err) {
            if (err.name == "SequelizeUniqueConstraintError") {
                res.status(409).send({
                    success: false,
                    message: 'duplicate entry'
                })
            } else {
                console.log(err)
                res.status(400).send({
                    success: false,
                    message: "Gagal Simpan"
                })
            }
            return
        }

        res.status(200).send({
            success: true,
            message: 'data berhasil disimpan'
            // data: {
            //     id: results[0]
            // }
        })
    })
}

