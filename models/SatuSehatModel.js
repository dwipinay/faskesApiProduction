import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'

export const insert = async (req, callback) => {
    const trans = await databaseFKTP.transaction();
    try {
        const header = [
        req.body.kodeBaru,
        req.body.secretKey,
        req.body.clientId,
        req.body.organizationId
        ]

        const sqlInsertHeader = 'INSERT INTO dbfaskes.satu_sehat_id ' +
            '(`kode_baru_faskes`, `secret_key`, `client_id`, `organization_id`) ' +
            'VALUES (?)'

        const insertHeader = await databaseFKTP.query(sqlInsertHeader, {
            type: QueryTypes.INSERT,
            replacements: [header],
            transaction: trans
        })

        await trans.commit()
        callback(null, insertHeader)
    } catch (error) {
        await trans.rollback()
        callback(error, null)
    }
}