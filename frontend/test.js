const url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?AIzaSyAsrlYfrr2QkRGcv30zV-cUfGL_TECPDWs&hospitals&textquery';

fetch(url).then(response=>console.log(response));