"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = void 0;
//@ts-check
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const accessTokenSecret = process.env.ACCESS_TOKEN;
const adminAccessTokenSecret = process.env.ADMIN_ACCESS_TOKEN;
var TokenType;
(function (TokenType) {
    TokenType["accessToken"] = "ACCESS_TOKEN_SECRET";
    TokenType["adminAccessToken"] = "ADMIN_ACCESS_TOKEN_SECRET";
    TokenType["refreshToken"] = "REFRESH_TOKEN_SECRET";
    TokenType["resetPassword"] = "RESET_PASSWORD_SECRET";
    TokenType["emailVerification"] = "EMAIL_VERIFICATION_SECRET";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
class EncryptionRepository {
    constructor() {
        this.getTokenKeyByType = (type) => {
            if (type === TokenType.adminAccessToken) {
                return { key: `${adminAccessTokenSecret}`, expiresIn: 1000 * 60 * 60 * 24 * 30 * 2 };
            }
            return { key: `${accessTokenSecret}`, expiresIn: 1000 * 60 * 60 * 24 * 7 };
        };
        this.encryptToken = (data, type) => {
            const token = this.getTokenKeyByType(type);
            return this.jwt.sign(data, token.key, { expiresIn: token.expiresIn });
        };
        this.decryptToken = (data, type) => {
            try {
                const token = this.getTokenKeyByType(type);
                return this.jwt.verify(data, token.key);
            }
            catch (err) {
                console.log(err);
                return null;
            }
        };
        this.createSpecialKey = ({ prefix = '', suffix = '', removeDashes = false }) => {
            const secretKey = this.uuid().split('_').join('');
            if (removeDashes) {
                const secretKeyWithDashes = secretKey.split('_').join('');
                return `${prefix}${secretKeyWithDashes}${suffix}`;
            }
            return `${prefix}${secretKey}${suffix}`;
        };
        this.verifyBearerToken = (data, type) => {
            if (data === null || data === undefined) {
                return { status: false, error: 'Authentication Failed' };
            }
            const tokenKey = this.getTokenKeyByType(type);
            try {
                const token = data.split(" ", 2)[1];
                const decoded = this.jwt.verify(token, tokenKey.key);
                return { status: true, data: decoded };
            }
            catch (error) {
                return { status: false, error: 'Authentication Failed' };
            }
        };
        this.encryptPassword = (password) => {
            return this.bcrypt.hashSync(password, 10);
        };
        this.comparePassword = (password, userPassword) => {
            return this.bcrypt.compareSync(password, userPassword);
        };
        this.generateVerificationCode = (numb) => {
            return Math.floor(Math.random() * ((10 ^ numb) - 1)).toString();
        };
        this.key = 'key';
        this.jwt = jsonwebtoken_1.default;
        this.uuid = uuid_1.v4;
        this.bcrypt = bcryptjs_1.default;
    }
}
exports.default = EncryptionRepository;
