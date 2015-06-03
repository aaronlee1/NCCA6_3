//Variable Declaration	
var map, mapCenter, locCol, fTableID, legend, markers, pointLayer, Column, subLayer, zoomLevel, firms, heatmapRadio, marker, infowindow, latlng;
var layFirms, catBox, FirmsBox, laySA, selCat, selFir;
//InfoWindowItems
var image, name, address, category, website;

function initialize() {

//Variable Definition
  mapCenter = new google.maps.LatLng(46.7649885,-92.1112232);  
  fTableID = "1jPai26FlSqYV8QlaQtHSptgD3jIA9eNZGC4iWOoP";
  locCol = 'Address';
  
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: mapCenter,
    zoom: 11,
  });
  
  //Initialize the Google Fusion Tables Layer
  layFirms = new google.maps.FusionTablesLayer({
	query: { 
		select: locCol,
		from: fTableID
	}
  });
  initialLayer = new google.maps.FusionTablesLayer({
	query: {
		select: locCol,
		from: fTableID
	},
	templateId: 2,
	styleId: 2
  });
  var heatmap = new google.maps.visualization.HeatmapLayer();
  /*var saLayer = new google.maps.FusionTablesLayer({
	query: { 
		select: reach,
		from saTableID
	}
  });
  */
  
  // map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
  // pointLayer = document.getElementById('Point');
  // heatmapLayer = document.getElementById('HeatmapLayer');
  // saLayer = document.getElementById('saLAYER');
 
  catBox = document.getElementById('Niche');
  FirmsBox = document.getElementById('Firms');
  
  getData("Niche");
  getData("Firms");
    
  markers = [];
  
  layFirms.setMap(null);
  initialLayer.setMap(map);
  
  
  
  /*image = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT image FROM "+ fTableID +"  WHERE Firms='Living Art Studio '&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
  
  google.maps.event.addListener(initialLayer,'click',function(e){
  
  
	e.infoWindowHtml = "<div class='googft-info-window'  style='font-family: sans-serif; width: 250px; height: 20em; overflow-y: auto;'>\
						<img src="+image +"><br><br> style='width: 150px; vertical-align:top; margin-right: .5em'/><br><br>\
						<font size='4', color='black'><b>{Firms}</font><br>\
						{Address}<br>\
						{Sources}\
						{Contact Person}<br>\
						<b>website:</b> <a href='{website}' target='_blank'>{website}</a><br> \
						<b>Niche:</b> {Niche}\
						</div>";
	});
 
 var zoom = 11;
  var infowindow;
  var infowindowContent = '';
  var coordinate;
  
  var latlng = new google.maps.LatLng(44.7,-89.8);
  
  
  map.setZoom(12);
  if(infowindow) infowindow.close();
  elseinfowindow=new google.maps.InfoWindow();
  
	infoWindowContent = infowindow.setContent(
        '<h3>This comes from the Fusion Table: <br />' + e.row['Niche'].value + '</h3>' +
        '<br />' +
        '<p>This is hardcoded to the script <br /> and will appear in each infowindow</p>');

    infowindow.setPosition(e.latLng);
    map.setCenter(e.latLng);
    infowindow.open(map);        
	});
*/
}
	

function getData(Column) {
	// var firms = new Array();
	// var latList = new Array();
	// var lonList = new Array();
	var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT "+Column +" FROM "+ fTableID +" ORDER BY "+ Column +"&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
	var queryurl = encodeURI(query);
	if (Column =="Niche") {
		var dataQuer = $.get(queryurl, function(data) {
			dropdownFill(catBox, data);
			console.log(data);
		});
	}else if(Column == "Firms"){
		var dataQuer = $.get(queryurl, function(data) {
			dropdownFill(FirmsBox, data);
			console.log(data);
		});
	}
}

function dropdownFill(selectbox, data) {
	var List = new Array();
	for (var i=0; i <data.rows.length; i++) {
		if (List.indexOf(data.rows[i][0])==-1){
			List.push(data.rows[i][0]);
			addOption(selectbox, data.rows[i][0], data.rows[i][0]);
		}
	}
}

function addOption(selectbox,text, value){
	var entry = document.createElement("Option");
	entry.text = text;
	entry.value = value;
	selectbox.options.add(entry);
}


function clickCat(){
	selCat = catBox.value;
	selCatTxt = catBox.text;
	selFir = FirmsBox.value;
	
	if (selCat != 0) {
		var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT Firms FROM "+ fTableID +"  WHERE Niche='" + selCat + "'&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
		var queryurl = encodeURI(query);
		var dataQuer = $.get(queryurl, CatUpdateHandler);
		updateMap();
	}else {
		var i;
		for (i = FirmsBox.options.length-1;i>=0;i--)
		{
			FirmsBox. remove(i);
		}
		addOption(FirmsBox, "Browse Creative Firms", "1");
	}
}

function CatUpdateHandler(data) {
	var i;
	for(i=FirmsBox.options.length-1;i>=0;i--)
	{
		FirmsBox.remove(i);
	}
	
	addOption(FirmsBox, "All", "0");
	
	dropdownFill(FirmsBox, data);
}

function clickFirms(){
	selCat = catBox.value;
	selFir = FirmsBox.value;
	
	if (selFir != 0) {
		var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT Firms FROM "+ fTableID +"  WHERE Firms='" + selFir + "'&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
		var queryurl = encodeURI(query);
		var dataQuer = $.get(queryurl);
		searchCriteria("",dataHandlerCenter);
	}else {
		var i;
		for (i = FirmsBox.options.length-1;i>=0;i--)
		{
			
		}
		removeMarkers();
	}
}
			
		
function searchCriteria(Column, dataHandlerType) {
	if (selCat ==0) {
		if (selFir ==0) {
			sendRequest(" GROUP BY LatDec,LonDec", Column, dataHandlerType);
		}else { sendRequest("WHERE Firms ='"+ selFir + "'", Column, dataHandlerType);
		};
	}else { 
		if(selFir == 0) {
			sendRequest("WHERE Niche ='" + selCat + "'GROUP BY LatDec, LonDec", Column, dataHandlerType);
		}else { 
			sendRequest("WHERE Niche ='" + selCat + "'AND Firms='" + selFir + "'", Column, dataHandlerType);
		}
	}
}

function sendRequest(statement, Column, dataHandlerType){
	if(dataHandlerType ==dataHandlerCenter) {
		removeMarkers();
	};
	var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT LatDec,LonDec"+ Column +" FROM "+ tableID + statement +"&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
	var queryurl = encodeURI(query);
	var dataQuer = $.get(queryurl, dataHandlerType)
	.done(function(){
		mapcenter = map.getCenter();
		zoomlevel = map.getZoom();
	});
}

function dataHandlerCenter(data) {
	if (data.hasOwnProperty('rows')){
		var bounds = new google.maps.LatLngBounds();
		for(i=0; i < data.rows.length; i++) {
			var point = new google.maps.LatLng(
				data.rows[i][0],
				data.rows[i][0]
			);
			var marker = new google.maps.Marker({
				position: point,
				map: map
			});
			markers.push(marker);
			bounds.extend(point);
		}
		
		map.fitBound(bounds);
	}else{
		alert("No data");
	};
}

function removeMarkers() {
	if(markers.length !=0) {
		for(var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		};
		markers = [];
	}
}

function updateMap() {
	

	if(selCat !=0) {
		initialLayer.setMap(null);
		subLayer = new google.maps.FusionTablesLayer({
			query: {
				select: locCol,
				from: fTableID,
				where:" Niche = '" +selCat + "'"
			}
			
		});
	
	subLayer.setMap(map);
	
	}else if(selCat == 0){
		layFirms.setMap(map);
	}		
		
}



google.maps.event.addDomListener(window, 'load', initialize);