## Spurning 1:
### a) Afhverju er getElementById() fljótleglegasta aðferðin?
Af því að þegar getElementById() finnir það sem það er að leita að þá stoppar það alveg og fer að skila á meðan önnur föll halda áfram í gegnum allt HTML'ið
### b) Hvað er málið með auða hnúta (e. whitespace nodes) og DOM tréið?
Sumir vafrar setja inn tag sem kallast whitespace á milli allra tagga svo að þegar þú ert að reyna að finna "child" (t.d fyrsta) þá gætirðu lent í veseni með að fá whitespace
### c) Hvað er static og live NodeList, hver er munurinn á NodeList og HTMLCollection?
### d) Hvað er event í eftirfarandi kóða og hvað er gert með því? 
```html
<a href="https://developer.mozilla.org/">MDN</a>
<script>
   let link = document.querySelector("a");
   link.addEventListener("click", event =>{
     console.log("Nope.");
     event.preventDefault();
   }); 
</script>
```
Þegar þú reynir að smella á linkinn þá virkar hann ekki heldur kemur javascript í veg fyrir það með event.preventDefault(); og svo þegar þú reynir að smella á linkinn MDN þá kemur í console "Nope.".

### e) Af þremur leiðum til að binda event þá er AddEventListener() nýjust en afhverju er hún betri en hinar?
Þú getur sett inn marga eins event listeners á sama DOM object'ið í einu

### f) Hver er munurinn á true og false í AddEventListener?
Forgangsröðunin er öðruvísi, semsagt t.d ef þú ert með stórt div í HTML og svo lítið div inn í stóra div'inu og þeir hafa báðir event listener, þá fer eftir því hvort þú setur true eða false hvor hlustandinn keyrir fyrst

### g) this vísar í Event listener á html element en ekki á object. Þú getur notað bind() til að breyta því, leystu eftirfarandi kóðadæmi með notkun á bind() til að birta í console “My name is Sam“ en ekki undefined.

## 2. Búðu til einfalda html vefsíðu og notaðu JavaScript til að bæta við eftirfarandi i div container íhtml skránna (4%):
### a) Notaðu InnerHTML aðferðina til  að bæta við  <h1> með nafninu þínu
```javascript
"use strict"
document.body.innerHTML = '<div id="container"></div>';
```
### b) Notaðu createElement() og append() til að bæta við <div> með svörtum border. Þetta div á svo að  innihalda  <h2> Verkefni 5.1,  <ol> og <li> og önnu html element sem þú vilt til að birtaspurningar og svör frá lið 1 hér að ofan
```javascript
"use strict"

let make = (element) => document.createElement(element);


let div = make('div');
div.id = 'container';
let title = make('h2');
title.innerHTML = "Verkefni 5.1";
let ul = make('ol');
for(let i = 0; i < 10; i++){
	let li = make('li');
	li.innerHTML = 'HeLlO';
	ul.appendChild(li);
}
div.appendChild(title);
div.appendChild(ul);

document.body.appendChild(div);
```

## 3. Quiz vefapp