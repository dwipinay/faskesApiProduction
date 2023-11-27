import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
    'dbfaskes.puskesmas_pusdatin.`kode_baru` as id, ' +
    'dbfaskes.puskesmas_pusdatin.`name` as nama, ' +
    'dbfaskes.registrasi_user.email, ' +
    'CASE ' +
    'WHEN dbfaskes.data_rme.status = 1 THEN "Ya" ' +
    'WHEN dbfaskes.data_rme.status = 0 THEN "Tidak" ' +
    'END as statusRME, ' +
    'dbfaskes.m_jenis_vendor.nama as jenisPengembangSIM, ' +
    'dbfaskes.sim_pengembang.id as idPengembangSIM, ' +
    'dbfaskes.sim_pengembang.nameFacility as namaPengembangSIM, ' +
    'dbfaskes.data_rme.persetujuan_ketentuan_satset_id as idPersetujuanKetentuanAPISatSet '

    const sqlFrom = 'FROM dbfaskes.puskesmas_pusdatin ' +
'LEFT OUTER JOIN dbfaskes.data_rme ON dbfaskes.data_rme.id_faskes = dbfaskes.puskesmas_pusdatin.kode_sarana ' +
'		LEFT OUTER JOIN dbfaskes.registrasi_user ON dbfaskes.registrasi_user.id_faskes = dbfaskes.puskesmas_pusdatin.kode_sarana ' +
'LEFT OUTER JOIN dbfaskes.sim_pengembang ON dbfaskes.data_rme.sim_pengembang_id = dbfaskes.sim_pengembang.id ' +
'LEFT JOIN dbfaskes.m_jenis_vendor ON dbfaskes.m_jenis_vendor.id = dbfaskes.data_rme.jenis_vendor_id ' 
    
    const sqlOrder = ' ORDER BY dbfaskes.puskesmas_pusdatin.`kode_baru` '

    const sqlLimit = 'LIMIT ? '
    
    const sqlOffSet = 'OFFSET ? '
    
    const sqlWhere = ' WHERE dbfaskes.puskesmas_pusdatin.operasional = "TRUE" AND dbfaskes.puskesmas_pusdatin.`kode_baru` is not null  AND dbfaskes.puskesmas_pusdatin.`kode_baru` != "#N/A" '

    const filter = []
    const sqlFilterValue = []

    const provinsiId = req.query.provinsiId || null
    const kabKotaId = req.query.kabKotaId || null

    if (provinsiId != null) {
        filter.push("dbfaskes.puskesmas_pusdatin.provinsi_code = ?")
        sqlFilterValue.push(provinsiId)
    }

    if (kabKotaId != null) {
        filter.push("dbfaskes.puskesmas_pusdatin.kabkot_code = ?")
        sqlFilterValue.push(kabKotaId)
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = ' WHERE dbfaskes.puskesmas_pusdatin.operasional = "TRUE" AND dbfaskes.puskesmas_pusdatin.`kode_baru` is not null  AND dbfaskes.puskesmas_pusdatin.`kode_baru` != "#N/A" '
    } else {
        filter.forEach((value, index) => {
            if (index == 0) {
                sqlFilter = sqlWhere.concat(value)
            } else if (index > 0) {
                sqlFilter = sqlFilter.concat(' and ').concat(value)
            }
        })
    }

    const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)

    databaseFKTP.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(dbfaskes.puskesmas_pusdatin.`kode_baru`) as total_row_count '
        const sqlCount = sqlSelectCount.concat(sqlFrom).concat(sqlFilter)
        databaseFKTP.query(sqlCount, {
            type: QueryTypes.SELECT,
            replacements: sqlFilterValue
        })
        .then(
            (resCount) => {
                const newArr = res.map((element, index) => {
                    return {
                        id: element.id,
                        nama: element.nama,
                        rme: {
                            idPengembangSIM: element.idPengembangSIM,
                            namaPengembangSIM: element.namaPengembangSIM,
                            idPersetujuanKetentuanAPISatSet: element.idPersetujuanKetentuanAPISatSet
                        }
                    }
                })
                const data = {
                    totalRowCount: resCount[0].total_row_count,
                    page: page,
                    limit: limit,
                    data: res
                }
                callback(null, data)
            },(error) => {
                throw error
            }
        )
        .catch((error) => {
            throw error
        })
    })
    .catch((error) => {
        callback(error, null)
    })
}



