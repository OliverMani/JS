"use strict";

let table = document.getElementById('concerts');
let allData = undefined;
let dates = [];

const days = ["Janúar", "Febrúar", "Mars", "Apríl", "Maí", "Júní", "Júlí", "Ágúst", "September", "Október", "Nóvember", "Desember"];

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

function parseTime(time){
	let day = time.substring(0, time.indexOf('T'));
	
	let split = day.split('-');

	return split[2] + ". " + days[parseInt(split[1])-1] + ' ' + split[0];
}

function filterConcerts(filter, from='', to=''){
	let concerts = table.getElementsByClassName('concert');

	if(from == '')
		from = Math.min(...dates);
	if(to == '')
		to = Math.max(...dates);

	console.log("FROM:",from,"TO:",to)

	for(let i = 0; i < concerts.length; i++){
		let textdate = concerts[i].getElementsByClassName('info')[1].innerHTML.replace(".","");
		let datelist = textdate.split(" ");
		let format = datelist[2] + '-' + (days.indexOf(datelist[1])+1) + '-' + datelist[0] + "T20:00:00";
		let date = new Date(format).getTime();
		console.log("Date:", date,"from:",from,"to:",to, "datelist:",datelist, "format:", format, "check:", (date >= from && date <= to));
		if((concerts[i].innerHTML.toLowerCase().includes(filter.toLowerCase()) || filter == '') && ((date >= from && date <= to) || to == NaN || from == NaN)){
			concerts[i].style.display = "inline-block";
		} else {
			concerts[i].style.display = "none";
		}
	}

	return false;
}

function init(data){



	let sorted = makeMyOwnDataStructure(data); // Hérna erum við að kalla á fall sem ég gerði svo sömu tónleikarnir birtast ekki tvisvar
	console.log(sorted);
	allData = sorted;

	let searchbar = document.getElementById('leita');
	searchbar.value = '';

	let fromdate = document.getElementById('fromdate');
	let todate = document.getElementById('todate');

	let refresh = function(){
		filterConcerts(searchbar.value, new Date(fromdate.value).getTime(), new Date(todate.value).getTime());
	}

	document.getElementById('search').addEventListener('input', refresh);
	fromdate.addEventListener('input', refresh);
	todate.addEventListener('input', refresh);




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

// Sækir gögnin
function postInit(url, request){
	if(url == undefined)
		return;
	let con = new XMLHttpRequest();
	let json = undefined;
	con.open("GET", url, true);

	con.onreadystatechange = function(){
		if(con.readyState === 4 && con.status == 200){
			json = JSON.parse(con.responseText);
			console.log();
			init(json);
		} else {
			json = "error";
		}
	};

	con.send();

}

// Undirbýr HTML
function preInit(){

}

preInit();
postInit("https://apis.is/concerts");