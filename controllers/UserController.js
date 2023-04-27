import { get } from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import jsonWebToken from 'jsonwebtoken'
import dateFormat from 'dateformat'
import Joi from 'joi'

export const login = (req, res) => {
    get(req, (err, results) => {
        const schema = Joi.object({
            userName: Joi.string().required(),
            password: Joi.string().required()
        })
    
        const { error, value } =  schema.validate(req.body)
    
        if (error) {
            res.status(400).send({
                status: false,
                message: error.details[0].message
            })
            return
        }


        if (!results.length) {
            res.status(404).send({
                status: false,
                message: 'userName not found'
            })
            return
        }

        bcrypt.compare(req.body.password, results[0].password, (err2, res2) => {
            if(res2 == false) {
                res.status(401).send({
                    status: false,
                    message: 'Unauthorized'
                })
                return;
            }

            const payLoad = {
                id: results[0].id,
                user_name: results[0].user_name
            }

            const accessToken = jsonWebToken.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN})

            jsonWebToken.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
                const refreshToken = jsonWebToken.sign(payLoad, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN})
                const iat = dateFormat(new Date(result.iat * 1000), "yyyy-mm-dd hh:MM:ss TT Z")
                const exp = dateFormat(new Date(result.exp * 1000), "yyyy-mm-dd hh:MM:ss TT Z")

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24
                })

                res.status(201).send({
                    status: true,
                    message: "access token created",
                    data: {
                        access_token: accessToken,
                        issued_at: iat,
                        expired_at: exp,
                        expires_in: process.env.ACCESS_TOKEN_EXPIRESIN
                    }
                })
            })
        })
    })
}