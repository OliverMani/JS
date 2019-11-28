"use strict";

let table = document.getElementById('concerts');
let allData = undefined;
let dates = [];

const days = ["Janúar", "Febrúar", "Mars", "Apríl", "Maí", "Júní", "Júlí", "Ágúst", "September", "Október", "Nóvember", "Desember"];

// Þetta fall breytir objectinu sem við fáum í annað object til að einfalda fyrir okkur vinnsluna
function makeMyOwnDataStructure(data){
	let names = [];
	let result = [];
	for(let i = 0; i < data.results.length; i++){
		let chunk = data.results[i];
		dates.push(new Date(chunk.dateOfShow).getTime());
		if(names.includes(chunk.eventDateName)){
			// þurfum þarna að finna event
			for(let x = 0; x < result.length; x++){
				if(chunk.eventDateName == result[x].name){
					result[x].date.push(chunk.dateOfShow);
					break;
				}
			}
		} else {
			names.push(chunk.eventDateName);
			const obj = {
				name: chunk.eventDateName,
				type: chunk.name,
				date: [chunk.dateOfShow],
				image: chunk.imageSource,
				place: chunk.eventHallName,
				who: chunk.userGroupName
			};
			result.push(obj);
		}
	}
	return result;
}

// Þegar músin snertir eitthvað
function mouseEnter(event){
	if(event.target.className != "mynd"){
		return;
	}
	let background = event.target.style.background;
	event.target.style.background = "linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3))," + background;
	
	let classes = event.target.getElementsByClassName('info');
	for(let i = 0; i < classes.length; i++){
		classes[i].style.display = "block";
	}
}

// Þegar músin fer út úr boxi
function mouseExit(event){
	if(event.target.className != "mynd"){
		return;
	}
	let backgroundImage = event.target.style.backgroundImage;
	backgroundImage = backgroundImage.substring(backgroundImage.indexOf('u'));
	
	event.target.style.background = "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))," + backgroundImage;

	let classes = event.target.getElementsByClassName('info');
	for(let i = 0; i < classes.length; i++){
		classes[i].style.display = "none";
	}
}

// Býr til íslenska dagsetningu á tónleikum
function parseTime(time){
	let day = time.substring(0, time.indexOf('T'));
	let split = day.split('-');
	return split[2] + ". " + days[parseInt(split[1])-1] + ' ' + split[0];
}

// Finnur tónleika sem innihalda það sem þú leitar að í nafninu
function filterConcerts(filter, from='', to=''){
	let concerts = table.getElementsByClassName('concert');

	// Hér þurfum við að nota isNaN fallið í staðinn fyrir að gera from == NaN, af því að eitthvað fall sem heitir isNaN virkar
	if(from == '' || isNaN(from))
		from = Math.min(...dates);
	if(to == '' || isNaN(to))
		to = Math.max(...dates);

	

	for(let i = 0; i < concerts.length; i++){
		let textdate = concerts[i].getElementsByClassName('info')[1].innerHTML.replace(".","");
		let datelist = textdate.split(" ");
		let format = datelist[2] + '-' + (days.indexOf(datelist[1])+1) + '-' + datelist[0] + "T20:00:00";
		let date = new Date(format).getTime();
		
		// Hér felum við þá tónleika sem eiga ekki við í leitarskilyrðum, t.d birtum bara það sem er í leitartextanum, og í tímabilinu sem þú velur, nema ef það sé hreinsað út
		if(((concerts[i].innerHTML.toLowerCase().includes(filter.toLowerCase()) || filter == '') && ((date >= from && date <= to)) || (isNaN(to) || isNaN(from)))){
			concerts[i].style.display = "inline-block";
		} else {
			concerts[i].style.display = "none";
		}
	}

	return false; // við gerum return false fyrir HTML svo við refresh'um ekki óvart síðuna
}

// Start fallið
function init(data){


	// Hérna erum við að kalla á fall sem ég gerði svo sömu tónleikarnir birtast ekki tvisvar
	let sorted = makeMyOwnDataStructure(data); 

	allData = sorted;

	// Hér erum við eiginlega bara að ná í elements og stilla þau
	let searchbar = document.getElementById('leita');
	searchbar.value = '';

	let fromdate = document.getElementById('fromdate');
	let todate = document.getElementById('todate');
	// Við búum til fall og látum breytu vísa í það, af því að 3 mismunandi listeners eiga að kalla á sama fallið
	// Þetta filter'ar sjálfkrafa svo við þurfum ekki að hafa leitartakka hjá okkur
	let refresh = function(){
		filterConcerts(searchbar.value, new Date(fromdate.value).getTime(), new Date(todate.value).getTime());
	}

	// listeners
	document.getElementById('search').addEventListener('input', refresh);
	fromdate.addEventListener('input', refresh);
	todate.addEventListener('input', refresh);



	// Hérna erum við að setja upp alla tónleikana
	for(let i = 0; i < sorted.length; i++){
		let obj = sorted[i];

		let option = document.createElement('div');
		let image = document.createElement('div');
		image.style.background = "url(" + obj.image + ")";

		image.className = "mynd";

		let place = document.createElement('h2');
		place.className = "info";
		place.style.display = "none";
		place.innerHTML = obj.place;

		let datelist = obj.date;
		image.appendChild(place);
		for(let x in datelist){
			let date = document.createElement('h3');
			date.className = "info";
			date.style.display = "none";
			date.innerHTML = parseTime(datelist[x]);

			image.appendChild(date);
		}
		

		
		

		option.appendChild(image);

		option.className = "concert";

		option.appendChild(document.createElement('br'));
		let title = document.createElement('h4');
		title.className = "concertName";
		title.innerHTML = obj.name;

		image.addEventListener('mouseover', mouseEnter);
		image.addEventListener('mouseleave', mouseExit)

		option.appendChild(title);

		table.appendChild(option);
	}
}

// Við viljum byrja á því að ná í gögnin sem við þurfum
function preInit(url, request){
	// Ef við setjum ekkert url þá getum við hvort sem er ekkert gert
	if(url == undefined)
		return;
	// Tengist web servernum
	let con = new XMLHttpRequest();
	let json = undefined;
	con.open("GET", url, true);

	con.onreadystatechange = function(){
		if(con.readyState === 4 && con.status == 200){
			// Breytum gögnunum í object

			json = JSON.parse(con.responseText);
			// Hérna byrjar vinnslan á gögnunum
			init(json);
		} else {
			json = "error";
		}
	};

	// sendum request'ið
	con.send();

}

// Hér byrjum við með því að kalla á fallið sem á að sækja gögnin
preInit("https://apis.is/concerts");
