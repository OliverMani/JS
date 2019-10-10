## Spurning 1:
### a) Afhverju er getElementById() fljótleglegasta aðferðin?
Af því að þegar getElementById() finnir það sem það er að leita að þá stoppar það alveg og fer að skila á meðan önnur föll halda áfram í gegnum allt HTML'ið
### b) Hvað er málið með auða hnúta (e. whitespace nodes) og DOM tréið?
Sumir vafrar setja inn tag sem kallast whitespace á milli allra tagga svo að þegar þú ert að reyna að finna "child" (t.d fyrsta) þá gætirðu lent í veseni með að fá whitespace
### c) Hvað er static og live NodeList, hver er munurinn á NodeList og HTMLCollection?
### d) Hvað erevent í eftirfarandi kóða og hvað er gert með því? 
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
