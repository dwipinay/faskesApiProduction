import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'
import dateFormat from 'dateformat'

export const insert = async (req, callback) => {
    // const now = new Date()
    // const current = '2021-01-01T00:00:00Z'
    // console.log(dateFormat(current,'yyyy-mm-dd HH:MM:ss'))
    
    const trans = await databaseFKTP.transaction();
    try {
        const header = [
            req.body.doctor.fasyankes_code,
            req.body.doctor.str_code,
            req.body.doctor.health_worker_name,
            req.body.doctor.specialization,
            dateFormat(req.body.info['checkin-time'], 'yyyy-mm-dd HH:MM:ss'),
            dateFormat(req.body.info['review-time'], 'yyyy-mm-dd HH:MM:ss')
        ]

        const sqlInsertHeader = 'INSERT INTO dbfaskes.review ' +
            '(`fasyankes_code`,`str_code`,`health_worker_name`,`specialization`,`checkin_time`,`review_time`) ' +
            'VALUES (?)'

        const insertHeader = await databaseFKTP.query(sqlInsertHeader, { 
            type: QueryTypes.INSERT,
            replacements: [header],
            transaction: trans
        })

        const details = req.body.reviews.map((value, index) => {
            return [
                insertHeader[0],
                value.question,
                value.description,
                value.answer
            ]
        })

        const sqlInsertDetails = 'INSERT INTO dbfaskes.review_detail ' +
        '(`review_id`,`question`,`description`,`answer`) ' +
        'VALUES ?'

        const insertDetail = await databaseFKTP.query(sqlInsertDetails, {
            type: QueryTypes.INSERT,
            replacements: [details],
            transaction: trans
        })

        await trans.commit()
        callback(null, insertHeader)
    } catch (error) {
        await trans.rollback()
        callback(error, null)
    }
}