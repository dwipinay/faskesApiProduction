import { QueryTypes } from 'sequelize'
import { databaseFKRTL } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT db_fasyankes.`data`.Propinsi as kode, ' +
        'db_fasyankes.`data`.RUMAH_SAKIT AS nama, ' +
        'db_fasyankes.m_jenis.alias AS jenis, ' +
        'db_fasyankes.m_kelas.kelas AS kelas, ' +
        'db_fasyankes.`data`.TELEPON AS telepon, ' +
        'db_fasyankes.`data`.WEBSITE AS website, ' +
        'db_fasyankes.`m_blu`.blu AS statusBLU, ' +
        'db_fasyankes.`data`.NO_SURAT_IJIN AS noSuratIjinOperasional, ' +
        'db_fasyankes.`data`.TANGGAL_SURAT_IJIN AS tanggalSuratIjinOperasional, ' +
        'db_fasyankes.`data`.DIREKTUR_RS AS direktur, ' +
        'db_fasyankes.m_simrs.simrs AS ketersediaanSIMRS, ' +
        'db_fasyankes.`data`.LUAS_TANAH AS luasTanah, ' +
        'db_fasyankes.`data`.LUAS_BANGUNAN AS luasBangunan, ' +
        'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
        'db_fasyankes.m_blu.blu as statusBLU, ' +
        'db_fasyankes.t_dok_tariflayanan_rs.url as urlTarif, ' +
        'db_fasyankes.`data`.ALAMAT AS alamat, ' +
        'db_fasyankes.`data`.provinsi_id, ' +
        'reference.provinsi.nama as provinsiNama, ' +
        'db_fasyankes.`data`.kab_kota_id, ' +
        'reference.kab_kota.nama as kabKotaNama, ' +
        'db_fasyankes.koordinat.long as longitude, ' +
        'db_fasyankes.koordinat.alt as latitude, ' +
        'db_fasyankes.`data`.aktive as statusAktivasi, ' +
        'db_fasyankes.`data`.TANGGAL_UPDATE as modified_at '

        const sqlFrom = 'FROM db_fasyankes.`data` INNER JOIN reference.provinsi ' +
        'ON reference.provinsi.id = db_fasyankes.`data`.provinsi_id ' +
        'LEFT OUTER JOIN reference.kab_kota ' +
        'ON reference.kab_kota.id = db_fasyankes.`data`.kab_kota_id ' +
        'LEFT OUTER JOIN db_fasyankes.m_jenis ' +
        'ON db_fasyankes.m_jenis.id_jenis = db_fasyankes.`data`.JENIS ' +
        'LEFT OUTER JOIN db_fasyankes.m_kelas ' +
        'ON db_fasyankes.m_kelas.id_kelas = db_fasyankes.`data`.KLS_RS ' +
        'LEFT OUTER JOIN db_fasyankes.m_kepemilikan ' +
        'ON db_fasyankes.m_kepemilikan.id_kepemilikan = db_fasyankes.`data`.PENYELENGGARA ' +
        'LEFT OUTER JOIN db_fasyankes.m_blu ON db_fasyankes.m_blu.id_blu = db_fasyankes.`data`.blu  ' +
        'LEFT OUTER JOIN db_fasyankes.koordinat ON db_fasyankes.koordinat.koders = db_fasyankes.`data`.propinsi ' +
        'LEFT OUTER JOIN db_fasyankes.m_simrs ON db_fasyankes.m_simrs.id_simrs = db_fasyankes.`data`.simrs ' +
        'LEFT OUTER JOIN db_fasyankes.t_dok_tariflayanan_rs on db_fasyankes.t_dok_tariflayanan_rs.koders = db_fasyankes.`data`.Propinsi '

        const sqlOrder = ' ORDER BY db_fasyankes.`data`.RUMAH_SAKIT ' 

        const sqlLimit = 'LIMIT ? '
            
        const sqlOffSet = 'OFFSET ?'

        const sqlWhere = 'WHERE db_fasyankes.`data`.JENIS <> 20 AND db_fasyankes.`data`.Propinsi NOT IN ("9999999","7371435","7371121","") AND '

        const filter = []
        const sqlFilterValue = []

        const provinsiId = req.query.provinsiId || null
        const kabKotaId = req.query.kabKotaId || null
        const nama = req.query.nama || null
        const aktive = req.query.aktive || null

        if (provinsiId != null) {
            filter.push("db_fasyankes.`data`.provinsi_id = ?")
            sqlFilterValue.push(provinsiId)
        }

        if (kabKotaId != null) {
            filter.push("db_fasyankes.`data`.kab_kota_id = ?")
            sqlFilterValue.push(kabKotaId)
        }

        if (nama != null) {
            filter.push("db_fasyankes.`data`.RUMAH_SAKIT like ?")
            sqlFilterValue.push('%'.concat(nama).concat('%'))
        }

        if (aktive != null) {
            filter.push("db_fasyankes.`data`.aktive = ?")
            sqlFilterValue.push(aktive)
        }

        sqlFilterValue.push(endIndex)
        sqlFilterValue.push(startIndex)

        let sqlFilter = ''
        if (filter.length == 0) {
            sqlFilter = 'WHERE db_fasyankes.`data`.JENIS <> 20 AND db_fasyankes.`data`.Propinsi NOT IN ("9999999","7371435","7371121","")'
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

    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    }).then((res) => {
        const sqlSelectCount = 'SELECT count(db_fasyankes.`data`.Propinsi) as total_row_count '
        const sqlCount = sqlSelectCount.concat(sqlFrom).concat(sqlFilter)
        databaseFKRTL.query(sqlCount, {
            type: QueryTypes.SELECT,
            replacements: sqlFilterValue
        })
        .then(
            (resCount) => {
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

export const show = (id, callback) => {
    const sql = 'SELECT db_fasyankes.`data`.Propinsi as kode, ' +
        'db_fasyankes.`data`.RUMAH_SAKIT AS nama, ' +
        'db_fasyankes.m_jenis.alias AS jenis, ' +
        'db_fasyankes.m_kelas.kelas AS kelas, ' +
        'db_fasyankes.`data`.TELEPON AS telepon, ' +
        'db_fasyankes.`data`.WEBSITE AS website, ' +
        'db_fasyankes.`m_blu`.blu AS statusBLU, ' +
        'db_fasyankes.`data`.NO_SURAT_IJIN AS noSuratIjinOperasional, ' +
        'db_fasyankes.`data`.TANGGAL_SURAT_IJIN AS tanggalSuratIjinOperasional, ' +
        'db_fasyankes.`data`.DIREKTUR_RS AS direktur, ' +
        'db_fasyankes.m_simrs.simrs AS ketersediaanSIMRS, ' +
        'db_fasyankes.`data`.LUAS_TANAH AS luasTanah, ' +
        'db_fasyankes.`data`.LUAS_BANGUNAN AS luasBangunan, ' +
        'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
        'db_fasyankes.m_blu.blu as statusBLU, ' +
        'db_fasyankes.t_dok_tariflayanan_rs.url as urlTarif, ' +
        'db_fasyankes.`data`.ALAMAT AS alamat, ' +
        'db_fasyankes.`data`.provinsi_id, ' +
        'reference.provinsi.nama as provinsiNama, ' +
        'db_fasyankes.`data`.kab_kota_id, ' +
        'reference.kab_kota.nama as kabKotaNama, ' +
        'db_fasyankes.koordinat.long as longitude, ' +
        'db_fasyankes.koordinat.alt as latitude, ' +
        'db_fasyankes.`data`.aktive as statusAktivasi, ' +
        'db_fasyankes.`data`.TANGGAL_UPDATE as modified_at ' +
    'FROM ' +
        'db_fasyankes.`data` INNER JOIN reference.provinsi ' +
        'ON reference.provinsi.id = db_fasyankes.`data`.provinsi_id ' +
        'LEFT OUTER JOIN reference.kab_kota ' +
        'ON reference.kab_kota.id = db_fasyankes.`data`.kab_kota_id ' +
        'LEFT OUTER JOIN db_fasyankes.m_jenis ' +
        'ON db_fasyankes.m_jenis.id_jenis = db_fasyankes.`data`.JENIS ' +
        'LEFT OUTER JOIN db_fasyankes.m_kelas ' +
        'ON db_fasyankes.m_kelas.id_kelas = db_fasyankes.`data`.KLS_RS ' +
        'LEFT OUTER JOIN db_fasyankes.m_kepemilikan ' +
        'ON db_fasyankes.m_kepemilikan.id_kepemilikan = db_fasyankes.`data`.PENYELENGGARA ' +
        'LEFT OUTER JOIN db_fasyankes.m_blu ON db_fasyankes.m_blu.id_blu = db_fasyankes.`data`.blu  ' +
        'LEFT OUTER JOIN db_fasyankes.koordinat ON db_fasyankes.koordinat.koders = db_fasyankes.`data`.propinsi ' +
        'LEFT OUTER JOIN db_fasyankes.m_simrs ON db_fasyankes.m_simrs.id_simrs = db_fasyankes.`data`.simrs ' +
        'LEFT OUTER JOIN db_fasyankes.t_dok_tariflayanan_rs on db_fasyankes.t_dok_tariflayanan_rs.koders = db_fasyankes.`data`.Propinsi ' +
    'WHERE db_fasyankes.`data`.Propinsi = ?'

    const sqlFilterValue = [id]
    databaseFKRTL.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    })
    .then(
        (res) => {
            callback(null, res)
        },(error) => {
            throw error
        }
    )
    .catch((error) => {
            console.log(error)
        }
    )
}