function go(){
        var searchtxt = document.getElementById('searchinput').value;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {displaySearchResult(this);}
        };
        xhttp.open("GET", "http://localhost:18701/notes?search="+searchtxt, true);
        xhttp.send();
}

function addnew() {
    
    var title = document.getElementById('title').value;
    if(title ==="" ) alert("Title can not be NULL");
    else{
        var markup = $('.notecontent').summernote('code');
        markup=markup.replaceAll('\'','\\\'');
        title=title.replaceAll('\'','\\\'');
        const updateData = {"title":title, "content":markup};
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {doadd(this);}
        };
        xhttp.open("PUT", "http://localhost:18701/onenote", true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(updateData));
    }
};
function doadd(){
    console.log("Add note done!?");
    go();
}

function deleteNote(){
    if(!document.currentID) alert("Not note was selected!");
    else{
        const cfm = confirm("Do you want to delete this item? ");
        if(cfm){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {dodelete(this);}
            };
            xhttp.open("DELETE", "http://localhost:18701/onenote?id="+document.currentID, true);
            xhttp.send(); 
        }       
    }
};
function dodelete(xhttp) {
    console.log("deleteOneNote done!?");
    go();
};
function UpdateNote() {
    var markup = $('.notecontent').summernote('code');
    markup=markup.replaceAll('\'','\\\'');
    var title = document.getElementById('title').value;
    title=title.replaceAll('\'','\\\'');
    // console.log(document.currentID);
    // console.log(title);
    // console.log(markup);
    const updateData = {"title":title, "content":markup};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {updateOneNote(this);}
    };

    xhttp.open("POST", "http://localhost:18701/onenote?id="+document.currentID, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify(updateData));
    //$('.zclick2edit').summernote('destroy');
};
function updateOneNote(xhttp) {
    console.log("updateOneNote done!?");
    go();
}

function loadAllNotes() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {displaySearchResult(this);}
    };
    xhttp.open("GET", "http://localhost:18701/notes?search=all", true);
    xhttp.send();
}
function displaySearchResult(xhttp) {
    var notes = JSON.parse(xhttp.responseText);
    var newContent = "<div class='booksGallery'><table>";
    document.currentID ='';
    notes.forEach(function(note) {
        if(!document.currentID || document.currentID===''){
            document.currentID = note.idntfr;
        }
        var processedTitle = note.title;
        if (processedTitle.length > 35) { processedTitle = processedTitle.substring(0, 33) + "..."; } 
        //newContent += `<tr><td><div class="gallery"><a target="_blank" href="${processedTitle}>"</a>`+
        newContent += `<tr><td><div class="gallery">`+
        // `<div id="id${note.idntfr}" onClick=getNoteDetails('${note.idntfr}') onMouseOver="onmouseover('${note.idntfr}')" class='galleryTitle'>${processedTitle}</div></div>`+
        `<div id="id${note.idntfr}" onClick=getNoteDetails('${note.idntfr}') class='galleryTitle'>${processedTitle}</div></div>`+
        `</td></tr>`;
        // newContent += `<div class="gallery"><a target="_blank" href="${book.web_url}">` + 
        //               `<img id="bookImage" src="${book.image_url}" width="600" height="400"></a>` + 
        //               `<div onClick=getBookDetails('${book.title.replace(/\s/g, '%20')}') class='galleryTitle'>${processedTitle}</div></div>`;
    })
    newContent += "</table></div>";
    document.getElementById("searchResult").innerHTML = newContent;
    console.log("currentID:"+document.currentID);
    var div = document.getElementById("id"+document.currentID);
    div.style.backgroundColor = "green";
    getNoteDetails(document.currentID);
}
function onmouseover(id){
    console.log(id);
    var div = document.getElementById("id"+id);
    div.style.backgroundColor = "gray";
    
}
function getNoteDetails(idntfr) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {displayNoteDetail(this);}
    };
    
    xhttp.open("GET", `http://localhost:18701/onenote?id=${idntfr}`, true);
    xhttp.send();
}
function displayNoteDetail(xhttp) {
    var jsonData = JSON.parse(xhttp.responseText);
    console.log(jsonData);
    var noteTitle = jsonData[0]['title'];
    var noteMain = jsonData[0]['content'];
    if (document.currentID) {
        var div = document.getElementById("id"+document.currentID);
        div.style.backgroundColor = "white";
    }
    document.currentID = jsonData[0]['idntfr'];
    var div = document.getElementById("id"+document.currentID);
    div.style.backgroundColor = "green";
    document.getElementById("title").value = noteTitle;
    $('.notecontent').summernote("code",noteMain);
    // var newContent = `<img id="bookImage" src="${imageUrl}"></a>`;
    // newContent += `<div><label>Title:</label> <input id="titleInput" type="text" value='${bookTitle.replaceAll('%20', ' ')}' size='50'></input></div>`;
    // newContent += `<div><label>Web URL:</label> <input id="webUrlInput" type="text" value='${webUrl}' size='50'></input></div>`;
    // newContent += `<div><label>Image URL:</label> <input id="imageUrlInput" type="text" value='${imageUrl}' size='50'></input></div>`;
    // newContent += `<div><button class="btn btn-success" onClick=updateBook('${bookTitle}') style="float:middle; margin-right: 50px;">Update</button>` + 
    //               `<button class="btn btn-danger" style="float:middle" onClick=deleteBook('${bookTitle}')>Delete</button></div></div>`;
    // document.getElementById("main").innerHTML = newContent;
} 

