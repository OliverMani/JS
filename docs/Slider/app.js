"use strict";

let slider = document.getElementById('slider');

let folk = [{nafn:'Casey',kaup:60},{nafn:'Camille',kaup:80},{nafn:'Gordon',kaup:75},{nafn:'Nigel',kaup:120}];

let tafla = document.getElementById('gogn');
let min = document.getElementById('min');
let max = document.getElementById('max');

let radir = [];

for(var i = 0; i < folk.length; i++){
	let rod = document.createElement('tr');
	let nafn = document.createElement('td');
	let kaup = document.createElement('td');

	nafn.innerHTML = folk[i].nafn;
	kaup.innerHTML = folk[i].kaup;

	rod.appendChild(nafn);
	rod.appendChild(kaup);

	radir.push({element:rod, kaup:folk[i].kaup});

	tafla.appendChild(rod);
}

noUiSlider.create(slider, {
    start: [20, 80],
    connect: true,
    margin: 23,
    range: {
        'min': 0,
        'max': 150
    }
});

slider.noUiSlider.on('update', function(values){
	for(let i = 0; i < radir.length; i++){

		min.value = values[0];
		max.value = values[1];

		let rod = radir[i];
		
		if(rod.kaup <= values[1] && rod.kaup >= values[0]){
			rod.element.style.display = "table-row";
		} else {
			rod.element.style.display = "none";
		}
		
	}
});

function updateValues(e){
	if(e.target.id == 'max'){
		slider.noUiSlider.set([null, max.value])
	} else if(e.target.id == "min"){
		slider.noUiSlider.set([min.value, null])
	}

}

//
min.addEventListener('change', updateValues);
max.addEventListener('change', updateValues)
