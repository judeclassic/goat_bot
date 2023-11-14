"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpServer {
    constructor({ app }) {
        var _a;
        this.close = () => {
            this.httpsServer.close();
        };
        this.port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8088;
        this.app = app;
        this.test(app);
    }
    test(app) {
        app.get('/test', (_req, res) => {
            res.send('server started');
        });
    }
    production() {
        const http = require('http');
        this.httpsServer = http.createServer(this.app);
        this.httpsServer.listen(this.port, () => console.log(`Server in Development Mode and Listening on port ${this.port}`));
        return this.httpsServer;
    }
}
exports.default = HttpServer;
