const User = require('../models/User');

const getPreferences = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('preferences');

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        res.json(user.preferences);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error retrieving preferences.');
    }
};

const updatePreferences = async (req, res) => {
    const { categories, sources } = req.body;

    if (!categories && !sources) {
        return res.status(400).json({ msg: 'Please provide categories or sources to update.' });
    }

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        const newPreferences = {};

        // Use Mongoose dot notation to target nested fields for update
        if (categories) newPreferences['preferences.categories'] = categories;
        if (sources) newPreferences['preferences.sources'] = sources;

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: newPreferences },
            { new: true, runValidators: true, select: 'preferences' }
        );

        res.json({
            msg: 'Preferences updated successfully.',
            preferences: user.preferences
        });

    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Validation error: Check format of categories/sources.' });
        }
        res.status(500).send('Server Error updating preferences.');
    }
};

module.exports = {
    getPreferences,
    updatePreferences
};