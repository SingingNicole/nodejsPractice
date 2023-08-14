const express = require('express');
const Comment = require('../schemas/comment');

const router = express.Router();

router.post('/', async(req, res, next) => {
    try {
        const comment = await Comment.create({
            commenter: req.body.id,
            comment: req.body.comment,
        });
        console.log(comment);
        const result = await Comment.populate(comment, { path: 'commenter' });
        res.status(201).json(result);
    } catch(err) {
        console.error(err);
        next(err);
    }
});

router.route('/:id')
    .patch(async(req, res, next) => {
        // 최근 버전 mongoose에서는 update를 사용하지 않는다.
        // findOneAndUpdate() 혹은 updateOne 사용.
        /*
        try {
            const result = await Comment.update({
                _id: req.params.id,
            }, {
                comment: req.body.comment,
            });
            res.json(result);
        } catch(err) {
            console.error(err);
            next(err);
        }
        */
       try {
        const result = await Comment.findOneAndUpdate({
            _id: req.params.id,
        }, {
            comment: req.body.comment,
        });
       res.json(result);
       } catch(err) {
        console.error(err);
        next(err);
       }
    })
    .delete(async(req, res, next) => {
        try {
            // const result = await Comment.remove({ _id: req.params.id });
            // 최근 버전 mongoose에서는 remove를 사용하지 않고 deleteOne이나 deleteMany를 사용한다.
            const result = await Comment.deleteOne({ _id: req.params.id });
            res.json(result);
        } catch(err) {
            console.error(err);
            next(err);
        }
    });

module.exports = router;