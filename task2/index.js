//curl http://localhost:3000/date?datetime=2021-03-21T10:50:00
const express = require('express');
const app = express();
const LIMIT = 20;
const PORT = 3000;

let connections = [];
let DELAY = 1000;
let tick = 0;

app.get("/date", (req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader("Transfer-Encoding", "chunked");
    connections.push(res);
});

setTimeout(function run(){
    console.log(tick, `(${new Date().toUTCString()})`);

    if(++tick > LIMIT) {
        connections.map(res => {
            res.write(`END: \n(${new Date().toUTCString()})`);
            res.end();           
        });

        connections = [];
        tick = 0;
    }

    connections.map((res, i) => {
        res.write(`connect N${i}. Tick ${new Date().toUTCString()}\n`);
    });

    setTimeout(run, DELAY);
}, DELAY);

app.listen(PORT, () => {
    console.log(`SERVER START. PORT:${PORT}`);
});