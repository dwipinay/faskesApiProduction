import { QueryTypes } from 'sequelize'
import { databaseFKRTL } from '../config/Database.js'

export const insert = async (req, callback) => {
    try{
        const record = [
            req.body.pekerjaan_id,
            req.body.biodata_id,
            req.body.kode_rs,
            req.body.nama,
            req.body.nik,
            req.body.no_str,
            req.body.no_sip,
            req.body.jenis_nakes_id,
            req.body.jenis_nakes_nama,
            req.body.sub_kategori_nakes_id,
            req.body.sub_kategori_nakes_nama,
            1
        ]
    
        const sqlInsert = 'INSERT INTO db_fasyankes.nakes_pekerjaan_dua ' +
            '(id, biodata_id, kode_rs, nama, nik, no_str, ' +
            'no_sip, jenis_nakes_id, jenis_nakes_nama, sub_kategori_nakes_id, ' +
            'sub_kategori_nakes_nama, is_active) ' +
            'VALUES ( ? )'
    
        databaseFKRTL.query(sqlInsert, {
            type: QueryTypes.INSERT,
            replacements: [record]
            }
        )
        .then(
            (res) => {
                callback(null, res)
            }
        )
        .catch(
            (error) => {
                callback(error, null)
            }
        )
    } catch (error) {
        await trans.rollback()
        callback(error, null)
    }
}

export const update = (req, id, callback) => {
    const trans_id = parseInt(id)
    const sqlValue = [
        req.body.biodata_id, 
        req.body.nama,
        req.body.nik,
        req.body.no_str,
        req.body.no_sip,
        req.body.jenis_nakes_id,
        req.body.jenis_nakes_nama,
        req.body.sub_kategori_nakes_id,
        req.body.sub_kategori_nakes_nama,
        req.body.is_active,
        trans_id
    ]

    const sql = 'UPDATE db_fasyankes.nakes_pekerjaan_dua SET biodata_id=?, nama=?, nik=?, no_str=?, no_sip=?, ' +
            'jenis_nakes_id=?, jenis_nakes_nama=?, sub_kategori_nakes_id=?,' +
            'sub_kategori_nakes_nama=?, is_active=? ' +
        'WHERE id = ?'
        

    databaseFKRTL.query(sql, {
        type: QueryTypes.UPDATE,
        replacements: sqlValue
        })
    .then(
        (res) => {
            if (res.affectedRows === 0 && res.changedRows === 0) {
                callback(null, 'row not matched');
                return
            }
            let resourceUpdated = {
                id: trans_id
            } 
            callback(null, resourceUpdated);
        },(error) => {
            throw error
        }
    ).catch((error) => {
        callback(error, null)
    })
}

export const softDelete = (id, callback) => {
    const trans_id = parseInt(id)
    const sqlValue = [
        trans_id
    ]

    const sql = 'UPDATE db_fasyankes.nakes_pekerjaan_dua SET is_active=0 ' +
    'WHERE id = ?'
    
    databaseFKRTL.query(sql, {
        type: QueryTypes.UPDATE,
        replacements: sqlValue
        })
    .then(
        (res) => {
            if (res.affectedRows === 0 && res.changedRows === 0) {
                callback(null, 'row not matched');
                return
            }
            let resourceUpdated = {
                id: trans_id
            } 
            callback(null, resourceUpdated);
        },(error) => {
            throw error
        }
    ).catch((error) => {
        callback(error, null)
    })
}