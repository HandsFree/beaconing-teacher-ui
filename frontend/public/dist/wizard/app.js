var debug = true;
var i18n = (function() {
    var i18n = function(){};
    if(debug){
        i18n.missingKeys = [];
    }
    
    i18n.userLang = navigator.language || navigator.userLanguage; 
    
    i18n.datastore = {
        "Click the right button" : i18n.userLang == "pt-PT" ? "Clique no botão direito" : "Click the right button"
    };
    i18n.loaded = false;
//    console.log ("The language is: " + userLang);
    
    var client = new XMLHttpRequest();
    client.open('GET', './dist/i18n/' + i18n.userLang + '.json');
    client.onreadystatechange = function() {
      i18n.datastore = JSON.parse(client.responseText);

      i18n.loaded = true;
    }

    client.send();
    //var fileContents = 'http://localhost/scr/' + userLang + '.json'.toURL().text;
    
    i18n.get =  function(string){
        for(var key in this.datastore){
            if(key.split(" ").join("").split("\n").join("") == string.split(" ").join("").split("\n").join("")){
                return this.datastore[key];
            }
        }
        if(debug){
            var stringHasTitleInBegin = string.indexOf("Title") == 0;
            this.missingKeys.push('"' + string + '": "' + (stringHasTitleInBegin ? string.substring(5) : string) + '",');
        }
        
        if(debug)
            return string;
        
        return "";
    };
    
    i18n.translate = function(){
        if(this.loaded){
            var toTranslate = document.getElementById('myModal').querySelectorAll('[title]');            
            for(i = 0; i < toTranslate.length; ++i){
                hasToTranslate = true;
                if(toTranslate[i].i18ned){
                    hasToTranslate = false;
                }
                if(hasToTranslate && toTranslate[i].innerHTML != '?' && toTranslate[i].innerHTML){
                    toTranslate[i].innerHTML = this.get(toTranslate[i].title);
                }
                if(hasToTranslate && toTranslate[i].title){
                    var title = this.get("Title" + toTranslate[i].title);
                    if(title)
                        toTranslate[i].title = this.get("Title" + toTranslate[i].title);
                    else
                        toTranslate[i].title = this.get(toTranslate[i].title);
                }
                if(hasToTranslate){
                    toTranslate[i].i18ned = true;
                }
            }
            if(debug){
                console.log(this.missingKeys.join("\n"));
            }
            
        } else {
            setTimeout(function(){ i18n.translate();}, 100);
        }
    };
    
    return i18n;
})();

i18n.translate();
//Set language of textToSpeech
var language = i18n.userLang;

//Variables for the JSON file
var screenReader = false;
var fontSize = "small";
var fontType = "calibri";
var contrastMode = "normal";
var flashingText = true;
var blinkingText = true;
var keyboardOnly = false;
var voiceInterface = false;
var speechRecognition = false;


//Load all the components of wizard html file
//Questions
var q1 = document.getElementById('Q1');
var q2 = document.getElementById('Q2');
var q3 = document.getElementById('Q3');
var q4 = document.getElementById('Q4');
var q5 = document.getElementById('Q5');
var q6 = document.getElementById('Q6');
var q7 = document.getElementById('Q7');
var q8 = document.getElementById('Q8');
var q9 = document.getElementById('Q9');
var finishq = document.getElementById('FinishQ');
//Buttons
var okfinish = document.getElementById('okfinish');    
var back = document.getElementsByName('back')[0];
var skip = document.getElementsByName('skip')[0];
var next = document.getElementsByName('next')[0];    
var btnhelp = document.getElementById('btnhelp');
btnhelp.title = "You must select the right or left button to proceed to the next question.";
    
//Don't display the questions at start
q2.style.display = "none";
q3.style.display = "none";
q4.style.display = "none";
q5.style.display = "none";
q6.style.display = "none";
q7.style.display = "none";
q8.style.display = "none";
q9.style.display = "none";
finishq.style.display = "none";
back.style.display = "none";
skip.style.display = "none";
next.style.display = "none";
    
//Answers
var res1left = document.getElementById('res1left');
var res1right = document.getElementById('res1right');
var res2small = document.getElementById('res2small');
var res2normal = document.getElementById('res2normal');
var res2medium = document.getElementById('res2medium');
var res2big = document.getElementById('res2big');
var res3calibri = document.getElementById('res3calibri');
var res3arial = document.getElementById('res3arial');
var res3arialb = document.getElementById('res3arialb');
var res3comics = document.getElementById('res3comics');
var res3verdana = document.getElementById('res3verdana');
var res3tahoma = document.getElementById('res3tahoma');
var res3trebuchet = document.getElementById('res3trebuchet');
var res3georgia = document.getElementById('res3georgia');
var res4a = document.getElementById('res4normal');
var res4b = document.getElementById('res4wb');
var res4c = document.getElementById('res4bw');
var res4d = document.getElementById('res4by');
var res4e = document.getElementById('res4yb');
var res5no = document.getElementById('res5no');
var res5yes = document.getElementById('res5yes');
var res6no = document.getElementById('res6no');
var res6yes = document.getElementById('res6yes');
var res8left = document.getElementById('res8left');
var res8right = document.getElementById('res8right');
var audioq8 = document.getElementById('audioq8');
var text9 = document.getElementById('text9');
var res9 = document.getElementById('res9');
var continueq = true;
var rectdraw = false;
var errorsq7 = 0;
var errorsq9 = 0;

// Get the modal
var modal = document.getElementById("myModal");
//var modal2 = parent.document.getElementById("wiz");
var modal3 = parent.document.getElementById("wizard-container");
var modalclose = document.getElementById("myClose");

//Close buttons yes or no
var btnyes = document.getElementById("yesclose");
var btnno = document.getElementById("noclose");
//Save buttons yes or no
var yessave = document.getElementById("yessave");
var nosave = document.getElementById("nosave");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var spanclose = document.getElementsByClassName("close")[1];

//image text to question 1
var c=document.getElementById("myCanvas");
var ctext=c.getContext("2d");
ctext.font="20px Yantramanav";
ctext.fillStyle="red";
ctext.fillText(i18n.get("Click the right button"),10,20);
imageElem = document.getElementById('imageq1');
imageElem.src = ctext.canvas.toDataURL();
imageElem.title = "Click the left button";
//imageElem.alt = "Click the left button";
console.log(imageElem.src);

//function to get JSON file
function GetJson(path){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",path,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

//function to post JSON file
function PostJson(u_id,dataj){
    var Httpreq = new XMLHttpRequest(); // a new request
    var param = JSON.stringify(dataj);
    Httpreq.open("POST",'../src/POST.php?id='+u_id+'&f='+openjson,true);
    Httpreq.setRequestHeader("Content-Type", "application/json");
    Httpreq.send(param); 
}
//Load JSON file for user ID
//GET ID
var user_id = 3;
var profile_path = '../dist/profiles/' + user_id + '.json';
//var jsondata = JSON.parse(GetJson(profile_path));
//console.log(jsondata.userAccessibility.screenReader);
var jsondata;
var openjson=true;
try{
    jsondata = JSON.parse(GetJson(profile_path));
}
catch (error)
{
    openjson=false;
    console.log("The file doesn't exist");
}

if(openjson == true)
{
    var fsize;
    var ftype;
    var backc;
    var colorc;
    var b = document.querySelectorAll("button");
    var m = document.querySelectorAll(".modal-content");
    var m2 = document.querySelectorAll(".modal-content-question");
    //change font size
    switch (jsondata.userAccessibility.fontSize){
        case "small":
            fsize = window.getComputedStyle(res2small, null).getPropertyValue('font-size');
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res2")))
                {
                    b[i].style.fontSize=fsize;
                }
            }
            modal.style.fontSize=fsize;
            break;
        case "normal":
            fsize = window.getComputedStyle(res2normal, null).getPropertyValue('font-size');
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res2")))
                {
                    b[i].style.fontSize=fsize;
                }
            }
            modal.style.fontSize=fsize;
            break;
        case "medium":
            fsize = window.getComputedStyle(res2medium, null).getPropertyValue('font-size');
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res2")))
                {
                    b[i].style.fontSize=fsize;
                }
            }
            modal.style.fontSize=fsize;
            break;
        case "big":
            fsize = window.getComputedStyle(res2big, null).getPropertyValue('font-size');
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res2")))
                {
                    b[i].style.fontSize=fsize;
                }
            }
            modal.style.fontSize=fsize;
            break; 
    }
    //change font type
    switch (jsondata.userAccessibility.fontType){
        case "calibri":
            ftype = window.getComputedStyle(res3calibri, null).getPropertyValue('font-family');
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res3")))
                {
                    b[i].style.fontFamily=ftype;
                }
            }
            modal.style.fontFamily=ftype;
            break;
        case "arial":
            ftype = window.getComputedStyle(res3arial, null).getPropertyValue('font-family');
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res3")))
                {
                    b[i].style.fontFamily=ftype;
                }
            }
            modal.style.fontFamily=ftype;
            break;
        case "arialBlack":
            ftype = window.getComputedStyle(res3arialb, null).getPropertyValue('font-family');
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res3")))
                {
                    b[i].style.fontFamily=ftype;
                }
            }
            modal.style.fontFamily=ftype;
            break;
        case "comicSans":
            ftype = window.getComputedStyle(res3comics, null).getPropertyValue('font-family');
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res3")))
                {
                    b[i].style.fontFamily=ftype;
                }
            }
            modal.style.fontFamily=ftype;
            break; 
        case "verdana":
            ftype = window.getComputedStyle(res3verdana, null).getPropertyValue('font-family');
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res3")))
                {
                    b[i].style.fontFamily=ftype;
                }
            }
            modal.style.fontFamily=ftype;
            break;
        case "tahoma":
            ftype = window.getComputedStyle(res3tahoma, null).getPropertyValue('font-family');
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res3")))
                {
                    b[i].style.fontFamily=ftype;
                }
            }
            modal.style.fontFamily=ftype;
            break;
        case "trebuchet":
            ftype = window.getComputedStyle(res3trebuchet, null).getPropertyValue('font-family');
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res3")))
                {
                    b[i].style.fontFamily=ftype;
                }
            }
            modal.style.fontFamily=ftype;
            break;
        case "georgia":
            ftype = window.getComputedStyle(res3georgia, null).getPropertyValue('font-family');
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res3")))
                {
                    b[i].style.fontFamily=ftype;
                }
            }
            modal.style.fontFamily=ftype;
            break;
    }
    //change contrast mode
    switch (jsondata.userAccessibility.contrastMode){
        case "normal":
            backc = window.getComputedStyle(res4a, null).getPropertyValue('background-color');
            colorc = window.getComputedStyle(res4a, null).getPropertyValue('color');
            for (var i = 0; i < m.length; i++) {
                m[i].style.backgroundColor=backc;
            }
            for (var i = 0; i < m2.length; i++) {
                m2[i].style.backgroundColor=backc;
            }
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res4")))
                {
                    b[i].style.backgroundColor=backc;
                    b[i].style.color=colorc;
                }
            }
            modal.style.color=colorc;
            break;
        case "WB":
            backc = window.getComputedStyle(res4b, null).getPropertyValue('background-color');
            colorc = window.getComputedStyle(res4b, null).getPropertyValue('color');
            for (var i = 0; i < m.length; i++) {
                m[i].style.backgroundColor=backc;
            }
            for (var i = 0; i < m2.length; i++) {
                m2[i].style.backgroundColor=backc;
            }
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res4")))
                {
                    b[i].style.backgroundColor=backc;
                    b[i].style.color=colorc;
                }
            }
            modal.style.color=colorc;
            break;
        case "BW":
            backc = window.getComputedStyle(res4c, null).getPropertyValue('background-color');
            colorc = window.getComputedStyle(res4c, null).getPropertyValue('color');
            for (var i = 0; i < m.length; i++) {
                m[i].style.backgroundColor=backc;
            }
            for (var i = 0; i < m2.length; i++) {
                m2[i].style.backgroundColor=backc;
            }
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res4")))
                {
                    b[i].style.backgroundColor=backc;
                    b[i].style.color=colorc;
                }
            }
            modal.style.color=colorc;
            break;
        case "BY":
            backc = window.getComputedStyle(res4d, null).getPropertyValue('background-color');
            colorc = window.getComputedStyle(res4d, null).getPropertyValue('color');
            for (var i = 0; i < m.length; i++) {
                m[i].style.backgroundColor=backc;
            }
            for (var i = 0; i < m2.length; i++) {
                m2[i].style.backgroundColor=backc;
            }
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res4")))
                {
                    b[i].style.backgroundColor=backc;
                    b[i].style.color=colorc;
                }
            }
            modal.style.color=colorc;
            break; 
        case "YB":
            backc = window.getComputedStyle(res4e, null).getPropertyValue('background-color');
            colorc = window.getComputedStyle(res4e, null).getPropertyValue('color');
            for (var i = 0; i < m.length; i++) {
                m[i].style.backgroundColor=backc;
            }
            for (var i = 0; i < m2.length; i++) {
                m2[i].style.backgroundColor=backc;
            }
            for (var i = 0; i < b.length; i++) {
                if (!(b[i].id.startsWith("res4")))
                {
                    b[i].style.backgroundColor=backc;
                    b[i].style.color=colorc;
                }
            }
            modal.style.color=colorc;
            break;
    }
}
//var client_profile = new XMLHttpRequest();
//client_profile.open('GET', profile_path);
//var data;
//client_profile.onreadystatechange = function() {
//    data = JSON.parse(client_profile.responseText);
//}
//console.log(data);
//$.getJSON(profile_path, function(data) {
//    console.log(data);
//});
//When click yes on close
btnyes.onclick = function() {
    q1.style.display = "block";
    q2.style.display = "none";
    q3.style.display = "none";
    q4.style.display = "none";
    q5.style.display = "none";
    q6.style.display = "none";
    q7.style.display = "none";
    q8.style.display = "none";
    q9.style.display = "none";
    finishq.style.display = "none";
    modalclose.style.display = "none";   
    modal.style.display = "none";
    // modal2.style.display = "none";
    modal3.classList.remove('show');
    modal3.classList.add('hide');
};

//When click no on close
btnno.onclick = function() {
    modalclose.style.display = "none";   
};
//When click x on close
spanclose.onclick = function() {
    modalclose.style.display = "none";
};

//Button Back for all questions
back.onclick = function() {
    switch (back.id){
        case "backq2":
            changeButtons("q1",false,false,false);
            q1.style.display = "block";
            q2.style.display = "none";
            break;
        case "backq3":
            changeButtons("q2",true,false,false);
            q2.style.display = "block";
            q3.style.display = "none";
            break;
        case "backq4":
            changeButtons("q3",true,false,false);
            q3.style.display = "block";
            q4.style.display = "none";
            break;
        case "backq5":
            changeButtons("q4",true,false,false);
            q4.style.display = "block";
            q5.style.display = "none";
            break;
        case "backq6":
            changeButtons("q5",true,false,false);
            q5.style.display = "block";
            q6.style.display = "none";
            break;
        case "backq7":
            
            rectdraw = false;
            if(continueq==true)
            {
                q6.style.display = "block";
                q7.style.display = "none";
                changeButtons("q6",true,false,false);
            }
            else{
                q1.style.display = "block";
                q7.style.display = "none";
                changeButtons("q1",false,false,false);
            }
            break;
        case "backq8":
            changeButtons("q7",true,true,true);
            q7.style.display = "block";
            q8.style.display = "none";
            break;
        case "backq9":
            changeButtons("q8",true,false,false);
            q8.style.display = "block";
            q9.style.display = "none";
            break;
        default:
            changeButtons("q1",false,false,false);
            q1.style.display = "block";
            q2.style.display = "none";
    }
};
//Button Skip for all questions
skip.onclick = function() {
    switch (skip.id){
        case "skipq7":
            keyboardOnly = true;
            rectdraw = false;
            changeButtons("q8",true,false,false);
            q7.style.display = "none";
            q8.style.display = "block";
            break;
        case "skipq9":
            speechRecognition = false;
            changeButtons("",false,false,false);
            q9.style.display = "none";
            finishq.style.display = "block";
            break;           
    }
};
//Button Next for all questions
next.onclick = function() {
    switch (next.id){
        case "nextq7":
            if(rectdraw == true)
            {
                keyboardOnly = false;
                changeButtons("q8",true,false,false);
                q7.style.display = "none";
                q8.style.display = "block";
            }
            else if(errorsq7 < 2)
            {
                keyboardOnly = false;
                var msgq7 = new SpeechSynthesisUtterance(i18n.get('Please draw a rectangle'));
                msgq7.rate = 1;
                msgq7.lang = language;
                window.speechSynthesis.speak(msgq7);
                errorsq7++;
            }
            else{
                keyboardOnly = true;
                changeButtons("q8",true,false,false);
                q7.style.display = "none";
                q8.style.display = "block";
            }
            break;
        case "nextq9":
            if(res9.value == text9.textContent)
            {
                speechRecognition = true;
                changeButtons("",false,false,false);
                q9.style.display = "none";
                finishq.style.display = "block";
            }
            else if(errorsq9 < 2)
            {
                speechRecognition = true;
                var msgq9 = new SpeechSynthesisUtterance(i18n.get('Please speak the right text'));
                msgq9.rate = 1;
                msgq9.lang = language;
                window.speechSynthesis.speak(msgq9);
                errorsq9++;
            }
            else{
                speechRecognition = false;
                changeButtons("",false,false,false);
                q9.style.display = "none";
                finishq.style.display = "block";
            }
            break;
    }
};
//If user choose left button
res1left.onclick = function() {
    screenReader = true;
    continueq = false;
    changeButtons("q7",true,true,true);
    q1.style.display = "none";
    q7.style.display = "block";    
};
//If user choose right button
res1right.onclick = function() {
    screenReader = false;
    continueq = true;
    changeButtons("q2",true,false,false);
    q1.style.display = "none";
    q2.style.display = "block";    
};

//If user choose small size
res2small.onclick = function() {
    fontSize = "small";
    changeButtons("q3",true,false,false);
    q2.style.display = "none";
    q3.style.display = "block";
    var font = window.getComputedStyle(res2small, null).getPropertyValue('font-size');
    var bb = document.querySelectorAll("button");
    for (var i = 0; i < bb.length; i++) {
        if (!(bb[i].id.startsWith("res2")))
        {
            bb[i].style.fontSize=font;
        }
    }
    modal.style.fontSize=font;
};
//If user choose normal size
res2normal.onclick = function() {
    fontSize = "normal";
    changeButtons("q3",true,false,false);
    q2.style.display = "none";
    q3.style.display = "block";
    var font = window.getComputedStyle(res2normal, null).getPropertyValue('font-size');
    var bb = document.querySelectorAll("button");
    for (var i = 0; i < bb.length; i++) {
        if (!(bb[i].id.startsWith("res2")))
        {
            bb[i].style.fontSize=font;
        }
    }
    modal.style.fontSize=font;
};
//If user choose medium size
res2medium.onclick = function() {
    fontSize = "medium";
    changeButtons("q3",true,false,false);
    q2.style.display = "none";
    q3.style.display = "block";
    var font = window.getComputedStyle(res2medium, null).getPropertyValue('font-size');
    var bb = document.querySelectorAll("button");
    for (var i = 0; i < bb.length; i++) {
        if (!(bb[i].id.startsWith("res2")))
        {
            bb[i].style.fontSize=font;
        }
    }
    modal.style.fontSize=font;
};
//If user choose big size
res2big.onclick = function() {
    fontSize = "big";
    changeButtons("q3",true,false,false);
    q2.style.display = "none";
    q3.style.display = "block";
    var font = window.getComputedStyle(res2big, null).getPropertyValue('font-size');
    var bb = document.querySelectorAll("button");
    for (var i = 0; i < bb.length; i++) {
        if (!(bb[i].id.startsWith("res2")))
        {
            bb[i].style.fontSize=font;
        }
    }
    modal.style.fontSize=font;
};

//Buttons for text type

res3calibri.onclick = function() {
    fontType = "calibri";
    changeButtons("q4",true,false,false);
    q3.style.display = "none";
    q4.style.display = "block";
    var type = window.getComputedStyle(res3calibri, null).getPropertyValue('font-family');
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res3")))
        {
            b[i].style.fontFamily=type;
        }
    }
    modal.style.fontFamily=type;
};

res3arial.onclick = function() {
    fontType = "arial";
    changeButtons("q4",true,false,false);
    q3.style.display = "none";
    q4.style.display = "block";
    var type = window.getComputedStyle(res3arial, null).getPropertyValue('font-family');
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res3")))
        {
            b[i].style.fontFamily=type;
        }
    }
    modal.style.fontFamily=type;
};

res3arialb.onclick = function() {
    fontType = "arialBlack";
    changeButtons("q4",true,false,false);
    q3.style.display = "none";
    q4.style.display = "block";
    var type = window.getComputedStyle(res3arialb, null).getPropertyValue('font-family');
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res3")))
        {
            b[i].style.fontFamily=type;
        }
    }
    modal.style.fontFamily=type;
};

res3comics.onclick = function() {
    fontType = "comicSans";
    changeButtons("q4",true,false,false);
    q3.style.display = "none";
    q4.style.display = "block";
    var type = window.getComputedStyle(res3comics, null).getPropertyValue('font-family');
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res3")))
        {
            b[i].style.fontFamily=type;
        }
    }
    modal.style.fontFamily=type;
};

res3verdana.onclick = function() {
    fontType = "verdana";
    changeButtons("q4",true,false,false);
    q3.style.display = "none";
    q4.style.display = "block";
    var type = window.getComputedStyle(res3verdana, null).getPropertyValue('font-family');
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res3")))
        {
            b[i].style.fontFamily=type;
        }
    }
    modal.style.fontFamily=type;
};

res3tahoma.onclick = function() {
    fontType = "tahoma";
    changeButtons("q4",true,false,false);
    q3.style.display = "none";
    q4.style.display = "block";
    var type = window.getComputedStyle(res3tahoma, null).getPropertyValue('font-family');
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res3")))
        {
            b[i].style.fontFamily=type;
        }
    }
    modal.style.fontFamily=type;
};

res3trebuchet.onclick = function() {
    fontType = "trebuchet";
    changeButtons("q4",true,false,false);
    q3.style.display = "none";
    q4.style.display = "block";
    var type = window.getComputedStyle(res3trebuchet, null).getPropertyValue('font-family');
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res3")))
        {
            b[i].style.fontFamily=type;
        }
    }
    modal.style.fontFamily=type;
};

res3georgia.onclick = function() {
    fontType = "georgia";
    changeButtons("q4",true,false,false);
    q3.style.display = "none";
    q4.style.display = "block";
    var type = window.getComputedStyle(res3georgia, null).getPropertyValue('font-family');
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res3")))
        {
            b[i].style.fontFamily=type;
        }
    }
    modal.style.fontFamily=type;
};

//If user choose contrast A
res4a.onclick = function() {
    contrastMode = "normal";
    changeButtons("q5",true,false,false);
    q4.style.display = "none";
    q5.style.display = "block";
    var back = window.getComputedStyle(res4a, null).getPropertyValue('background-color');
    var color = window.getComputedStyle(res4a, null).getPropertyValue('color');
    var m = document.querySelectorAll(".modal-content");
    for (var i = 0; i < m.length; i++) {
        m[i].style.backgroundColor=back;
    }
    var m2 = document.querySelectorAll(".modal-content-question");
    for (var i = 0; i < m2.length; i++) {
        m2[i].style.backgroundColor=back;
    }
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res4")))
        {
            b[i].style.backgroundColor=back;
            b[i].style.color=color;
        }
    }
    modal.style.color=color;
};
//If user choose contrast B
res4b.onclick = function() {
    contrastMode = "WB";
    changeButtons("q5",true,false,false);
    q4.style.display = "none";
    q5.style.display = "block";
    var back = window.getComputedStyle(res4b, null).getPropertyValue('background-color');
    var color = window.getComputedStyle(res4b, null).getPropertyValue('color');
    var m = document.querySelectorAll(".modal-content");
    for (var i = 0; i < m.length; i++) {
        m[i].style.backgroundColor=back;
    }
    var m2 = document.querySelectorAll(".modal-content-question");
    for (var i = 0; i < m2.length; i++) {
        m2[i].style.backgroundColor=back;
    }
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res4")))
        {
            b[i].style.backgroundColor=back;
            b[i].style.color=color;
        }
    }
    modal.style.color=color;
};
//If user choose contrast C
res4c.onclick = function() {
    contrastMode = "BW";
    changeButtons("q5",true,false,false);
    q4.style.display = "none";
    q5.style.display = "block";
    var back = window.getComputedStyle(res4c, null).getPropertyValue('background-color');
    var color = window.getComputedStyle(res4c, null).getPropertyValue('color');
    var m = document.querySelectorAll(".modal-content");
    for (var i = 0; i < m.length; i++) {
        m[i].style.backgroundColor=back;
    }
    var m2 = document.querySelectorAll(".modal-content-question");
    for (var i = 0; i < m2.length; i++) {
        m2[i].style.backgroundColor=back;
    }
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res4")))
        {
            b[i].style.backgroundColor=back;
            b[i].style.color=color;
        }
    }
    modal.style.color=color;
};
//If user choose contrast D
res4d.onclick = function() {
    contrastMode = "BY";
    changeButtons("q5",true,false,false);
    q4.style.display = "none";
    q5.style.display = "block";
    var back = window.getComputedStyle(res4d, null).getPropertyValue('background-color');
    var color = window.getComputedStyle(res4d, null).getPropertyValue('color');
    var m = document.querySelectorAll(".modal-content");
    for (var i = 0; i < m.length; i++) {
        m[i].style.backgroundColor=back;
    }
    var m2 = document.querySelectorAll(".modal-content-question");
    for (var i = 0; i < m2.length; i++) {
        m2[i].style.backgroundColor=back;
    }
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res4")))
        {
            b[i].style.backgroundColor=back;
            b[i].style.color=color;
        }
    }
    modal.style.color=color;
};
//If user choose contrast E
res4e.onclick = function() {
    contrastMode = "YB";
    changeButtons("q5",true,false,false);
    q4.style.display = "none";
    q5.style.display = "block";
    var back = window.getComputedStyle(res4e, null).getPropertyValue('background-color');
    var color = window.getComputedStyle(res4e, null).getPropertyValue('color');
    var m = document.querySelectorAll(".modal-content");
    for (var i = 0; i < m.length; i++) {
        m[i].style.backgroundColor=back;
    }
    var m2 = document.querySelectorAll(".modal-content-question");
    for (var i = 0; i < m2.length; i++) {
        m2[i].style.backgroundColor=back;
    }
    var b = document.querySelectorAll("button");
    for (var i = 0; i < b.length; i++) {
        if (!(b[i].id.startsWith("res4")))
        {
            b[i].style.backgroundColor=back;
            b[i].style.color=color;
        }
    }
    modal.style.color=color;
};

//Buttons for question 5

res5no.onclick = function() {
    flashingText = false;
    changeButtons("q6",true,false,false);
    q5.style.display = "none";
    q6.style.display = "block";
};

res5yes.onclick = function() {
    flashingText = true;
    changeButtons("q6",true,false,false);
    q5.style.display = "none";
    q6.style.display = "block";
};

//Buttons for question 6

res6no.onclick = function() {
    blinkingText = false;
    changeButtons("q7",true,true,true);
    q6.style.display = "none";
    q7.style.display = "block";
};

res6yes.onclick = function() {
    blinkingText = true;
    changeButtons("q7",true,true,true);
    q6.style.display = "none";
    q7.style.display = "block";
};

//Buttons for question 8

res8left.onclick = function() {
    voiceInterface = true;
    res9.placeholder = i18n.get('Speak');
    changeButtons("q9",true,true,true);
    q8.style.display = "none";
    q9.style.display = "block";    
};

res8right.onclick = function() {
    voiceInterface = false;
    res9.placeholder = i18n.get('Speak');
    changeButtons("q9",true,true,true);
    q8.style.display = "none";
    q9.style.display = "block";    
};
//Audio question 8
audioq8.onclick = function() {
    var msg = new SpeechSynthesisUtterance(i18n.get('Click the left button'));
    msg.rate = 1;
    msg.lang = language;
    window.speechSynthesis.speak(msg);   
};

//When user click to save, the wizard is closed
yessave.onclick = function() {
    q1.style.display = "block";
    q2.style.display = "none";
    q3.style.display = "none";
    q4.style.display = "none";
    q5.style.display = "none";
    q6.style.display = "none";
    q7.style.display = "none";
    q8.style.display = "none";
    q9.style.display = "none";
    finishq.style.display = "none";
    modal.style.display = "none";
    //modal2.style.display = "none";
    modal3.style.display = "none";
    
    //Save the variables in JSON file
    //create the method
    var datasave = {
    "userAccessibility": {
        "screenReader": screenReader,
        "fontSize":fontSize,
        "fontType":fontType,
        "contrastMode":contrastMode,
        "flashingText": flashingText,
        "blinkingText": blinkingText,
        "keyboardOnly": keyboardOnly,
        "voiceInterface": voiceInterface,
        "speechRecognition": speechRecognition
    }
    };
    
    //PostJson(user_id,datasave);
};

nosave.onclick = function() {
    q1.style.display = "block";
    q2.style.display = "none";
    q3.style.display = "none";
    q4.style.display = "none";
    q5.style.display = "none";
    q6.style.display = "none";
    q7.style.display = "none";
    q8.style.display = "none";
    q9.style.display = "none";
    finishq.style.display = "none";
    modal.style.display = "none";
    //modal2.style.display = "none";
    modal3.style.display = "none";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modalclose.style.display = "block";
    modalclose.style.zIndex = 100;
};

//Function tath allow user to speak
function startDictation() {
    if (window.hasOwnProperty('webkitSpeechRecognition')) {

      var recognition = new webkitSpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.lang = language;
      recognition.start();

      recognition.onresult = function(e) {
        document.getElementById('res9').value
                                 = e.results[0][0].transcript;
        recognition.stop();
      };

      recognition.onerror = function(e) {
        recognition.stop();
      };

    }
  };
  
//Function to to change the buttons  
function changeButtons(id,backq,skipq,nextq) {
    var b = "back";
    var s = "skip";
    var n = "next";
    back.style.display = "none";
    skip.style.display = "none";
    next.style.display = "none";
      
    if(backq == true)
    {
        var idb = b.concat(id);
        back.id = idb;
        back.style.display = "block"; 
    }
    if(skipq == true)
    {
        var ids = s.concat(id);
        skip.id = ids;
        skip.style.display = "block"; 
    }
    if(nextq == true)
    {
        var idn = n.concat(id);
        next.id = idn;
        next.style.display = "block"; 
    }  
    
    changeHelp(id);
    //traduçao
    i18n.translate();
  };

//Function to change the help alternative text
function changeHelp(idd) {
    switch (idd){
        case "q1":
            btnhelp.title = "You must select the right or left button to proceed to the next question.";
            break;
        case "q2":
            btnhelp.title = "You should select the text size according to the most appropriate with your viewing difficulties and proceed to the next question.";
            break;
        case "q3":
            btnhelp.title = "You should select the font that you can read best for your difficulties and proceed to the next question.";
            break;
        case "q4":
            btnhelp.title = "You should select the best contrast with which best suits your difficulties and proceed to the next question.";
            break;
        case "q5":
            btnhelp.title = "You must select from the options whether or not you can read the text that is displayed.";
            break;
        case "q6":
            btnhelp.title = "You must select from the options whether or not you can read the text that is displayed.";
            break;
        case "q7":
            btnhelp.title = "Must draw a rectangle if you can use the mouse.";
            break;
        case "q8":
            btnhelp.title = "You should select the option that hears left or right, when pressing the play button with the mouse, continue to the next question.";
            break;
        case "q9":
            btnhelp.title = "You must press the microphone symbol on the recording button, then the text 'I love internet'. If it is correct go to the new question, if you can't, skip.";
            break;
        default:
            btnhelp.title = "You must select Yes to finish or NO to continue";
    }
    //traduçao
    btnhelp.i18ned = false;
  };
  
  //Function to draw a rectangle
  $(function(){
 
    // get references to the canvas and context
    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");

    // style the context
    ctx.strokeStyle = "blue";
    ctx.lineWidth=3;

    // calculate where the canvas is on the window
    // (used to help calculate mouseX/mouseY)
//    var $canvas=$("#canvas");
//    var canvasOffset=$canvas.offset();
//    var offsetX=canvasOffset.left;
//    var offsetY=canvasOffset.top;
//    var offsetX=canvas.offsetLeft;
//    var offsetY=canvas.offsetTop;
//    var scrollX=$canvas.scrollLeft();
//    var scrollY=$canvas.scrollTop();

    // this flage is true when the user is dragging the mouse
    var isDown=false;

    // these vars will hold the starting mouse position
    var startX;
    var startY;
    var nextY;
    var dif;
    function handleMouseDown(e){
        e.preventDefault();
        e.stopPropagation();
        //   dif=modal.scrollHeight-modal.clientHeight;
        //   if(dif>modal.scrollTop)
        //   {
        //       nextY=dif-modal.scrollTop;
        //   }
        //   else
        //   {
        //       nextY=0;
        //   }
      
        // save the starting x/y of the rectangle
        //startX = parseInt(e.clientX-canvas.offsetLeft+modal.scrollWidth-modal.scrollLeft-modal.clientWidth);
        //startY = parseInt(e.clientY-canvas.offsetTop+modal.scrollHeight-nextY-modal.clientHeight);

        // use bounding rect instead for positioning
        var canvasRect = canvas.getBoundingClientRect();

        startX = e.clientX - canvasRect.x - modal.scrollLeft;
        startY = e.clientY - canvasRect.y;

        // set a flag indicating the drag has begun
        isDown=true;

        // console.log(`clientX: ${e.clientX}`);
        // console.log(canvasRect);
        // console.log(modal.clientWidth);
    }

    function handleMouseUp(e){
      e.preventDefault();
      e.stopPropagation();

      // the drag is over, clear the dragging flag
      isDown=false;
    }

    function handleMouseOut(e){
      e.preventDefault();
      e.stopPropagation();

      // the drag is over, clear the dragging flag
      isDown=false;
    }

    function handleMouseMove(e){
        e.preventDefault();
        e.stopPropagation();

        // if we're not dragging, just return
        if(!isDown){return;}

        // get the current mouse position
        //   mouseX=parseInt(e.clientX-canvas.offsetLeft+modal.scrollWidth-modal.scrollLeft-modal.clientWidth);
        //   mouseY=parseInt(e.clientY-canvas.offsetTop+modal.scrollHeight-nextY-modal.clientHeight);

        var canvasRect = canvas.getBoundingClientRect();
        
        mouseX = e.clientX - canvasRect.x - modal.scrollLeft;
        mouseY = e.clientY - canvasRect.y;
        // Put your mousemove stuff here

        // clear the canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);

        // calculate the rectangle width/height based
        // on starting vs current mouse position
        var width = mouseX - startX;
        var height= mouseY - startY;

        // draw a new rect from the start position 
        // to the current mouse position
        ctx.strokeRect(startX,startY,width,height);
        rectdraw = true;
    }

    // listen for mouse events
    $("#canvas").mousedown(function(e){handleMouseDown(e);});
    $("#canvas").mousemove(function(e){handleMouseMove(e);});
    $("#canvas").mouseup(function(e){handleMouseUp(e);});
    $("#canvas").mouseout(function(e){handleMouseOut(e);});
});
