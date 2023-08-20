const User  = require('../models/user');
const db = require('../models');

exports.follow = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if(user) {  // req.user.id가 followerId, req.params.id가 followingId
            await user.addFollowing(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch(error) {
        console.error(error);
        next(error);
    }
};

exports.unfollow = async (req, res, next) => {
    try {
        const target = db.sequelize.models.Follow.findOne({
            where: {
                followerId: req.user.id,
                followingId: req.params.id
            },
        });
        if(target) {
            db.sequelize.models.Follow.destroy({
                where: {
                    followerId: req.user.id,
                    followingId: req.params.id
                },
            });
            res.send('success');
        } else {
            res.status(404).send('not following');
        }
    } catch(error) {
        console.error(error);
        next(error);
    }
};