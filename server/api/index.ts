import { Router } from 'express'
import live from './live'

const router = Router()

// Add USERS Routes
router.use(live)

export default router
