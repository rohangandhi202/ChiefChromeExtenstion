const API_KEY = 'AIzaSyA1fSk36gCUTyicqBXPDTXx_iXocOPwSwY';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SPREADSHEET_ID = '1rTM04OXTH8xnAqqBN3xUT_9Bg_nKXummMgiytZl3aYA';
const SPREADSHEET_TAB_NAME = 'Sheet1';

function onGAPILoad() {
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    // clientId: CLIENT_ID,
    // scope: SCOPES,
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi initialized')
  }, function(error) {
    console.log('error', error)
  });
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Get token
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      // Set token in GAPI library
      gapi.auth.setToken({
        'access_token': token,
      });

      const body = {values: [[
        new Date(), // Timestamp
        request.title, // Page title
        request.url, // Page URl
      ]]};

      // Append values
      gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: SPREADSHEET_TAB_NAME,
        valueInputOption: 'USER_ENTERED',
        resource: body
      }).then((response) => {
        console.log(`${response.result.updates.updatedCells} cells appended.`)
        sendResponse({success: true});
      });
    })

    // Wait for response
    return true;
  }
);
