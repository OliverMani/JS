"use strict";
let content = document.getElementById('content');
let quiz = document.createElement('div');
let stigatafla = document.createElement('h2');

let spurningar = [
	{spurning:'Hvaða ár er Ólafur Ragnar fæddur?', svor:['1944', '1943', '1945', '1941'], rett:1, mynd:'img/olafurragnar.jpeg'},
	{spurning:'Er Guðni Th Jóhannesson 7. forseti Íslands', svor:['Já', 'Nei'], rett:1, mynd:'img/gudnith.jpg'},
];

let stig = 0;

function breytaStigatoflu(){
	stigatafla.innerHTML = 'Stig: ' + stig;
}

function geraHTML(){
	let titill = document.createElement('div');
	titill.innerHTML = "<h1>Quiz</h2>";
	titill.id = "titill";
	content.appendChild(titill);
	
	breytaStigatoflu();
	quiz.id = "quiz";
	
	content.appendChild(quiz);
	content.appendChild(stigatafla);
}

function setjaSpurningu(index){
	quiz.innerHTML = "";
	let spurning = document.createElement('h2');
	spurning.className = 'spurning';
	spurning.innerHTML = spurningar[index].spurning;
	quiz.appendChild(spurning);

	if(spurningar[index].mynd != undefined){
		let mynd = document.createElement('img'); // Setur mynd, aukaatriði
		mynd.src = spurningar[index].mynd;
		mynd.width = "220";
		mynd.className = "mynd";
		quiz.appendChild(mynd);
		quiz.appendChild(document.createElement('br'));
	}
	

	

	let svor = spurningar[index].svor;

	for(let i = 0; i < svor.length; i++){
		let takki = document.createElement('div');
		takki.className = "takki";
		let svar = document.createElement('p');
		svar.innerHTML = svor[i];

		let smella = function(e){
			takki.removeEventListener('click', smella);
			if(i == spurningar[index].rett){
				stig+=1;
				breytaStigatoflu();
			}
			console.log("Þú smelltir á " + svor[i]);
			if(spurningar.length <= index+1){
				// hérna á leikurinn að enda
				quiz.innerHTML = "<h3>Leik lokið</h3>";

			} else {
				setjaSpurningu(index+1);
			}
		}

		takki.addEventListener('click', smella);

		takki.appendChild(svar);
		quiz.appendChild(takki);
	}
}

geraHTML();

setjaSpurningu(0);