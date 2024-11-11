"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const supplierRoutes_1 = __importDefault(require("./routes/supplierRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, body_parser_1.json)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Sistema de Gestão de Inventário');
});
app.use('/api', productRoutes_1.default);
app.use('/api', clientRoutes_1.default);
app.use('/api', supplierRoutes_1.default);
app.use('/api', orderRoutes_1.default);
database_1.default.sync({ force: false }).then(() => {
    console.log('Banco de dados sincronizado');
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
