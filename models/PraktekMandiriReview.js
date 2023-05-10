import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'
import dateFormat from 'dateformat'

export const insert = async (req, callback) => {
    const trans = await databaseFKTP.transaction();
    try {
        // Ubah Tanggal Waktu ISO UTC ke Zona WIB
        const checkInTime = new Date(req.body.info['checkin-time'])
        const checkInTimeLocaleDateTime = checkInTime.toLocaleString('en-US', {timeZone: 'Asia/Jakarta'})

        const reviewTime = new Date(req.body.info['review-time'])
        const reviewTimeLocaleDateTime = reviewTime.toLocaleString('en-US', {timeZone: 'Asia/Jakarta'})

        // Hitung hasil penilaian
        // const positiveResponse = req.body.reviews.filter((record) => {
        //     return record.answer.substring(0, 1) === '1'
        // })
        // const ratingResult = positiveResponse.length > 3 ? 1 : 0 

        const header = [
            req.body.doctor.fasyankes_code,
            req.body.doctor.nik,
            req.body.doctor.str_code,
            req.body.doctor.health_worker_name,
            req.body.doctor.specialization,
            dateFormat(checkInTimeLocaleDateTime, 'yyyy-mm-dd HH:MM:ss'),
            dateFormat(reviewTimeLocaleDateTime, 'yyyy-mm-dd HH:MM:ss'),
            req.body.info.visit_date,
            req.body.result.resultDescription,
            req.body.result.resultPoint
        ]

        const sqlInsertHeader = 'INSERT INTO dbfaskes.review ' +
            '(`fasyankes_code`,`str_code`,`health_worker_name`,`specialization`,`checkin_time`,`review_time`,`result_description`,`result_point`) ' +
            'VALUES (?)'

        const insertHeader = await databaseFKTP.query(sqlInsertHeader, { 
            type: QueryTypes.INSERT,
            replacements: [header],
            transaction: trans
        })

        const details = req.body.reviews.map((value, index) => {
            return [
                insertHeader[0],
                value.code,
                value.question,
                value.questionDescription,
                value.answer,
                value.answerPoint
            ]
        })

        const sqlInsertDetails = 'INSERT INTO dbfaskes.review_detail ' +
        '(`review_id`,`qustionId`,`question`,`question_description`,`answer`,`answer_point`) ' +
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