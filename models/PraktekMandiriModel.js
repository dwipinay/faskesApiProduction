import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'

export const get = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
        'dbfaskes.trans_final.kode_faskes as id, ' +
        'dbfaskes.trans_final.kode_faskes_baru as idBaru, ' +
        'dbfaskes.data_pm.nama_pm as nama, ' +
        'dbfaskes.kategori_pm.kategori_user as kategori, ' +
        'dbfaskes.data_pm.no_sip as noSIP, ' +
        'dbfaskes.data_pm.tgl_berakhir_sip as tanggalBerakhirSIP, ' +
        'dbfaskes.data_pm.kepemilikan_tempat as kepemilikanTempat, ' +
        'dbfaskes.data_pm.no_str as noSTR, ' +
        'dbfaskes.data_pm.tgl_berakhir_str as tanggalBerakhirSTR, ' +
        'dbfaskes.data_pm.alamat_faskes as alamat, ' +
        'dbfaskes.data_pm.no_telp as noTelp, ' +
        'dbfaskes.data_pm.email as email, ' +
        'dbfaskes.data_pm.id_prov_pm as provinsiId, ' +
        'dbfaskes.propinsi.nama_prop as provinsiNama, ' +
        'dbfaskes.data_pm.id_kota_pm as kabKotaId, ' +
        'dbfaskes.kota.nama_kota as kabKotaNama, ' +
        'dbfaskes.data_pm.id_camat_pm as kecamatanId, ' +
        'dbfaskes.data_pm.puskesmas_pembina as puskesmasPembina, ' +
        'dbfaskes.data_pm.kerja_sama_bpjs_kesehatan as kerjaSamaBPJSKesehatan, ' +
        'dbfaskes.data_pm.berjejaring_fktp as berjejaringFKTP, ' +
        'dbfaskes.data_pm.jam_praktik_senin_pagi as jamPraktikSeninPagi, ' +
        'dbfaskes.data_pm.jam_praktik_senin_sore as jamPraktikSeninSore, ' +
        'dbfaskes.data_pm.jam_praktik_selasa_pagi as jamPraktikSelasaPagi, ' +
        'dbfaskes.data_pm.jam_praktik_selasa_sore as jamPraktikSelasaSore, ' +
        'dbfaskes.data_pm.jam_praktik_rabu_pagi as jamPraktikRabuPagi, ' +
        'dbfaskes.data_pm.jam_praktik_rabu_sore as jamPraktikRabuSore, ' +
        'dbfaskes.data_pm.jam_praktik_kamis_pagi as jamPraktikKamisPagi, ' +
        'dbfaskes.data_pm.jam_praktik_kamis_sore as jamPraktikKamisSore, ' +
        'dbfaskes.data_pm.jam_praktik_jumat_pagi as jamPraktikJumatPagi, ' +
        'dbfaskes.data_pm.jam_praktik_jumat_sore as jamPraktikJumatSore, ' +
        'dbfaskes.data_pm.jam_praktik_sabtu_pagi as jamPraktikSabtuPagi, ' +
        'dbfaskes.data_pm.jam_praktik_sabtu_sore as jamPraktikSabtuSore, ' +
        'dbfaskes.data_pm.jam_praktik_minggu_pagi as jamPraktikMingguPagi, ' +
        'dbfaskes.data_pm.jam_praktik_minggu_sore as jamPraktikMingguSore, ' +
        'dbfaskes.data_pm.latitude, ' +
        'dbfaskes.data_pm.longitude, ' +
        'dbfaskes.data_pm.status_pm as statusAktivasi, ' +
        'dbfaskes.data_pm.created_at, ' +
        'dbfaskes.data_pm.modified_at '

        const sqlFrom = 'FROM dbfaskes.data_pm ' +
        'INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_pm.id_faskes ' +
        'INNER JOIN dbfaskes.propinsi ON dbfaskes.propinsi.id_prop = dbfaskes.data_pm.id_prov_pm ' +
        'INNER JOIN dbfaskes.kota ON dbfaskes.kota.id_kota = dbfaskes.data_pm.id_kota_pm ' +
        'INNER JOIN dbfaskes.kategori_pm ON dbfaskes.kategori_pm.id = dbfaskes.data_pm.id_kategori '

    const sqlOrder = ' ORDER BY dbfaskes.data_pm.id_prov_pm,' +
        'dbfaskes.data_pm.id_kota_pm '

    const sqlLimit = 'LIMIT ? '
    
    const sqlOffSet = 'OFFSET ?'
    
    const sqlWhere = 'WHERE dbfaskes.trans_final.kode_faskes IS NOT NULL AND dbfaskes.trans_final.kode_faskes <> "" AND '

    const filter = []
    const sqlFilterValue = []

    const provinsiId = req.query.provinsiId || null
    const kabKotaId = req.query.kabKotaId || null
    const kategoriId = req.query.kategoriId || null
    const nama = req.query.nama || null

    if (provinsiId != null) {
        filter.push("dbfaskes.data_pm.id_prov_pm = ?")
        sqlFilterValue.push(provinsiId)
    }

    if (kabKotaId != null) {
        filter.push("dbfaskes.data_pm.id_kota_pm = ?")
        sqlFilterValue.push(kabKotaId)
    }

    if (kategoriId != null) {
        filter.push("dbfaskes.data_pm.id_kategori = ?")
        sqlFilterValue.push(kategoriId)
    }

    if (nama != null) {
        filter.push("dbfaskes.data_pm.nama_pm like ?")
        sqlFilterValue.push('%'.concat(nama).concat('%'))
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = 'WHERE dbfaskes.trans_final.kode_faskes IS NOT NULL'
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
        const sqlSelectCount = 'SELECT count(dbfaskes.trans_final.kode_faskes) as total_row_count '
        const sqlCount = sqlSelectCount.concat(sqlFrom).concat(sqlFilter)
        databaseFKTP.query(sqlCount, {
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
    const sql = 'SELECT ' +
        'dbfaskes.trans_final.kode_faskes as id, ' +
        'dbfaskes.trans_final.kode_faskes_baru as idBaru, ' +
        'dbfaskes.data_pm.nama_pm as nama, ' +
        'dbfaskes.kategori_pm.kategori_user as kategori, ' +
        'dbfaskes.data_pm.no_sip as noSIP, ' +
        'dbfaskes.data_pm.tgl_berakhir_sip as tanggalBerakhirSIP, ' +
        'dbfaskes.data_pm.kepemilikan_tempat as kepemilikanTempat, ' +
        'dbfaskes.data_pm.no_str as noSTR, ' +
        'dbfaskes.data_pm.tgl_berakhir_str as tanggalBerakhirSTR, ' +
        'dbfaskes.data_pm.alamat_faskes as alamat, ' +
        'dbfaskes.data_pm.no_telp as noTelp, ' +
        'dbfaskes.data_pm.email as email, ' +
        'dbfaskes.data_pm.id_prov_pm as provinsiId, ' +
        'dbfaskes.propinsi.nama_prop as provinsiNama, ' +
        'dbfaskes.data_pm.id_kota_pm as kabKotaId, ' +
        'dbfaskes.kota.nama_kota as kabKotaNama, ' +
        'dbfaskes.data_pm.id_camat_pm as kecamatanId, ' +
        'dbfaskes.data_pm.puskesmas_pembina as puskesmasPembina, ' +
        'dbfaskes.data_pm.kerja_sama_bpjs_kesehatan as kerjaSamaBPJSKesehatan, ' +
        'dbfaskes.data_pm.berjejaring_fktp as berjejaringFKTP, ' +
        'dbfaskes.data_pm.jam_praktik_senin_pagi as jamPraktikSeninPagi, ' +
        'dbfaskes.data_pm.jam_praktik_senin_sore as jamPraktikSeninSore, ' +
        'dbfaskes.data_pm.jam_praktik_selasa_pagi as jamPraktikSelasaPagi, ' +
        'dbfaskes.data_pm.jam_praktik_selasa_sore as jamPraktikSelasaSore, ' +
        'dbfaskes.data_pm.jam_praktik_rabu_pagi as jamPraktikRabuPagi, ' +
        'dbfaskes.data_pm.jam_praktik_rabu_sore as jamPraktikRabuSore, ' +
        'dbfaskes.data_pm.jam_praktik_kamis_pagi as jamPraktikKamisPagi, ' +
        'dbfaskes.data_pm.jam_praktik_kamis_sore as jamPraktikKamisSore, ' +
        'dbfaskes.data_pm.jam_praktik_jumat_pagi as jamPraktikJumatPagi, ' +
        'dbfaskes.data_pm.jam_praktik_jumat_sore as jamPraktikJumatSore, ' +
        'dbfaskes.data_pm.jam_praktik_sabtu_pagi as jamPraktikSabtuPagi, ' +
        'dbfaskes.data_pm.jam_praktik_sabtu_sore as jamPraktikSabtuSore, ' +
        'dbfaskes.data_pm.jam_praktik_minggu_pagi as jamPraktikMingguPagi, ' +
        'dbfaskes.data_pm.jam_praktik_minggu_sore as jamPraktikMingguSore, ' +
        'dbfaskes.data_pm.latitude, ' +
        'dbfaskes.data_pm.longitude, ' +
        'dbfaskes.data_pm.created_at, ' +
        'dbfaskes.data_pm.modified_at ' +
    'FROM ' +
        'dbfaskes.data_pm INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_pm.id_faskes ' +
        'INNER JOIN dbfaskes.propinsi ON dbfaskes.propinsi.id_prop = dbfaskes.data_pm.id_prov_pm ' +
        'INNER JOIN dbfaskes.kota ON dbfaskes.kota.id_kota = dbfaskes.data_pm.id_kota_pm ' +
        'INNER JOIN dbfaskes.kategori_pm ON dbfaskes.kategori_pm.id =  dbfaskes.data_pm.id_kategori ' +
    'WHERE dbfaskes.trans_final.kode_faskes_baru = ?'

    const sqlFilterValue = [id]
    databaseFKTP.query(sql, {
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