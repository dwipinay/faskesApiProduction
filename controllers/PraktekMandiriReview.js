import { insert } from '../models/PraktekMandiriReview.js'
import Joi from 'joi'

export const insertPraktekMandiriReview = async (req, res) => {
    const schema = Joi.object({
        doctor: Joi.object().keys({
            fasyankes_code: Joi.string().required(),
            str_code: Joi.string().required(),
            health_worker_name: Joi.string().required(),
            specialization: Joi.string().required(),
        }),
        info: Joi.object().keys({
            ['checkin-time']: Joi.string().required(),
            ['review-time']: Joi.string().required(),
        }),
        result: Joi.object().keys({
            description: Joi.string().required(),
            descriptionPoint: Joi.number().required(),
        }),
        reviews: Joi.array()
            .items(Joi.object().keys({
                code: Joi.string().required(),
                question: Joi.string().required(),
                description: Joi.string().required(),
                answer: Joi.string().required(),
                answerPoint: Joi.number().required()
            })
            )
            .required(),
    });

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
            res.status(400).send({
                success: false,
                message: err
            })
            return
        }

        res.status(200).send({
            success: true,
            message: 'data berhasil disimpan',
            data: {
                id: results[0]
            }
        })
    })
}