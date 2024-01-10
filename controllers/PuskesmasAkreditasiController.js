
import paginationDB from '../config/PaginationDB.js'
import { getSertifikasiPuskesmas } from '../models/PuskesmasAkreditasiModel.js'

export const sertifikasiPuskesmas = (req, res) => { 
    getSertifikasiPuskesmas(req, (err, results) => {
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