import express from 'express'
import { login } from '../controllers/UserController.js'
import { verifyToken } from '../middleware/VerifyToken.js'
import { getRumahSakit, showRumahSakit } from '../controllers/RumahSakitController.js'
import { getPraktekMandiri, showPraktekMandiri  } from '../controllers/PraktekMandiriController.js'
import { getKlinik, showKlinik  } from '../controllers/KlinikController.js'
import { getLabKes, showLabKes } from '../controllers/LabKesController.js'
import { getUTD,showUTD } from '../controllers/UTDController.js'
import { getPraktekMandiriNakes } from '../controllers/PraktekMandiriNakesController.js'
import { insertPraktekMandiriReview } from '../controllers/PraktekMandiriReview.js'
import { getProvinsi } from '../controllers/ProvinsiController.js'
import { getKabKota } from '../controllers/KabKotaController.js'
import { getKlinikPelayanan } from '../controllers/KlinikPelayananController.js'
import { getPraktekMandiriKategori } from '../controllers/PraktekMandiriKategoriController.js'
import { getRumahSakitPelayanan } from '../controllers/RumahSakitPelayananController.js'

const router = express.Router()

// Token
router.post('/faskes/login', login)

// Rumah Sakit
router.get('/faskes/rumahsakit', verifyToken, getRumahSakit)
router.get('/faskes/rumahsakit/:id', verifyToken, showRumahSakit)

// Rumah Sakit Pelayanan
router.get('/faskes/rumahsakitpelayanan', verifyToken, getRumahSakitPelayanan)

// Praktek Mandiri
router.get('/faskes/praktekmandiri', verifyToken, getPraktekMandiri)
router.get('/faskes/praktekmandiri/:id', verifyToken, showPraktekMandiri)
router.get('/faskes/praktekmandirinakes', verifyToken, getPraktekMandiriNakes)

// Praktek Mandiri Review
router.post('/faskes/praktekmandirireview', verifyToken, insertPraktekMandiriReview)

// Prakek Mandiri Kategori
router.get('/faskes/praktekmandirikategori', verifyToken, getPraktekMandiriKategori)

// Klinik
router.get('/faskes/klinik', verifyToken, getKlinik)
router.get('/faskes/klinik/:id', verifyToken, showKlinik)

// Klinik Pelayanan
router.get('/faskes/klinikpelayanan', verifyToken, getKlinikPelayanan)

// LabKes
router.get('/faskes/labkes', verifyToken, getLabKes)
router.get('/faskes/labkes/:id', verifyToken, showLabKes)

// UTD
router.get('/faskes/utd', verifyToken, getUTD)
router.get('/faskes/utd/:id', verifyToken, showUTD)

// Provinsi
router.get('/faskes/provinsi', verifyToken, getProvinsi)

// KabKota
router.get('/faskes/kabkota', verifyToken, getKabKota)

// Praktek Mandiri Nakes
// router.get('/faskes/praktekmandirinakes', verifyToken, getPraktekMandiriNakes)

export default router