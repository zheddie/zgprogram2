const fs = require('fs')
const mysql = require('mysql');
var express = require('express');

var app = express();
app.use(express.json({limit: '25mb', extended: true}));
app.use(express.urlencoded({limit: '25mb', extended: true}));
app.use(express.json()); // JSON parser for post request
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // For POST CORS Error
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next();
});
// var bodyParser = {
//     json: {limit: '50mb', extended: true},
//     urlencoded: {limit: '50mb', extended: true}
//   };

//setup mysql
const MYSQL_CONFIG = {host:'mysqlserver',user:'root',password:'passw0rd',port:3306,database:'zgdata'};

const conn = mysql.createConnection(MYSQL_CONFIG);

conn.connect();

// Get all notes
app.get('/notes', (req, res) => {
    
    try {
        let search = req.query.search;
        console.log("search:"+search);
        let query="select title,idntfr from zgprogram where status=0 ";
        if (search !== "all" && search!==""){
            query += "and content like '%"+search+"%' or title like '%"+search+"%'";
        }
        query+="order by accessdate desc limit 30";
        console.log(query);
        conn.query(query,(err,result)=>{
            if(err) throw err;
            // console.log(result);
            res.json(result);
            //res.json(JSON.parse(data));
        });
        
    } catch (err) {
        res.send({'error': err.toString()});
    }
});

// Get one note details
app.get('/onenote', (req, res) => {
    try {
        let id = req.query.id;
        let query='';
        if (id !== ""){
            // id = id.padStart(10,'0');
            if(id[0] !== '0') id='0'+id;
            query="select * from zgprogram where idntfr like '%"+id+"'";
            console.log(query);
            conn.query(query,(err,result)=>{
                if(err) throw err;
                res.json(result);
            });
        }
    } catch (err) {
        res.send({'error': err.toString()});
    }
})
// Add new note
app.put('/onenote', (req, res) => {
    try {
        let noteInfo = req.body;
        let title = '';
        let content = '';
        if(noteInfo.title) title=noteInfo.title;
        if(noteInfo.content) content=noteInfo.content;
        let query = 'select max(convert(idntfr,unsigned integer)) as max from zgprogram';
        conn.query(query,(err,result)=>{
            if(err) throw err;
            //rt = JSON.parse(result);
            let max= result[0].max+1;
            let addnew='insert into zgprogram values("'+title+'",\''+content+'\',"'+max.toString().padStart(10,'0')+'",NOW(),0,NOW())';
            console.log(addnew);
            conn.query(addnew,(err,result)=>{
                if(err) throw err;
                console.log(result);
            });
        });
        res.send({'success': 'Add new note successfully.'});
    } catch (err) {
        res.send({'error': err.toString()});
    }
})
// Update onenote
app.post('/onenote', (req, res) => {
    try {
        let noteInfo = req.body;
        console.log(noteInfo);
        let id = req.query.id;
        let title = '';
        let content = '';
        if(noteInfo.title) title=noteInfo.title;
        if(noteInfo.content) content=noteInfo.content;
        if (title === '' && content === ''){
            res.send({'error': 'Title&Content can not be NULL.'});
        }else{
            let update='update zgprogram set title="'+title+'",content=\''+content+'\',accessdate=NOW() where idntfr="'+id+'"';
            console.log(update);
            conn.query(update,(err,result)=>{
                if(err) throw err;
                console.log(result);
            });
            res.send({'success': 'Update note successfully.'});
        }
    } catch (err) {
        res.send({'error': err.toString()});
    }
});
// Delete one note
app.delete('/onenote', (req, res) => {
    try {
        let id = req.query.id;
        let strdelete='update zgprogram set status=-3 where idntfr="'+id+'"';
        console.log(strdelete);
        conn.query(strdelete,(err,result)=>{
            if(err) throw err;
            console.log(result);
        });
        res.send({'success': 'Delete note successfully.'});
    } catch (err) {
        res.send({'error': err.toString()});
    }
})

const port = 18701
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})
