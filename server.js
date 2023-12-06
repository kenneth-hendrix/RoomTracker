const express = require('express');
const fs = require('fs');
const app = express();
const port = 80;

app.use(express.json());

app.use(express.static('public'));

let busyTimer = null;
let finished = null;

app.get('/status', (req, res) => {
    fs.readFile('status.txt', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading status');
            return;
        }
        res.send(data);
    });
});

app.post('/update-status', (req, res) => {
    const newStatus = req.body.status;
    fs.writeFile('status.txt', newStatus, (err) => {
        if (err) {
            res.status(500).send('Error updating status');
            return;
        }
        res.send('Status updated');

        if (newStatus === 'Busy ;)') {
            if (busyTimer) {
                clearTimeout(busyTimer);
            }
            busyTimer = setTimeout(() => {
                fs.writeFile('status.txt', 'Boning In Progress', (err) => {
                    if (err) {
                        console.log('Error updating status to In Progress');
                    }
                });
            }, 1800000); 
            finished = setTimeout(() => {
                fs.writeFile('status.txt', 'Boning Completed', (err) => {
                    if (err) {
                        console.log('Error updating status to In Progress');
                    }
                });
            }, 5400000); 
        } else {
            if (busyTimer) {
                clearTimeout(busyTimer);
                busyTimer = null;
                clearTimeout(finished);
                finished = null;
            }
        }
    });
});

app.post('/submit-rating', (req, res) => {
    const number = req.body.rating;
    fs.appendFile('ratings.txt', ',' + number, (err) => {
        if (err) {
            res.status(500).send('Error updating ratings');
            return;
        }
        res.send('Rating recorded');
    });
});

app.get('/ratings', (req, res) => {
    fs.readFile('ratings.txt', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading status');
            return;
        }
        res.send(data);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://198.74.52.70:${port}`);
});
