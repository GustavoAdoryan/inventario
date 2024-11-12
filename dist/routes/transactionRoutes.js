"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const router = (0, express_1.Router)();
router.post('/transactions', transactionController_1.createTransaction);
router.get('/transactions', transactionController_1.listTransactions);
exports.default = router;
