import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path'

import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';

import morgan from 'morgan';
import bodyParser from 'body-parser';

import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';

import api from './routes';

const sslOption = {
    ca: fs.readFileSync('C:/ssl/swift.kro.kr/ca.cer'),
    key: fs.readFileSync('C:/ssl/swift.kro.kr/swift.kro.kr.key'),
    cert: fs.readFileSync('C:/ssl/swift.kro.kr/fullchain.cer')
}

const app = express();
const port = 3000;
const devPort = 4000;

http.createServer(app).listen(80);
https.createServer(sslOption, app).listen(443);

const contentsPath = (process.env.NODE_ENV === 'production') ? 'build' : 'public';

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

/* mongodb connection */
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => { console.log('Connected to mongodb server'); });
// mongoose.connect('mongodb://username:password@host:port/database=');
mongoose.connect('mongodb://localhost/codelab', {
    authSource: 'admin',
    user: 'chaos',
    pass: 'funkyworld#33',
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/* use session */
app.use(session({
    secret: 'CodeLab1$1$234',
    resave: false,
    saveUninitialized: true
}));

app.use('/', express.static(path.join(__dirname, `../${contentsPath}`)));
app.use('/api', api);

/* support client-side routing */
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, `../${contentsPath}/index.html`));
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broken!');
});

app.listen(port, () => {
    console.log('Express is listening on port', port);
});

if (process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    //const devServer = new WebpackDevServer(webpack(config.devServer), {});
    devServer.listen(devPort, () => {
        console.log('webpack-dev-server is listening on port', port);
    })
}