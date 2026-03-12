var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

// GET all roles (soft delete filter)
router.get('/', async function (req, res) {
    try {
        let data = await roleModel.find({ isDeleted: false });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET role by ID
router.get('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await roleModel.findOne({ _id: id, isDeleted: false });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// GET all users belonging to a role  (Yêu cầu 4)
router.get('/:id/users', async function (req, res) {
    try {
        let id = req.params.id;

        // Kiểm tra role tồn tại
        let role = await roleModel.findOne({ _id: id, isDeleted: false });
        if (!role) {
            return res.status(404).send({ message: "Role ID NOT FOUND" });
        }

        // Lấy tất cả user có role = id và chưa bị xóa mềm
        let users = await userModel
            .find({ role: id, isDeleted: false })
            .populate('role', 'name description');

        res.send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// CREATE role
router.post('/', async function (req, res) {
    try {
        let newRole = new roleModel({
            name: req.body.name,
            description: req.body.description
        });
        await newRole.save();
        res.status(201).send(newRole);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// UPDATE role
router.put('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await roleModel.findOneAndUpdate(
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

// DELETE (soft delete) role
router.delete('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await roleModel.findOne({ _id: id, isDeleted: false });
        if (result) {
            result.isDeleted = true;
            await result.save();
            res.send({ message: "Xóa role thành công", data: result });
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;