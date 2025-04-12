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
// const MYSQL_CONFIG = {host:'mysqlserver.zg2',user:'root',password:'passw0rd',port:3306,database:'zgdata'};
//For access from the host's node.
const MYSQL_CONFIG = {host:'127.0.0.1',user:'root',password:'passw0rd',port:3306,database:'zgdata'};


// const conn = mysql.createConnection(MYSQL_CONFIG);

// conn.connect();

var conn;

function handleDisconnect() {
    conn = mysql.createConnection(MYSQL_CONFIG); // Recreate the connection, since
                                                  // the old one cannot be reused.

    conn.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
    console.log('SUCCESS: Connection created.');
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
    conn.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();
// Get all notes
app.get('/notes', (req, res) => {
    
    try {
        let search = req.query.search;
        let searchcnt = req.query.searchcontent;
        if (!searchcnt){
            searchcnt = "NO_INPUT";
        }
        console.log("search:"+search+",searchcnt:"+searchcnt);
        let query="select title,idntfr from zgprogram where status=0 ";
        if (search !== "all" && search!==""){
            let searcharr = search.split(' ');
            searcharr.forEach((oneitem)=>{

                if(searchcnt.toUpperCase() !== 'YES'){
                    // query += "and (title like '%"+oneitem+"%') or (idntfr like '%"+oneitem+"%')";
                    query += "and (title like '%"+oneitem+"%') ";
                }else{
                    // query += "and (content like '%"+oneitem+"%' or title like '%"+oneitem+"%') or (idntfr like '%"+oneitem+"%') ";
                    query += "and (content like '%"+oneitem+"%' or title like '%"+oneitem+"%') ";
                }
            });
        }
        query+="order by accessdate desc limit 30";
        console.log(query);
        conn.query(query,(err,result)=>{
            // console.log(result);
            if(err) {
                throw err;
            }
            res.json(result);
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
                if(err) {
                    console.log(result);
                    throw err;
                }
                res.json(result);
            });
        }
    } catch (err) {
        res.send({'error': err.toString()});
    }
})
function refinestring(inp){
    inp =inp.replace(/\\/g,'\\\\');
    inp = inp.replace(/\'/g,'\\\'');
    return (inp);
}
// Add new note
app.put('/onenote', (req, res) => {
    try {
        let noteInfo = req.body;
        let title = '';
        let content = '';
        if(noteInfo.title) title=noteInfo.title;
        if(noteInfo.content) content=noteInfo.content;
        console.log(noteInfo);
        let query = 'select max(convert(idntfr,unsigned integer)) as max from zgprogram';
        console.log(query);
        conn.query(query,(err,result)=>{
            if(err) {
                console.log(result);
                throw err;
            }
            //rt = JSON.parse(result);
            let max= result[0].max+1;
            content = refinestring(content);
            title = refinestring(title);
            let addnew='insert into zgprogram values("'+title+'",\''+content+'\',"'+max.toString().padStart(10,'0')+'",NOW(),0,NOW())';
            let dispaddnew='insert into zgprogram values("'+title+'",\''+content.substring(0,10)+'...\',"'+max.toString().padStart(10,'0')+'",NOW(),0,NOW())';
            console.log(dispaddnew);
            conn.query(addnew,(err,result)=>{
                if(err) {
                    console.log(result);
                    throw err;
                }
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
        // console.log(noteInfo);
        let id = req.query.id;
        let title = '';
        let content = '';
        if(noteInfo.title) title=noteInfo.title;
        if(noteInfo.content) content=noteInfo.content;
        if (title === '' && content === ''){
            res.send({'error': 'Title&Content can not be NULL.'});
        }else{
            content = refinestring(content);
            title = refinestring(title);
            let update='update zgprogram set title="'+title+'",content=\''+content+'\',accessdate=NOW() where idntfr="'+id+'"';
            let dispupdate='update zgprogram set title="'+title+'",content=\''+content.substring(0,10)+'...\',accessdate=NOW() where idntfr="'+id+'"';
            console.log(dispupdate);
            conn.query(update,(err,result)=>{
                if(err) {
                    console.log(result);
                    throw err;
                }
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
            if(err) {
                console.log(result);
                throw err;
            }
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
