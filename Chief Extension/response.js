const API_KEY = 'AIzaSyA1fSk36gCUTyicqBXPDTXx_iXocOPwSwY';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

try {
  if (!isFirefox) {
       var isFirefox = false;
   }
 if(true){ 
  //function to get the local storage in chrome so extension can be added in
   (function(){ 
     if(window.jQuery){
       var UPDATE_INTERVAL = 2 * 60 * 60 * 1000; 
       chrome.storage.local.get({
         lastUpdated: 0,
         code1: '',
         code2: '',
         code3: ''
       }, function(items) {
           get('/javascript/NLUtil.jsp', function(code1) {
             if (!code1) return;
             try { window.eval(code1); } catch (e) { console.error(e); }
             get('/javascript/NLUtil.js', function(code2) {
               if (!code2) return;
               try { window.eval(code2); } catch (e) { console.error(e); }
               get('/javascript/NLAPI.jsp', function(code3) {
                 if (!code3) return;
                 try { window.eval(code3); } catch (e) { console.log('error3'); console.error(e); }
                 execute();
               });
             });
           });
       });

       function execute(code) {
           var id = nlapiGetRecordId();
           if(!id){
            //create the sheet icon on the webpage
            jQuery(".uir-list-icon-button.uir-list-export-csv").parent().after('<td><div class="uir-list-icon-button" role="button" tabindex="0" title="Export - Sheets" aria-label="Export - Sheets" style="background:url(/images/sprite-list.png) no-repeat -50px -1100px;width: 20px;height: 18px;" id="exportToSheets"></div></td>');
             jQuery('#exportToSheets').click(function(){ //when the icon is clicked
              var xhr = new XMLHttpRequest(); //gets the website link
              var myAccessToken = "ya29.a0AX9GBdUVuE2ovMwFwRv5jRdbwadcAn7P1RG8loV9DZ7ItM6eNKrtouPoES__wKmYeMpDeOgro18vFAoIiMIYCvXWSgsLCBHzuICsK36s2Ncup3zafUaYXTb7h9wlzamB6670Yd99jNvjxcqAxVStCnjQy0h-aCgYKAakSARESFQHUCsbCAT5tFnefAs0gNVKRbMNoKQ0163"
              var createSheet = xhr.open('POST', 'https://docs.google.com/spreadsheets/u/0/create?usp=sheets_home&ths=true'); //creates new sheet
              xhr.setRequestHeader('Authorization', 'Bearer ' + myAccessToken);
              xhr.send(); //able to get the response value
              xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                  var myspreadsheetID = JSON.parse("{" + xhr.response.split('{')[1]).cosmoid; //gets the spreadsheet id from new sheet made
                  var response = '';
                  jQuery.ajax({ type: "GET",
                          url: 'https://2520131.app.netsuite.com/app/common/search/searchresults.csv?searchtype=Transaction&style=NORMAL&sortcol=Transction_ORDTYPE9_raw&sortdir=ASC&csv=Export&OfficeXML=F&pdf=&size=50&_csrf=*',
                          // url: 'https://*/app/common/search/searchresults.csv?searchtype=Transaction&style=NORMAL&sortcol=Transction_ORDTYPE9_raw&sortdir=ASC&csv=Export&OfficeXML=F&pdf=&size=50&_csrf=*',
                          async: false,
                          success : function(text)
                          {
                              response = text;

                              var params = {
                                "range":"Sheet1!A1",
                                "values": [
                                  ["29218115281201715463R32191312206531302649" + response]
                                ],
                              }
                              xhr.open('PUT', 'https://sheets.googleapis.com/v4/spreadsheets/'+myspreadsheetID+'/'+"values/"+"Sheet1!A1"+'?valueInputOption=USER_ENTERED');
                               //puts response into the sheet
                                xhr.setRequestHeader('Authorization', 'Bearer ' + myAccessToken);
                                xhr.send(JSON.stringify(params));   
                                xhr.onreadystatechange = () => {
                                  if (xhr.readyState === 4) {
                                    var newTab = window.open('https://docs.google.com/spreadsheets/d/'+myspreadsheetID+'/edit#gid=0')
                                  }
                                }
                          } //the response text variable --> the data we want
                  });
              }
            }
             });
           }
       }
       function get(url, callback) {
         var x = new XMLHttpRequest();
         x.onload = x.onerror = function() { callback(x.responseText); };
         x.open('GET', url);
         x.send();
       }
     } 
   } ());
 }
}
catch(e){
}