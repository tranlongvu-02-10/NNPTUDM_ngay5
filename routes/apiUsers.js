var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// GET all users (soft delete filter)
router.get('/', async function (req, res) {
    try {
        let data = await userModel
            .find({ isDeleted: false })
            .populate('role', 'name description');
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET user by ID
router.get('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await userModel
            .findOne({ _id: id, isDeleted: false })
            .populate('role', 'name description');
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// CREATE user
router.post('/', async function (req, res) {
    try {
        let newUser = new userModel({
            username: req.body.username,
            password: req.body.password,   // Thực tế nên hash password
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            status: req.body.status,
            role: req.body.role,
            loginCount: req.body.loginCount
        });
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// UPDATE user
router.put('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await userModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// DELETE (soft delete) user
router.delete('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await userModel.findOne({ _id: id, isDeleted: false });
        if (result) {
            result.isDeleted = true;
            await result.save();
            res.send({ message: "Xóa user thành công", data: result });
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST /enable - Kích hoạt user (status = true)  (Yêu cầu 2)
router.post('/enable', async function (req, res) {
    try {
        let { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).send({ message: "Vui lòng cung cấp cả email và username" });
        }

        // Tìm user khớp cả email và username, chưa bị xóa mềm
        let user = await userModel.findOne({
            email: email,
            username: username,
            isDeleted: false
        });

        if (!user) {
            return res.status(404).send({ message: "Thông tin email hoặc username không chính xác" });
        }

        user.status = true;
        await user.save();

        res.send({ message: "Kích hoạt tài khoản thành công", data: user });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST /disable - Vô hiệu hóa user (status = false)  (Yêu cầu 3)
router.post('/disable', async function (req, res) {
    try {
        let { email, username } = req.body;

        if (!email || !username) {
            return res.status(400).send({ message: "Vui lòng cung cấp cả email và username" });
        }

        // Tìm user khớp cả email và username, chưa bị xóa mềm
        let user = await userModel.findOne({
            email: email,
            username: username,
            isDeleted: false
        });

        if (!user) {
            return res.status(404).send({ message: "Thông tin email hoặc username không chính xác" });
        }

        user.status = false;
        await user.save();

        res.send({ message: "Vô hiệu hóa tài khoản thành công", data: user });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;