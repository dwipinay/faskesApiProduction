import { QueryTypes } from 'sequelize'
import { databaseFKTP } from '../config/Database.js'

export const getDataPm = (id, callback) => {
    const sql = 'SELECT ' +
        'dbfaskes.data_pm.nama_pm AS nama, ' +
        'dbfaskes.data_pm.no_sip, ' +
        'IF (dbfaskes.data_pm.dokumen_sip IS NULL, NULL, CONCAT( "https://registrasifasyankes.kemkes.go.id/assets/uploads/berkas_sip/", dbfaskes.data_pm.dokumen_sip )) AS url_dokumen_sip, '+
        'dbfaskes.data_pm.pelayanan_yang_diberikan, ' +
        'dbfaskes.data_pm.pelayanan_yang_diberikan_lainnya, ' +
        'dbfaskes.data_pm.pelatihan_program_prioritas, ' +
        'dbfaskes.data_pm.pelatihan_program_prioritas_lainnya, ' +
        'dbfaskes.data_pm.jam_praktik_senin_pagi, ' +
        'dbfaskes.data_pm.jam_praktik_senin_sore, ' +
        'dbfaskes.data_pm.jam_praktik_selasa_pagi, ' +
        'dbfaskes.data_pm.jam_praktik_selasa_sore, ' +
        'dbfaskes.data_pm.jam_praktik_rabu_pagi, ' +
        'dbfaskes.data_pm.jam_praktik_rabu_sore, ' +
        'dbfaskes.data_pm.jam_praktik_kamis_pagi, ' +
        'dbfaskes.data_pm.jam_praktik_kamis_sore, ' +
        'dbfaskes.data_pm.jam_praktik_jumat_pagi, ' +
        'dbfaskes.data_pm.jam_praktik_jumat_sore, ' +
        'dbfaskes.data_pm.jam_praktik_sabtu_pagi, ' +
        'dbfaskes.data_pm.jam_praktik_sabtu_sore, ' +
        'dbfaskes.data_pm.jam_praktik_minggu_pagi, ' +
        'dbfaskes.data_pm.jam_praktik_minggu_sore ' +
    'FROM dbfaskes.data_pm ' +
	    'JOIN dbfaskes.trans_final ON dbfaskes.data_pm.id_faskes = dbfaskes.trans_final.id_faskes ' +
    'WHERE dbfaskes.trans_final.kode_faskes = ?'

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

export const getDataDokumen2 = (id, callback) => {
    const sql = 'SELECT ' +
        'dbfaskes.t_img_faskes.gambar AS jenis_dokumen, ' +
        'dbfaskes.t_img_faskes.url_full AS url ' +
    'FROM dbfaskes.t_img_faskes ' +
	    'JOIN dbfaskes.trans_final ON dbfaskes.t_img_faskes.id_faskes = dbfaskes.trans_final.id_faskes ' +
    'WHERE dbfaskes.trans_final.kode_faskes = ?'

    const sqlFilterValue = [id]
    databaseFKTP.query(sql, {
        type: QueryTypes.SELECT,
        replacements: sqlFilterValue
    })
    .then(
        (res) => {
            const data = {
                data: res
            }
            callback(null, data)
        },(error) => {
            throw error
        }
    )
    .catch((error) => {
            console.log(error)
        }
    )
}

export const getDataAlkes = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
        'dbfaskes.alkes_obat_pm.type AS tipe, ' +
        'dbfaskes.alkes_obat_pm.nama_elemen, ' +
        'dbfaskes.alkes_obat_pm.label_nilai_satu, ' +
        'dbfaskes.trans_alkes_pm.is_checked AS nilai_satu, ' +
        'dbfaskes.alkes_obat_pm.label_nilai_dua, ' +
        'dbfaskes.trans_alkes_pm.nilai_dua, ' +
        'dbfaskes.alkes_obat_pm.label_nilai_tiga, ' +
        'dbfaskes.trans_alkes_pm.nilai_tiga '

    const sqlFrom =  'FROM dbfaskes.trans_alkes_pm ' +
        'JOIN dbfaskes.alkes_obat_pm ON dbfaskes.trans_alkes_pm.id_alkes_obat = dbfaskes.alkes_obat_pm.id ' +
        'JOIN dbfaskes.trans_final ON dbfaskes.trans_alkes_pm.id_faskes = dbfaskes.trans_final.id_faskes ' +
        'JOIN dbfaskes.data_pm ON dbfaskes.trans_alkes_pm.id_faskes = dbfaskes.data_pm.id_faskes '

    const sqlOrder = ' '

    const sqlLimit = 'LIMIT ? '
    
    const sqlOffSet = 'OFFSET ?'
    
    const sqlWhere = 'WHERE 1=1 AND '

    const filter = []
    const sqlFilterValue = []

    const kodeFaskes = req.query.kodeFaskes || null

    if (kodeFaskes != null) {
        filter.push("dbfaskes.trans_final.kode_faskes = ?")
        sqlFilterValue.push(kodeFaskes)
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = 'WHERE 1=1'
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

export const getDataDokumen = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
        'dbfaskes.t_img_faskes.gambar AS jenis_dokumen, ' +
        'dbfaskes.t_img_faskes.url_full AS url '

    const sqlFrom =  'FROM dbfaskes.t_img_faskes ' +
        'JOIN dbfaskes.trans_final ON dbfaskes.t_img_faskes.id_faskes = dbfaskes.trans_final.id_faskes '

    const sqlOrder = ' '

    const sqlLimit = 'LIMIT ? '
    
    const sqlOffSet = 'OFFSET ?'
    
    const sqlWhere = 'WHERE 1=1 AND '

    const filter = []
    const sqlFilterValue = []

    const kodeFaskes = req.query.kodeFaskes || null

    if (kodeFaskes != null) {
        filter.push("dbfaskes.trans_final.kode_faskes = ?")
        sqlFilterValue.push(kodeFaskes)
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = 'WHERE 1=1'
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

export const getDataAlkes2 = (id, callback) => {
    const sql = 'SELECT ' +
        'dbfaskes.alkes_obat_pm.type AS tipe, ' +
        'dbfaskes.alkes_obat_pm.nama_elemen, ' +
        'dbfaskes.alkes_obat_pm.label_nilai_satu, ' +
        'dbfaskes.trans_alkes_pm.is_checked AS nilai_satu, ' +
        'dbfaskes.alkes_obat_pm.label_nilai_dua, ' +
        'dbfaskes.trans_alkes_pm.nilai_dua, ' +
        'dbfaskes.alkes_obat_pm.label_nilai_tiga, ' +
        'dbfaskes.trans_alkes_pm.nilai_tiga ' +
    'FROM dbfaskes.trans_alkes_pm ' +
	    'JOIN dbfaskes.alkes_obat_pm ON dbfaskes.trans_alkes_pm.id_alkes_obat = dbfaskes.alkes_obat_pm.id ' +
        'JOIN dbfaskes.trans_final ON dbfaskes.trans_alkes_pm.id_faskes = dbfaskes.trans_final.id_faskes ' +
        'JOIN dbfaskes.data_pm ON dbfaskes.trans_alkes_pm.id_faskes = dbfaskes.data_pm.id_faskes ' +
    'WHERE dbfaskes.trans_final.kode_faskes = ?'

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

export const getDataPembiayaan = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
        'dbfaskes.pembiayaan_kesehatan_pasien.umum, ' +
        '( dbfaskes.pembiayaan_kesehatan_pasien.umum / dbfaskes.pembiayaan_kesehatan_pasien.jumlah * 100 ) AS persen_umum, ' +
        'dbfaskes.pembiayaan_kesehatan_pasien.jkn, ' +
        '( dbfaskes.pembiayaan_kesehatan_pasien.jkn / dbfaskes.pembiayaan_kesehatan_pasien.jumlah * 100 ) AS persen_jkn, ' +
        'dbfaskes.pembiayaan_kesehatan_pasien.asuransi_lainnya, ' +
        '( dbfaskes.pembiayaan_kesehatan_pasien.asuransi_lainnya / dbfaskes.pembiayaan_kesehatan_pasien.jumlah * 100 ) AS persen_asuransi_lainnya, ' +
        'dbfaskes.pembiayaan_kesehatan_pasien.jumlah, ' +
        '( dbfaskes.pembiayaan_kesehatan_pasien.jumlah / dbfaskes.pembiayaan_kesehatan_pasien.jumlah * 100 ) AS persen_jumlah, ' +
        'dbfaskes.pembiayaan_kesehatan_pasien.bulan, ' +
        'dbfaskes.pembiayaan_kesehatan_pasien.tahun ' 

    const sqlFrom = 'FROM dbfaskes.pembiayaan_kesehatan_pasien ' +
	    'JOIN dbfaskes.trans_final ON dbfaskes.pembiayaan_kesehatan_pasien.id_faskes = dbfaskes.trans_final.id_faskes '

    const sqlOrder = ' '

    const sqlLimit = 'LIMIT ? '
    
    const sqlOffSet = 'OFFSET ?'
    
    const sqlWhere = 'WHERE 1=1 AND '

    const filter = []
    const sqlFilterValue = []

    const kodeFaskes = req.query.kodeFaskes || null
    const bulan = req.query.bulan || null
    const tahun = req.query.tahun || null

    if (kodeFaskes != null) {
        filter.push("dbfaskes.trans_final.kode_faskes = ?")
        sqlFilterValue.push(kodeFaskes)
    }

    if (bulan != null) {
        filter.push("dbfaskes.pembiayaan_kesehatan_pasien.bulan = ?")
        sqlFilterValue.push(bulan)
    }

    if (tahun != null) {
        filter.push("dbfaskes.pembiayaan_kesehatan_pasien.tahun = ?")
        sqlFilterValue.push(tahun)
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = 'WHERE 1=1'
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

export const getDataPrognas = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
        'dbfaskes.pelaporan_prognas.stunting_wasting, ' +
        '( dbfaskes.pelaporan_prognas.stunting_wasting / dbfaskes.pelaporan_prognas.jumlah_pasien_satu_bulan * 100 ) AS persen_stunting_wasting, ' +
        'dbfaskes.pelaporan_prognas.tuberculosis, ' +
        '( dbfaskes.pelaporan_prognas.tuberculosis / dbfaskes.pelaporan_prognas.jumlah_pasien_satu_bulan * 100 ) AS persen_tuberculosis, ' +
        'dbfaskes.pelaporan_prognas.hipertensi, ' +
        '( dbfaskes.pelaporan_prognas.hipertensi / dbfaskes.pelaporan_prognas.jumlah_pasien_satu_bulan * 100 ) AS persen_hipertensi, ' +
        'dbfaskes.pelaporan_prognas.diabetes_melitus, ' +
        '( dbfaskes.pelaporan_prognas.diabetes_melitus / dbfaskes.pelaporan_prognas.jumlah_pasien_satu_bulan * 100 ) AS persen_diabetes_melitus, ' +
        'dbfaskes.pelaporan_prognas.kehamilan_risiko_tinggi, ' +
        '( dbfaskes.pelaporan_prognas.kehamilan_risiko_tinggi / dbfaskes.pelaporan_prognas.jumlah_pasien_satu_bulan * 100 ) AS persen_kehamilan_risiko_tinggi, ' +
        'dbfaskes.pelaporan_prognas.imunisasi, ' +
        '( dbfaskes.pelaporan_prognas.imunisasi / dbfaskes.pelaporan_prognas.jumlah_pasien_satu_bulan * 100 ) AS persen_imunisasi, ' +
        'dbfaskes.pelaporan_prognas.jumlah_pasien_satu_bulan, ' +
        '( dbfaskes.pelaporan_prognas.jumlah_pasien_satu_bulan / dbfaskes.pelaporan_prognas.jumlah_pasien_satu_bulan * 100 ) AS persen_jumlah, ' +
        'dbfaskes.pelaporan_prognas.bulan, ' +
        'dbfaskes.pelaporan_prognas.tahun  ' 

    const sqlFrom = 'FROM dbfaskes.pelaporan_prognas ' +
	    'JOIN dbfaskes.trans_final ON dbfaskes.pelaporan_prognas.id_faskes = dbfaskes.trans_final.id_faskes '

    const sqlOrder = ' '

    const sqlLimit = 'LIMIT ? '
    
    const sqlOffSet = 'OFFSET ?'
    
    const sqlWhere = 'WHERE 1=1 AND '

    const filter = []
    const sqlFilterValue = []

    const kodeFaskes = req.query.kodeFaskes || null
    const bulan = req.query.bulan || null
    const tahun = req.query.tahun || null

    if (kodeFaskes != null) {
        filter.push("dbfaskes.trans_final.kode_faskes = ?")
        sqlFilterValue.push(kodeFaskes)
    }

    if (bulan != null) {
        filter.push("dbfaskes.pelaporan_prognas.bulan = ?")
        sqlFilterValue.push(bulan)
    }

    if (tahun != null) {
        filter.push("dbfaskes.pelaporan_prognas.tahun = ?")
        sqlFilterValue.push(tahun)
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = 'WHERE 1=1'
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

export const getDataHipertensi = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
        'dbfaskes.kepatuhan_kunjungan_pasien_hipertensi.pasien_patuh, ' +
        'dbfaskes.kepatuhan_kunjungan_pasien_hipertensi.jumlah_pasien_hipertensi, ' +
        'dbfaskes.kepatuhan_kunjungan_pasien_hipertensi.persentase, ' +
        'dbfaskes.kepatuhan_kunjungan_pasien_hipertensi.bulan, ' +
        'dbfaskes.kepatuhan_kunjungan_pasien_hipertensi.tahun ' 

    const sqlFrom = 'FROM dbfaskes.kepatuhan_kunjungan_pasien_hipertensi ' +
	    'JOIN dbfaskes.trans_final ON dbfaskes.kepatuhan_kunjungan_pasien_hipertensi.id_faskes = dbfaskes.trans_final.id_faskes '

    const sqlOrder = ' '

    const sqlLimit = 'LIMIT ? '
    
    const sqlOffSet = 'OFFSET ?'
    
    const sqlWhere = 'WHERE 1=1 AND '

    const filter = []
    const sqlFilterValue = []

    const kodeFaskes = req.query.kodeFaskes || null
    const bulan = req.query.bulan || null
    const tahun = req.query.tahun || null

    if (kodeFaskes != null) {
        filter.push("dbfaskes.trans_final.kode_faskes = ?")
        sqlFilterValue.push(kodeFaskes)
    }

    if (bulan != null) {
        filter.push("dbfaskes.kepatuhan_kunjungan_pasien_hipertensi.bulan = ?")
        sqlFilterValue.push(bulan)
    }

    if (tahun != null) {
        filter.push("dbfaskes.kepatuhan_kunjungan_pasien_hipertensi.tahun = ?")
        sqlFilterValue.push(tahun)
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = 'WHERE 1=1'
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

export const getDataOhis = (req, callback) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100

    const startIndex = (page - 1) * limit
    const endIndex = limit

    const sqlSelect = 'SELECT ' +
        'dbfaskes.penurunan_skor_ohis_pasien.pasien_gigi_dengan_penurunan_skor_ohis, ' +
        'dbfaskes.penurunan_skor_ohis_pasien.jumlah_pasien_gigi, ' +
        'dbfaskes.penurunan_skor_ohis_pasien.persentase, ' +
        'dbfaskes.penurunan_skor_ohis_pasien.bulan, ' +
        'dbfaskes.penurunan_skor_ohis_pasien.tahun '

    const sqlFrom = 'FROM dbfaskes.penurunan_skor_ohis_pasien ' +
	    'JOIN dbfaskes.trans_final ON dbfaskes.penurunan_skor_ohis_pasien.id_faskes = dbfaskes.trans_final.id_faskes '

    const sqlOrder = ' '

    const sqlLimit = 'LIMIT ? '
    
    const sqlOffSet = 'OFFSET ?'
    
    const sqlWhere = 'WHERE 1=1 AND '

    const filter = []
    const sqlFilterValue = []

    const kodeFaskes = req.query.kodeFaskes || null
    const bulan = req.query.bulan || null
    const tahun = req.query.tahun || null

    if (kodeFaskes != null) {
        filter.push("dbfaskes.trans_final.kode_faskes = ?")
        sqlFilterValue.push(kodeFaskes)
    }

    if (bulan != null) {
        filter.push("dbfaskes.penurunan_skor_ohis_pasien.bulan = ?")
        sqlFilterValue.push(bulan)
    }

    if (tahun != null) {
        filter.push("dbfaskes.penurunan_skor_ohis_pasien.tahun = ?")
        sqlFilterValue.push(tahun)
    }

    sqlFilterValue.push(endIndex)
    sqlFilterValue.push(startIndex)

    let sqlFilter = ''
    if (filter.length == 0) {
        sqlFilter = 'WHERE 1=1'
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