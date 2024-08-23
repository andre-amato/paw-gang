"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_MONOGDB_URI = exports.MONGODB_URI = exports.GOOGLE_MAPS_API_KEY = exports.LOCAL_IP_ADDRESS = exports.SERVER_PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
exports.SERVER_PORT = 3001;
exports.LOCAL_IP_ADDRESS = '192.168.0.73';
exports.GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/paw-gang';
exports.TEST_MONOGDB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/paw-gang-test';
