import express from 'express';
import bodyParser from 'body-parser';
import email from './api/email.js';
import emailAttachment from './api/email-attachment.js';

const app = express();

app.use(express.static('public'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const route = express.Router();

const port = process.env.PORT || 5000;

app.use(route);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

route.post('/text-mail', (req, res) => {
    email(req, res);
});


route.post('/attachments-mail', (req, res) => {
    emailAttachment(req, res);
});
