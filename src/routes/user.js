const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth');



/*
@path - /api/v1/user/preferences
@method - GET
@desc Fetches the currently saved news preferences for the authenticated user.
@access - Private
*/
router.get('/preferences', authMiddleware, userController.getPreferences);

/*
@path - /api/v1/user/preferences
@method - PUT
@desc Updates the news preferences (categories/sources) for the authenticated user.
@access - Private
*/
router.put('/preferences', authMiddleware, userController.updatePreferences);

module.exports = router;