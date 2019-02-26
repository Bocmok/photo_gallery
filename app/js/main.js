
 window.onload = function(){

    var phContainer = document.getElementById('photo-container');
    var citySelect = document.getElementById('city');
    var nameInput = document.getElementById('name');
    var errorText = document.getElementById('error');
    var popup = document.getElementById('popup');
    var uniqueCities = [];

    var currentPhotosSelectedByName = [];
    var currentPhotosSelectedByCity = [];

    var cities = [];
    var photos = [];
    var names = [];

    var error = false;


    for (var i = 0; i < photos_db.length; i++){
        cities[i] = photos_db[i].city;
        photos[i] = photos_db[i].src;
        names[i] = photos_db[i].name;
    }

    if( 'devicePixelRatio' in window && window.devicePixelRatio == 2 ){
        for (var i = 0; i < photos.length; i++) {

            var src = photos[i];
            src = src.replace(/\.(jpg|jpeg)/, '@2x.$1');
            photos[i] = src;

        }
    }

    drawPhotos(photos, phContainer);

    uniqueCities = unique(cities);
    for (var i = 0; i <uniqueCities.length; i++) {
        citySelect.options[i+1] = new Option(uniqueCities[i], "city" + (i+1));
    }

/*------------------INPUT FOR CITY--------------------------------------------------------*/    
 
    citySelect.addEventListener('change', function() {
        var photosSelectedByCity = [];
        var photosSelectedByCityFilter = [];
        var result = [];

        for (var i = 0; i < photos_db.length; i++) {
            if (this.options[this.selectedIndex].text == cities[i]) {
                photosSelectedByCity[i] = photos[i];
            }
            if (this.options[this.selectedIndex].text == '') {
                photosSelectedByCity[i] = photos[i]
            }
        }

        photosSelectedByCityFilter = photosSelectedByCity.filter(element => element !== null);
        currentPhotosSelectedByCity = photosSelectedByCityFilter.slice();

        if (currentPhotosSelectedByName.length > 0) {
            result = findCommonElem(photosSelectedByCityFilter, currentPhotosSelectedByName);
        }
        else {
            result = currentPhotosSelectedByCity;
        }
        if (!error) {
            if ((result.length > 0) || (citySelect.value == 0)) {
                removeChildren(phContainer);
                drawPhotos(result.filter(element => element !== null), phContainer);
                errorText.style.display = 'none';
            }
            else{
                errorText.style.display = 'block';
                removeChildren(phContainer);
            }
        }
        else {
            errorText.style.display = 'block';
            removeChildren(phContainer);
        }
    });

/* ----------------INPUT FOR NAME---------------------------------------------------------------*/

    nameInput.addEventListener('input', function(){
        var photosSelectedByName = [];
        var photosSelectedByNameFilter = [];
        var result = [];

        for (var i = 0; i < names.length; i++) {
            if (names[i].startsWith(nameInput.value)) {
                photosSelectedByName[i] = photos[i];
            } 
        }

        photosSelectedByNameFilter = photosSelectedByName.filter(element => element !== null);
        currentPhotosSelectedByName = photosSelectedByNameFilter.slice();

        if (currentPhotosSelectedByCity.length > 0) {
            result = findCommonElem(photosSelectedByNameFilter,currentPhotosSelectedByCity);
        }
        else {
            result = currentPhotosSelectedByName;
        }
        
        if ((result.length > 0) || (nameInput.value == '')) {
            removeChildren(phContainer);
            drawPhotos(result.filter(element => element !== null), phContainer);
            errorText.style.display = 'none';
            error = false;
        }
        else{
            errorText.style.display = 'block';
            removeChildren(phContainer);
            error = true;
        }
    });

}


function removeChildren(elem) {
  while (elem.lastChild) {
    elem.removeChild(elem.lastChild);
  }
}

function unique(arr) {
	var obj = {};

	for (var i = 0; i < arr.length; i++) {
		var str = arr[i];
		obj[str] = true;
	}

	return Object.keys(obj);
}

function drawPhotos (arr, container) {

	for (var i = 0; i < arr.length; i++) {
        
		var newImg = new Image();
		newImg.src = './data/photos/' + arr[i];
        newImg.className = 'photo__elem';

		container.appendChild(newImg);
	} 
}

function findCommonElem (arr1, arr2) {
    var result = [];

    for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
            if (arr1[i] == arr2[j]) {
                result[i] = arr1[i];
            }
        }
    }

    return result;
}



