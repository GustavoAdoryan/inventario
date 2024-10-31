"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const uploadMiddleware_1 = __importDefault(require("../middlewares/uploadMiddleware"));
const router = (0, express_1.Router)();
router.get('/products', productController_1.getAllProducts);
router.post('/products', uploadMiddleware_1.default.single('image'), productController_1.createProduct);
router.put('/products/:id', uploadMiddleware_1.default.single('image'), productController_1.updateProduct);
router.delete('/products/:id', productController_1.deleteProduct);
exports.default = router;
