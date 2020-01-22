/* global user */

const URLOneResult = "https://jsonplaceholder.typicode.com/todos/1"
const URLPageResult = "https://jsonplaceholder.typicode.com/todos"
const CALL_SUCCESSFUL = 4;
const HTTP_OK = 200;
const SEARCH_BUTTON_ID = 'searchButton'
const SEARCH_MESSAGE_ID = 'message'
const SEARCH_RESULTS_ID = 'searchResults'
const HEADER_ID = 'header'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/*
 * Update element after given time
 * @param {type} element_id1
 * @param {type} sleepTimeMs
 * @returns {undefined}
 */
function updateSearchElement(elementId,elementIdSearchMessage, textResult){
  
    var users =  JSON.parse(textResult) ;
    var insertElement = document.getElementById(elementId);
    
    changeElementText(elementIdSearchMessage,0,"Results:")
   
    console.log("Name:" + insertElement.nodeName);
    for(i=0;i<users.length;i++){
        let resultNode = document.createElement("p");
        resultNode.textContent = "User ID: " + users[i].id + " TITLE: "+ users[i].title;
        insertElement.appendChild(resultNode);
    }
}

async function changeElementText(element_id1, sleepTimeMs, message) {
  await sleep(sleepTimeMs).then(()=>{
        document.getElementById(element_id1).innerHTML = message;
  });

}
/*
 * This simulates fetching large results when small is returned, similar to pagination concept.. 
 * callback function executed on single fetch success
 * requests all records
 */
function loadSearchResults(elementIdSearchResults,elementIdSearchMessage, fetchOneURL, fetchAllURL) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() { //callback function, so function to be called when readyState changes
    if (this.readyState === CALL_SUCCESSFUL && this.status === HTTP_OK) { //successfully finished
       let xhttp = new XMLHttpRequest(); //scope xhttp to this block
       xhttp.open("GET", fetchAllURL, true); //async to
       xhttp.onreadystatechange = function(){ //if first request was successful we get entire user list and update in DOM
             updateSearchElement(elementIdSearchResults,elementIdSearchMessage,xhttp.responseText);
       };
       xhttp.send();
    }else if(this.readyState !== CALL_SUCCESSFUL){
            changeElementText(elementIdSearchMessage,0,"Loading ...")
    }
  };
  xhttp.open("GET", fetchOneURL, true); //true makes it asynchronous call
  xhttp.send();
}
/*
 * changeElementText is async so 
 * we do not wait for it to complete and fire rest of functions down to the end
 */
function updateContent(elementIdSearchResults, elementIdHeader, elementIdSearchMessage){
  
    changeElementText(elementIdHeader,0,"Searching ....");
    changeElementText(elementIdSearchMessage,0,"Searching ....");
    changeElementText(elementIdHeader,1500,"Should be searched by now"); //will not block rest of the code, this is async
    loadSearchResults(elementIdSearchResults,elementIdSearchMessage, URLOneResult, URLPageResult); //this is async too
}

//Im events names we omit on prefix
//Events allow as to fir things without ingeration in DOM
//to pass parameters we use anonymous function
document.getElementById(SEARCH_BUTTON_ID).addEventListener("click",function(){updateContent(SEARCH_RESULTS_ID,HEADER_ID,SEARCH_MESSAGE_ID);});
