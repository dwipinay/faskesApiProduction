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

const router = express.Router()

// Token
router.post('/faskes/login', login)

// Rumah Sakit
router.get('/faskes/rumahsakit', verifyToken, getRumahSakit)

// Praktek Mandiri
router.get('/faskes/praktekmandiri', verifyToken, getPraktekMandiri)
router.get('/faskes/praktekmandiri/:id', verifyToken, showPraktekMandiri)

// Praktek Mandiri Review
router.post('/faskes/praktekmandirireview', verifyToken, insertPraktekMandiriReview)

// Klinik
router.get('/faskes/klinik', verifyToken, getKlinik)
router.get('/faskes/klinik/:id', verifyToken, showKlinik)

// LabKes
router.get('/faskes/labkes', verifyToken, getLabKes)
router.get('/faskes/labkes/:id', verifyToken, showLabKes)

// UTD
router.get('/faskes/utd', verifyToken, getUTD)
router.get('/faskes/utd/:id', verifyToken, showUTD)

// Praktek Mandiri Nakes
router.get('/faskes/praktekmandirinakes', verifyToken, getPraktekMandiriNakes)

export default router