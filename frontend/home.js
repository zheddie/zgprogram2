// const RESTAPISERVER="http://localhost:18701";
//Try to capture the CMD+s to do the save.
// var saveTimer = setInterval(doAutoSave, 1000*120);
//var displayTimer = setInterval(displayTimer, 1000);
var RefreshButton = setInterval(RefreshButton, 1000);
var HostName  = window.location.hostname
//var RESTAPISERVER="http://"+HostName+":8701";
//Try to using fixed names, which need to define in /etc/hosts
var RESTAPISERVER="http://zgprogram2b.zg.com:8701";

console.log("RESTAPISERVER:"+RESTAPISERVER);
document.addEventListener("keydown", function(e) {
    if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.keyCode == 83) {
      e.preventDefault();
    //   var range0 = $('#summernote').summernote('editor.getLastRange');
      UpdateNote();
    //   const range = $.summernote.range;  // range utility
    //   // set my custom range
    //   $('#summernote').summernote('editor.setLastRange', range.createFromNodeAfter(node).select());
    //   clearInterval(saveTimer);
    //   setInterval(doAutoSave, 1000*120);
      
    }
  }, false);

function go(){
        var searchtxt = document.getElementById('searchinput').value;
        console.log("go.cp0:"+searchtxt);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("go():searchtxt:"+searchtxt);
                displaySearchResult(this);}
        };
        var contentsearch = document.getElementById('contentchk');
        if(contentsearch.checked){
            xhttp.open("GET", RESTAPISERVER+"/notes?search="+searchtxt+"&searchcontent=yes", true);
        }
        else{
            xhttp.open("GET", RESTAPISERVER+"/notes?search="+searchtxt, true);
        }
        xhttp.send();
}

//Add new note
function addnew() {
    var leave = true;
    if(document.pendingchange){
        leave = confirm("You will LOST your local changes in current note. Leave?");
    }
    console.log("addnew.cp0.leave:"+leave);
    if(leave){
        document.getElementById('searchinput').value = "";
        $('#summernote').summernote('disable');
        var title = "//newadded/Title";
        // document.getElementById('title').value = title;
        var markup = '';
        // $('#summernote').summernote('code',markup);
        document.pendingchange = false;
        // markup=markup.replaceAll('\'','\\\'');
        // title=title.replaceAll('\'','\\\'');
        const updateData = {"title":title, "content":markup};
        var xhttp = new XMLHttpRequest();
        xhttp.timeout = 1000;
        xhttp.ontimeout=function(){};
        xhttp.onreadystatechange = function() {
            // console.log("readState:"+this.readyState);
            // console.log("status:"+this.status);
            //Fix the issue of "Add" always failed on Firefox. 
            //Need the status and readyState check.
            if (this.readyState == 4 && this.status == 200) {
                    refreshpage("Add note done!?");
                }
        };
        xhttp.open("PUT", RESTAPISERVER+"/onenote", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(updateData));
   }
};


function deleteNote(){
    if(!document.currentID) alert("Not note was selected!");
    else{
        title = document.getElementById("title").value;
        const cfm = confirm("Delete:["+document.currentID+"]"+title+",SURE?");
        if(cfm){
            $('#summernote').summernote('disable');
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {refreshpage("deleteOneNote done!?");}
            };
            xhttp.open("DELETE", RESTAPISERVER+"/onenote?id="+document.currentID, true);
            xhttp.send(); 
        }       
    }
};
function refreshpage(logmsg) {
    location.reload();
    // console.log(logmsg);
    // go();
};
function UpdateNote() {
    $('#summernote').summernote('disable');
    var markup = $('#summernote').summernote('code');
    var title = document.getElementById('title').value;
    // markup=markup.replaceAll('\'','\\\'');
    // title=title.replaceAll('\'','\\\'');
    // console.log(document.currentID);
    // console.log(title);
    // console.log(markup);
    const updateData = {"title":title, "content":markup};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
                updateOneNote(this);
                // document.seconds = 120;

            }
    };

    xhttp.open("POST", RESTAPISERVER+"/onenote?id="+document.currentID, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(updateData));
    //$('.zclick2edit').summernote('destroy');
};
function updateOneNote(xhttp) {
    console.log("updateOneNote done!?");
    go();
    document.pendingchange = false;
}

// function loadAllNotes() {
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             console.log("loadAllNotes!");
//             displaySearchResult(this);}
//     };
//     xhttp.open("GET", RESTAPISERVER+"/notes?search=all", true);
//     xhttp.send();
// }
function displaySearchResult(xhttp) {
    var notes = JSON.parse(xhttp.responseText);
    var newContent = "<div class='booksGallery'><table>";
    document.currentID ='';
    console.log("notes.length:"+notes.length);
    if (notes.length > 0){
        notes.forEach(function(note) {
            if(!document.currentID || document.currentID===''){
                document.currentID = note.idntfr;
                console.log("FirstIdntfr:"+note.idntfr);
            }
            var processedTitle = note.title;
            var shortnoteid = note.idntfr.slice(-5)
            if (processedTitle.length > 50) { processedTitle = processedTitle.substring(0, 48) + "..."; } 
            if (processedTitle === "") processedTitle = "____BLANK____";
            //newContent += `<tr><td><div class="gallery"><a target="_blank" href="${processedTitle}>"</a>`+
            newContent += `<tr><td><div class="gallery">`+
            // `<div id="id${note.idntfr}" onClick=getNoteDetails('${note.idntfr}') onMouseOver="onmouseover('${note.idntfr}')" class='galleryTitle'>${processedTitle}</div></div>`+
            `<div id="id${note.idntfr}" onmouseover="itemmouseover('${note.idntfr}')" onmouseout="itemmouseout('${note.idntfr}')" onClick=getNoteDetails('${note.idntfr}') class='galleryTitle'>${shortnoteid}${processedTitle}</div></div>`+
            `</td></tr>`;
            // newContent += `<div class="gallery"><a target="_blank" href="${book.web_url}">` + 
            //               `<img id="bookImage" src="${book.image_url}" width="600" height="400"></a>` + 
            //               `<div onClick=getBookDetails('${book.title.replace(/\s/g, '%20')}') class='galleryTitle'>${processedTitle}</div></div>`;
        })

        newContent += "</table></div>";
        
        var div = document.getElementById("id"+document.currentID);
        if(div){
            div.style.backgroundColor = "green";
            div.style.color="white";
        }
    }else{
        newContent += "</table></div>";
    }
    document.getElementById("searchResult").innerHTML = newContent;
    console.log("currentID:"+document.currentID);
    // console.log(document.currentID);
    getNoteDetails(document.currentID);
    document.pendingchange = false;
}
function itemmouseover(id){
    var idstr="id"+id;
    var div = document.getElementById(idstr);
    if(div){
        div.style.backgroundColor = "gray";
    }
}
function itemmouseout(id){
    var idstr="id"+id;
    var div = document.getElementById(idstr);
    if(div){
        div.style.backgroundColor = "white";
    }
    if(document.currentID === id){
        div.style.backgroundColor = "green";
        div.style.color="white";
    }
}
function getNoteDetails(idntfr) {
    var leave = true;
    if(document.pendingchange){
        leave = confirm("You will LOST your local changes in current note. Leave?");
    }
    if (leave){
        if(idntfr === ''){
            $('#summernote').summernote("code",'');
            document.getElementById("title").value = '';
        }else{
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {displayNoteDetail(this);}
                document.pendingchange = false;
            };
            
            xhttp.open("GET", RESTAPISERVER+`/onenote?id=${idntfr}`, true);
            xhttp.send();
        }
    }
}
function displayNoteDetail(xhttp) {
    var jsonData = JSON.parse(xhttp.responseText);
    // console.log(jsonData);
    var noteTitle = jsonData[0]['title'];
    var noteMain = jsonData[0]['content'];
    var dispdate = jsonData[0]['accessdate'];
    // dispdate = dispdate.substring(5,10)+"/"+dispdate.substring(11,16);
    if (document.currentID) {
        var div = document.getElementById("id"+document.currentID);
        if(div){
            div.style.backgroundColor = "white";
            div.style.color="black";
        }
    }
    document.currentID = jsonData[0]['idntfr'];
    var div = document.getElementById("id"+document.currentID);
    if(div){
        div.style.backgroundColor = "green";
        div.style.color="white";
    }
    document.getElementById("title").value = noteTitle;
    document.getElementById("accessdate").innerHTML =dispdate;
    $('#summernote').summernote("code",noteMain);
    document.pendingchange = false;
    $('#summernote').summernote('enable');
} 

////////////////////////////////////////////////////////////////
//For file load . 
function onFileLoad(elementId, event) {
    document.getElementById(elementId).innerText = event.target.result;
    $('#summernote').summernote("code",event.target.result);
}

function onChooseFile(event, onLoadFileHandler) {
    if (typeof window.FileReader !== 'function')
        throw ("The file API isn't supported on this browser.");
    let input = event.target;
    if (!input)
        throw ("The browser does not properly implement the event object");
    if (!input.files)
        throw ("This browser does not support the `files` property of the file input.");
    if (!input.files[0])
        return undefined;
    let file = input.files[0];
    let fr = new FileReader();
    fr.onload = onLoadFileHandler;
    fr.readAsText(file);
}
function doAutoSave(){
    // console.log("in doAutoSave.");
    if(document.pendingchange){
        UpdateNote();
    }else{
//        document.seconds = 120;
    }
}
//Gavin.Temp remove the timer as it would always jump to start of the editor.
    
// function displayTimer(){
//     if(!document.seconds){
//         document.seconds = 120;
//     }
//     //document.getElementById("save").innerHTML = "Save:"+document.seconds--+"s";
//     document.getElementById("time").innerHTML = document.seconds--+"s";
//     if (document.seconds < 30){
//         document.getElementById("time").style.color = "red";
//     }else{
//         document.getElementById("time").style.color = "black";
//     }

// }
function RefreshButton(){
    if(document.pendingchange){
        document.getElementById("save").innerHTML = "****Save";  
    }
    else{
        document.getElementById("save").innerHTML = "SAVE"; 
    }

}
