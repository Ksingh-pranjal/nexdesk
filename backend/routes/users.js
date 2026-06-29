const express = require('express');
const router = express.Router();
const {
    createClient,
    createEngineer,
    getClients,
    getEngineers,
    updateUser,
    deactivateUser,
    activateUser
} = require('../controllers/userController');

const { protect, restrict } = require('../middleware/auth');

router.use(protect);
router.use(restrict('admin'));

router.post('/clients', createClient);
router.get('/clients', getClients);

router.post('/engineers', createEngineer);
router.get('/engineers', getEngineers);

router.patch('/:id', updateUser);
router.delete('/:id', deactivateUser);
router.patch('/:id/activate', activateUser);

module.exports = router;