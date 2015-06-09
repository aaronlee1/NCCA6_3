//Variable Declaration	
var map, mapOptions, mapCenter, locCol, fTableID, legend, markers, pointLayer, Column, geocoder, subLayer, zoomLevel, firms, heatmapRadio, marker, infowindow, latlng;
var catBox, FirmsBox, laySA, selCat, selFir, drawCheckbox;
//InfoWindowItems
var image, name, address, category, website;

function initialize() {

//Variable Definition
  geocoder = new google.maps.Geocoder();
  mapCenter = new google.maps.LatLng(46.7649885,-92.1112232);  
  fTableID = "1jPai26FlSqYV8QlaQtHSptgD3jIA9eNZGC4iWOoP";
  locCol = 'Address';
  mapOptions = {
	zoom: 11,
	center: mapCenter,
	mapTypeControl: true,
	mapTypeControlOptions: {
		style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
		position: google.maps.ControlPosition.BOTTOM_RIGHT
	},
	zoomControl: true,
	zoomControlOptions: {
		style: google.maps.ZoomControlStyle.SMALL,
		position: google.maps.ControlPosition.TOP_RIGHT
	},
	scaleControl: true,
	streetViewControl: true,
	streetViewCOntrolOptions: {
		position: google.maps.ControlPosition.TOP_RIGHT
	},
	panControl: true,
	panControlOptions: {
		position: google.maps.ControlPosition.TOP_RIGHT
	}
  }  
		
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions); 
    
 
  //Initialize the Google Fusion Tables Layer
  
  initialLayer = new google.maps.FusionTablesLayer({
	query: {
		select: locCol,
		from: fTableID
	},
	templateId: 2,
	styleId: 2
  });
  
  var legend = document.createElement('div');
  legend.id = 'legend';
  var content = [];
  content.push('<h3>Categories</h3>');
  content.push('<p><div class="horizontal red"></div>Arts and Entertainment</p>');
  content.push('<p><div class="horizontal yellow"></div>Boutique</p>');
  content.push('<p><div class="horizontal green"></div>Brewery</p>');
  content.push('<p><div class="horizontal blue"></div>Cooperative</p>');
  content.push('<p><div class="horizontal purple"></div>Culinary</p>');
  content.push('<p><div class="horizontal brown"></div>Drinks and Conversation</p>');
  content.push('<p><div class="horizontal grey"></div>Local Identity</p>');
  content.push('<p><div class="horizontal white"></div>Outdoor Outfitters</p>');
  legend.innerHTML = content.join('');
  legend.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
  
 
  catBox = document.getElementById('Niche');
  FirmsBox = document.getElementById('Firms');
  
  getData("Niche");
  getData("Firms");
    
  markers = [];
  
  initialLayer.setMap(map);
  
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
	console.log("dropdown: " + data);
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
		var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT Firms,LatDec,LonDec FROM "+ fTableID +"  WHERE Niche='" + selCat + "'&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
		var queryurl = encodeURI(query);

		var dataQuer = $.get(queryurl, CatUpdateHandler);
		
	}else {
		var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT Firms,LatDec,LonDec FROM "+ fTableID +"&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
		var queryurl = encodeURI(query);
		console.log(queryurl);		
		var dataQuer = $.get(queryurl, CatUpdateHandler);
	}
}

function CatUpdateHandler(data) {
	console.log(data);
	var i;
	for(i=FirmsBox.options.length-1;i>=0;i--)
	{
		FirmsBox.remove(i);
	}
	
	addOption(FirmsBox, "All", "0");
	
	dropdownFill(FirmsBox, data);

	if(selCat !=0) {
		initialLayer.setOptions({
			query: {
				select: locCol,
				from: fTableID,
				where:"Niche = '" +selCat + "'"
			},
			templateId: 2,
			styleId: 2
		});
	}else{
		initialLayer.setOptions({
			query: {
				select: locCol,
				from: fTableID
			},
			templateId: 2,
			styleId: 2
		});	
	}	
	// center the selected points
	var bounds = new google.maps.LatLngBounds();
    for(i = 0; i < data.rows.length; i++) {
        var point = new google.maps.LatLng(
            data.rows[i][1], 
            data.rows[i][2]
            );
        bounds.extend(point);
    }

    // zoom to the bounds
    map.fitBounds(bounds);
}

function clickFirms(){
	selCat = catBox.value;
	selFir = FirmsBox.value;
	
	if (selFir != 0) {
		var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT Firms,LatDec,LonDec FROM "+ fTableID +"  WHERE Firms='" + selFir + "'&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
		var queryurl = encodeURI(query);
		var dataQuer = $.get(queryurl, FirmUpdateHandler);
	}else {
		if (selCat != 0 ) {
			var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT Firms,LatDec,LonDec FROM "+ fTableID +"  WHERE Niche='" + selCat + "'&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
			var queryurl = encodeURI(query);	
			var dataQuer = $.get(queryurl, CatUpdateHandler);			
		} else{
			var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT Firms,LatDec,LonDec FROM "+ fTableID +"&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
			var queryurl = encodeURI(query);
			console.log(queryurl);		
			var dataQuer = $.get(queryurl, CatUpdateHandler);
		};

	}

}

function FirmUpdateHandler(data) {

	if(selFir !=0) {
		initialLayer.setOptions({
			query: {
				select: locCol,
				from: fTableID,
				where:"Firms = '" +selFir + "'"
			},
			templateId: 2,
			styleId: 2
		});
	}else{
		initialLayer.setOptions({
			query: {
				select: locCol,
				from: fTableID,
				where:"Niche = '" +selCat + "'"
			},
			templateId: 2,
			styleId: 2
		});	
	}	
	// center the selected points
	var bounds = new google.maps.LatLngBounds();
    for(i = 0; i < data.rows.length; i++) {
        var point = new google.maps.LatLng(
            data.rows[i][1], 
            data.rows[i][2]
            );
        bounds.extend(point);
    }

    // zoom to the bounds
    map.fitBounds(bounds);
}

google.maps.event.addDomListener(window, 'load', initialize);
