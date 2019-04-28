const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('data/animal_info.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to Animal Info database');
    }
});

let app = express();

app.use(express.static('dist'));

app.use(bodyParser.json());

app.use(cors());

app.get('/api/animals', (req, res) => {
    let sql = 'SELECT _id,name,species,genus,family,b_order,b_class,phylum,habitat,conservation FROM animals WHERE active = 1 ORDER BY name';
    let out = []
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            out.push({id: row._id, name: row.name, species: row.species, genus: row.genus, family: row.family, order: row.b_order, bclass: row.b_class, phylum: row.phylum, habitat: row.habitat, conservation: row.conservation});
        });
        res.json(JSON.stringify(out));
    });
});

app.get('/api/exporter', (req, res) => {
    let sql = 'SELECT _id,name,species,genus,family,b_order,b_class,phylum,habitat,conservation FROM animals WHERE active = 1 ORDER BY name';
    let out = []
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            out.push([row.name, row.species, row.genus, row.family, row.b_order, row.b_class, row.phylum, row.habitat, row.conservation]);
        });

        let csvContent = 'name;species;genus;family;order;class;phylum;habitat;conservation_status\n';
        for (let row of out) {
            for (let itm of row) {
                csvContent += itm;
                csvContent += ';';
            }
            csvContent = csvContent.slice(0,-1);
            csvContent += '\n';
        }

        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=animalia.csv'
        });
        res.end(csvContent, 'binary');

    });
});

let server = app.listen(3456, () => {
    console.log('Listening on port 3456');
});

let disconnect_db = function() {
    db.close((err) => {
        if (err) {
            console.error(err.message);
            return 1;
        } else {
            console.log('Closed the database connection.');
        }
    });
};

process.on('SIGINT', () => {
    disconnect_db();
    server.close();
});
