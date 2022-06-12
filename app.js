const express = require('express');

const app = express();

app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, err => {
    console.log(err || 'Server started running on port', PORT);
})