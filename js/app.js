import{hydrate,subscribe,getState,selectRecipe,toggleFavorite,saveRecipe,setRecipeTargetServings,saveShopping,removeShopping,saveInventory,removeInventory,saveSettings,setMode,isProMode,startCooking,setCookingStep,finishCooking,getRecipeStockStatus,consumeRecipeIngredients,addMissingToShopping,getRecipeFoodCost}from"./state.js";import{initRouter,navigate}from"./router.js";

const app=document.querySelector("#app");

const NAV=[
  ["start","home","Start"],
  ["recipes","book","Receptury"],
  ["cooking","chef","Kuchnia"],
  ["shopping","bag","Zakupy"],
  ["settings","more","Więcej"]
];

const ICONS={
  home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/></svg>',
  book:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h10a4 4 0 0 1 4 4v12H8a3 3 0 0 1-3-3z"/><path d="M8 20a3 3 0 0 0 0-6h11M8 8h7M8 11h5"/></svg>',
  chef:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V8a3 3 0 0 1 3-3c.7 0 1.35.24 1.86.64A3 3 0 0 1 17 8v2"/><path d="M5 10h14v3a2 2 0 0 1-2 2h-1v4H8v-4H7a2 2 0 0 1-2-2z"/><path d="M9 19h6"/></svg>',
  bag:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 12H4z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  more:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg>',
  search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4.2 4.2"/></svg>',
  plus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  flame:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3c1.4 3.1-.2 4.9-1.7 6.2C10 10.3 9 11.7 9 14a3 3 0 0 0 6 0c0-1.4-.6-2.7-1.5-3.7 3.1 1.8 4.5 4.1 4.5 6.7a6 6 0 0 1-12 0c0-4.2 2.7-7.1 5.1-9.4C12.8 6.1 13.3 4.5 13 3z"/></svg>',
  cart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l1.4 9.2a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 1.9-1.4L21 8H7"/><circle cx="10" cy="19" r="1.2"/><circle cx="18" cy="19" r="1.2"/></svg>',
  box:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 7 8-4 8 4-8 4zM4 7v10l8 4 8-4V7M12 11v10"/></svg>',
  prep:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M7 3h10M7 6v13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6"/><path d="M9 11h6M9 15h4"/></svg>',
  menu:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"/><path d="M8 9h8M8 12h8M8 15h5"/></svg>',
  calc:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M14 11h2M8 15h2M14 15h2M8 18h8"/></svg>',
  heart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.1-8.8 10.4-8.8 10.4S3.2 13.8 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6z"/></svg>',
  settings:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z"/><path d="m19.4 15 .1.1-1.6 2.7-.2-.1a2.1 2.1 0 0 0-2.5.2l-.2.2a2.1 2.1 0 0 0-.6 2v.2h-3.2v-.2a2.1 2.1 0 0 0-1.5-2l-.2-.1a2.1 2.1 0 0 0-2.5-.2l-.2.1-1.6-2.7.1-.1a2.1 2.1 0 0 0 .9-2.3l-.1-.3a2.1 2.1 0 0 0-1.6-1.7h-.2V7.5h.2A2.1 2.1 0 0 0 6 5.8l.1-.3a2.1 2.1 0 0 0-.9-2.3l-.1-.1 1.6-2.7.2.1a2.1 2.1 0 0 0 2.5-.2l.2-.1a2.1 2.1 0 0 0 1.5-2V0h3.2v.2a2.1 2.1 0 0 0 .6 2l.2.1a2.1 2.1 0 0 0 2.5.2l.2-.1 1.6 2.7-.1.1a2.1 2.1 0 0 0-.9 2.3l.1.3a2.1 2.1 0 0 0 1.6 1.7h.2v3.2h-.2a2.1 2.1 0 0 0-1.6 1.7l-.1.3a2.1 2.1 0 0 0 .9 2.3z" transform="translate(0 3) scale(.76)"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
  barcode:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5v14M7 5v14M10 5v14M14 5v14M17 5v14M20 5v14"/></svg>'
};

const QUICK=[
  ["recipes","plus","Nowa receptura","Stwórz własną recepturę"],
  ["cooking","flame","Gotowanie","Tryb pracy krok po kroku"],
  ["shopping","cart","Zakupy","Dodaj i połącz produkty"],
  ["inventory","box","Magazyn","Stany i końcówki"],
  ["calculators","calc","Kalkulator","Pizza, koszt, proporcje"],
  ["favorites","heart","Ulubione","Twoje zapisane receptury"],
  ["settings","more","Więcej","Ustawienia i dane"]
];

const CATEGORIES=[
  ["Pizza","12 receptur","pizza.svg","recipes"],
  ["Pasta","8 receptur","pasta.svg","recipes"],
  ["Piekarnia","6 receptur","bakery.svg","recipes"],
  ["Warzywa","9 receptur","veg.svg","recipes"]
];

function icon(name){return '<span class="svg-icon">'+(ICONS[name]||"")+"</span>"}

function startScreen(state){
  const quick=state.settings.mode==="amator" ? QUICK.filter(x=>x[0]!=="calculators").map(x=>x[0]==="inventory"?["inventory","box","Lodówka","Produkty i zapasy"]:x) : QUICK;
  const recipes=state.recipes.length;
  const shopping=state.shopping.filter(x=>!x.purchased).length;
  const inventory=state.inventory.length;
  return '<section class="screen home-screen">'+
    '<div class="home-header">'+
      '<div><span class="home-overline">DOBRY WIECZÓR</span><h1>Co dziś<br><em>gotujemy?</em></h1></div>'+
      '<button class="topbar-action" type="button" data-route="settings" aria-label="Ustawienia">'+icon("settings")+"</button>"+
    "</div>"+
    '<label class="home-search" aria-label="Szukaj w Kucharzynie">'+icon("search")+'<input id="home-search-input" type="search" inputmode="search" autocomplete="off" placeholder="Szukaj receptury, składnika..." /><button class="home-search-clear" type="button" aria-label="Wyczyść" hidden>×</button></label>'+
    '<section class="home-command">'+
      '<div class="command-copy"><span>KUCHARZYNA</span><strong>Zacznij od receptury.</strong><p>Wybierz danie i przejdź prosto do pracy.</p></div>'+
      '<button class="command-button" type="button" data-route="recipes" aria-label="Otwórz receptury">'+icon("arrow")+"</button>"+
    "</section>"+
    '<div class="home-metrics">'+
      '<div><b>'+recipes+'</b><span>receptur</span></div>'+
      '<div><b>'+shopping+'</b><span>na zakupach</span></div>'+
      '<div><b>'+inventory+'</b><span>w magazynie</span></div>'+
    "</div>"+
    '<div class="section-heading home-section-heading"><span><small>SKRÓTY</small><h2>Szybki dostęp</h2></span></div>'+
    '<div class="home-action-grid">'+quick.map(([route,ic,title,copy])=>
      '<button class="home-action" type="button" data-route="'+route+'">'+
        '<span class="home-action-icon">'+icon(ic)+'</span>'+
        '<span class="home-action-copy"><b>'+title+'</b><small>'+copy+'</small></span>'+
        '<span class="home-action-arrow">'+icon("arrow")+"</span>"+
      "</button>").join("")+
    "</div>"+
    '<div class="section-heading home-section-heading"><span><small>BAZA RECEPTUR</small><h2>Odkrywaj kategorie</h2></span><button class="section-link" type="button" data-route="recipes">Wszystkie</button></div>'+
    '<div class="category-scroller">'+CATEGORIES.map(([title,count,image,route])=>
      '<button class="category-card" type="button" data-route="'+route+'">'+
        '<img src="./assets/start/'+image+'" alt="" loading="lazy" />'+
        '<span class="category-shade"></span>'+
        '<span class="category-copy"><b>'+title+'</b><small>'+count+'</small></span>'+
      "</button>").join("")+
    "</div>"+
    '<div class="home-footer-card"><div><span>KUCHARZYNA</span><b>Twoja kuchnia, bez chaosu.</b><small>Przepisy, prep, zakupy i magazyn w jednym miejscu.</small></div>'+icon("arrow")+"</div>"+
  "</section>";
}

function recipeEditor(state){
  const existing=state.selectedRecipe?state.recipes.find(r=>r.id===state.selectedRecipe):null;
  const recipe=existing||{id:null,name:"",category:"Pizza",region:"",time:"",servings:1,favorite:false,ingredients:[{name:"",qty:"",unit:"g"}],steps:[""],notes:""};
  return '<section class="screen module-screen recipe-editor">'+
    '<button class="back-link" type="button" data-editor-back>‹ Receptury</button>'+
    '<div class="section-kicker">EDYTOR RECEPTURY</div><h1 class="screen-title">'+(existing?'Edytuj recepturę':'Nowa receptura')+'</h1>'+
    '<form id="recipe-form">'+
      '<div class="form-card"><label>Nazwa<input class="input" name="name" required value="'+escapeHtml(recipe.name)+'" placeholder="np. Carbonara"></label>'+
      '<div class="form-grid"><label>Kategoria<select class="input" name="category">'+["Pizza","Pasta","Piekarnia","Warzywa","Mięso","Ryby","Desery","Inne"].map(x=>'<option '+(x===recipe.category?'selected':'')+'>'+x+'</option>').join('')+'</select></label>'+
      '<label>Porcje<input class="input" name="servings" type="number" min="1" step="1" value="'+recipe.servings+'"></label></div>'+
      '<div class="form-grid"><label>Region / kuchnia<input class="input" name="region" value="'+escapeHtml(recipe.region||"")+'" placeholder="np. Lazio, Włochy"></label>'+
      '<label>Czas<input class="input" name="time" value="'+escapeHtml(recipe.time||"")+'" placeholder="np. 25 min"></label></div>'+
      '<label>Cena sprzedaży / porcję (zł)<input class="input" name="sellPrice" type="number" min="0" step="0.01" value="'+(Number(recipe.sellPrice)||0)+'" placeholder="np. 42"></label></div>'+
      '<div class="form-card"><div class="editor-section-head"><h2>Składniki</h2><button class="button button-secondary" type="button" id="add-ingredient">＋ Dodaj</button></div><div id="ingredient-editor">'+recipe.ingredients.map(ingredientRow).join('')+'</div></div>'+
      '<div class="form-card"><div class="editor-section-head"><h2>Przygotowanie</h2><button class="button button-secondary" type="button" id="add-step">＋ Krok</button></div><div id="step-editor">'+recipe.steps.map((x,i)=>'<div class="editor-row step-row"><span class="row-number">'+(i+1)+'</span><textarea name="step" rows="2" placeholder="Opisz kolejny krok...">'+escapeHtml(x)+'</textarea><button type="button" class="row-remove" aria-label="Usuń krok">×</button></div>').join('')+'</div></div>'+
      '<div class="form-card"><label>Własne uwagi<textarea class="notes-input" name="notes" rows="4" placeholder="Notatki, zmiany, uwagi z kuchni...">'+escapeHtml(recipe.notes||"")+'</textarea></label></div>'+
      '<button class="button button-primary button-block save-recipe" type="submit">Zapisz recepturę</button>'+
    '</form>'+
  '</section>';
}
function ingredientRow(i){
  return '<div class="editor-row ingredient-row"><input name="ingredientName" class="input" value="'+escapeHtml(i.name||"")+'" placeholder="Składnik"><input name="ingredientQty" class="input qty" inputmode="decimal" value="'+(i.qty??"")+'" placeholder="Ilość"><input name="ingredientUnit" class="input unit" value="'+escapeHtml(i.unit||"g")+'" placeholder="g"><button type="button" class="row-remove" aria-label="Usuń składnik">×</button></div>';
}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[x]));}
function formatScaledQuantity(qty,factor){const n=Number(qty);if(!Number.isFinite(n))return qty;const value=n*factor;return Number.isInteger(value)?String(value):String(Number(value.toFixed(2)));}
function formatMoney(value){return new Intl.NumberFormat("pl-PL",{style:"currency",currency:"PLN",minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(value)||0)}
function formatPercent(value){return (Math.round(Number(value)*10)/10).toLocaleString("pl-PL")+"%"}
function recipeScreen(state,favoritesOnly=false){
  const recipes=favoritesOnly?state.recipes.filter(r=>r.favorite):state.recipes;
  const selected=favoritesOnly?null:recipes.find(r=>r.id===state.selectedRecipe);
  if(selected){
    const food=getRecipeFoodCost(selected.id,state.recipeTargetServings||selected.servings);
    return '<section class="screen module-screen recipe-detail">'+
      '<button class="back-link" type="button" data-recipe-back>‹ Receptury</button>'+
      '<span class="section-kicker">'+selected.category+' · '+selected.region+'</span>'+
      '<h1 class="screen-title">'+selected.name+'</h1>'+
      '<div class="recipe-meta"><span>'+selected.time+'</span><span>'+selected.servings+' porcji</span><span>'+selected.ingredients.length+' składników</span></div>'+
      '<div class="scale-panel"><div><small>SKALOWANIE RECEPTURY</small><strong>Na ile porcji?</strong></div><div class="scale-controls"><button type="button" class="scale-step" data-scale-step="-1" aria-label="Zmniejsz liczbę porcji">−</button><input id="recipe-servings" class="scale-input" type="number" min="1" step="1" value="'+(state.recipeTargetServings||selected.servings)+'" aria-label="Docelowa liczba porcji"><button type="button" class="scale-step" data-scale-step="1" aria-label="Zwiększ liczbę porcji">＋</button></div><span class="scale-note">Bazowa receptura: '+selected.servings+' porcji</span></div><div class="recipe-detail-actions"><button class="button button-secondary" type="button" data-favorite="'+selected.id+'">'+(selected.favorite?'♥ Ulubione':'♡ Dodaj do ulubionych')+'</button><button class="button button-secondary" type="button" data-edit-recipe="'+selected.id+'">✎ Edytuj</button><button class="button button-primary button-block" type="button" data-start-cooking="'+selected.id+'">👨‍🍳 Zacznij gotowanie</button></div>'+
      (state.settings.mode==="pro"?'<div class="food-cost-card"><div class="food-cost-head"><div><small>FOOD COST</small><h2>Koszt receptury</h2></div><span class="calculator-badge">PRO</span></div><div class="food-cost-grid"><div><span>Koszt całości</span><b>'+formatMoney(food.cost)+'</b></div><div><span>Koszt / porcję</span><b>'+formatMoney(food.costPerServing)+'</b></div><div><span>Food Cost</span><b>'+(food.percent===null?"Ustaw cenę sprzedaży":formatPercent(food.percent))+'</b></div></div>'+(food.unpriced.length?'<p class="food-cost-warning">Brak ceny: '+food.unpriced.map(x=>escapeHtml(x.name)).join(", ")+'</p>':'<p class="food-cost-ok">Wszystkie składniki mają cenę w magazynie.</p>')+'</div>'
      :'')+'<div class="recipe-block"><div class="section-heading"><span><small>SKŁADNIKI</small><h2>Składniki</h2></span></div>'+
      '<ul class="ingredient-list">'+selected.ingredients.map(i=>'<li><span>'+i.name+'</span><b>'+formatScaledQuantity(i.qty,(state.recipeTargetServings||selected.servings)/Math.max(1,Number(selected.servings)))+' '+i.unit+'</b></li>').join('')+'</ul></div>'+
      '<div class="recipe-block"><div class="section-heading"><span><small>PRACA</small><h2>Przygotowanie</h2></span></div>'+
      '<ol class="steps-list">'+selected.steps.map(x=>'<li>'+x+'</li>').join('')+'</ol></div>'+
    '</section>';
  }
  const categories=["Wszystkie",...new Set(recipes.map(r=>r.category))];
  return '<section class="screen module-screen recipes-screen">'+
    '<div class="module-head"><div><span class="section-kicker">KUCHARZYNA</span><h1 class="screen-title">'+(favoritesOnly?'Ulubione':'Receptury')+'</h1><p class="screen-lead">'+(favoritesOnly?'Twoje zapisane receptury, gotowe do pracy.':'Twoja baza receptur, gotowa do pracy.')+'</p></div><button class="button button-primary recipe-add" type="button" aria-label="Dodaj recepturę">＋</button></div>'+
    '<label class="search-field recipes-search">'+icon("search")+'<input id="recipe-search" class="input" type="search" placeholder="Szukaj receptury lub składnika..." autocomplete="off"><button id="recipe-search-clear" class="search-clear" type="button" aria-label="Wyczyść" hidden>×</button></label>'+
    '<div class="chip-row recipe-filters">'+categories.map((x,i)=>'<button class="chip '+(i===0?'active':'')+'" type="button" data-category="'+x+'">'+x+'</button>').join('')+'</div>'+
    '<div class="recipe-results" id="recipe-results">'+recipeCards(recipes)+'</div>'+
  '</section>';
}
function recipeCards(recipes){
  if(!recipes.length)return '<div class="empty-state"><h2>Brak receptur</h2><p>Dodaj pierwszą recepturę i zacznij budować swoją bazę.</p></div>';
  return recipes.map(r=>'<button class="recipe-card" type="button" data-recipe="'+r.id+'">'+
    '<span class="recipe-card-top"><span class="badge">'+r.category+'</span><span class="recipe-heart">'+(r.favorite?'♥':'♡')+'</span></span>'+
    '<span class="recipe-card-title">'+r.name+'</span><span class="recipe-card-region">'+r.region+'</span>'+
    '<span class="recipe-card-bottom"><span>'+r.time+'</span><span>'+r.ingredients.length+' składników</span></span>'+
  '</button>').join('');
}
function moduleCard(title,copy,action,label){return '<div class="module-card"><div><small>'+title+'</small><p>'+copy+'</p></div>'+(action?'<button class="button button-secondary" type="button" data-module-action="'+action+'">'+label+'</button>':'')+'</div>'}
function cookingScreen(state){
  const selected=state.recipes.find(r=>r.id===state.cookingRecipe);
  if(!selected)return '<section class="screen module-screen"><span class="section-kicker">KUCHNIA</span><h1 class="screen-title">Kuchnia</h1><p class="screen-lead">Wejdź w recepturę i uruchom tryb pracy.</p><button class="button button-primary button-block" type="button" data-route="recipes">Wybierz recepturę</button></section>';
  const step=Math.min(state.cookingStep,Math.max(0,selected.steps.length-1));
  const done=step>=selected.steps.length-1;
  const stock=getRecipeStockStatus(selected.id,state.recipeTargetServings||selected.servings);
  const stockText=stock.missing.length
    ? '<div class="cook-stock cook-stock-warning"><b>Magazyn: '+stock.missing.length+' składników do uzupełnienia</b><small>'+stock.missing.map(x=>escapeHtml(x.name)+(x.available>0?" · brakuje "+(x.required-x.available)+" "+escapeHtml(x.unit):" · brak w magazynie")).join(" · ")+'</small><button class="button button-secondary" type="button" data-add-missing>＋ Dodaj braki do zakupów</button></div>'
    : '<div class="cook-stock cook-stock-ok"><b>Magazyn: komplet składników</b><small>Po zakończeniu ilości zostaną odjęte ze stanów.</small></div>';
  return '<section class="screen module-screen cooking-screen"><div class="module-head"><div><span class="section-kicker">TRYB PRACY</span><h1 class="screen-title">Kuchnia</h1></div><button class="button button-secondary" type="button" data-route="recipes">Wyjdź</button></div><div class="cook-hero"><small>AKTUALNA RECEPTURA</small><h2>'+selected.name+'</h2><span>'+(state.recipeTargetServings||selected.servings)+' porcji · '+selected.time+'</span></div>'+stockText+'<div class="cook-progress"><div><span>KROK '+(step+1)+' / '+selected.steps.length+'</span><b>'+Math.round(((step+1)/selected.steps.length)*100)+'%</b></div><div class="cook-progress-track"><i style="width:'+(((step+1)/selected.steps.length)*100)+'%"></i></div></div><div class="cook-step-card"><small>TERAZ</small><strong>'+selected.steps[step]+'</strong></div><div class="cook-controls"><button class="button button-secondary" type="button" data-cook-step="-1" '+(step===0?'disabled':'')+'>← Wstecz</button><button class="button button-primary" type="button" data-cook-step="1">'+(done?'Zakończ i rozlicz':'Dalej →')+'</button></div><div class="cook-all-steps"><small>WSZYSTKIE KROKI</small><ol class="steps-list cooking-steps">'+selected.steps.map((x,i)=>'<li class="'+(i<step?'done':'')+'">'+x+'</li>').join('')+'</ol></div></section>';
}
function shoppingScreen(state){
  const items=state.shopping;
  return '<section class="screen module-screen"><div class="module-head"><div><span class="section-kicker">LISTA</span><h1 class="screen-title">Zakupy</h1><p class="screen-lead">Produkty, które trzeba kupić.</p></div></div><form class="quick-add-form" id="shopping-form"><input class="input" name="item" placeholder="Dodaj produkt..." autocomplete="off"><button class="button button-primary" type="submit">＋</button></form><div class="module-list">'+(items.length?items.map(x=>'<label class="list-row"><input type="checkbox" data-shopping-toggle="'+x.id+'" '+(x.purchased?'checked':'')+'><span>'+x.name+'</span><button type="button" class="row-remove" data-shopping-remove="'+x.id+'">×</button></label>').join(''):'<div class="empty-state"><h2>Lista jest pusta</h2><p>Dodaj pierwszy produkt.</p></div>')+'</div></section>';
}
function refrigeratorScreen(state){
  return '<section class="screen module-screen"><div class="screen-head"><div><small>AMATOR</small><h1 class="screen-title">Lodówka</h1><p class="screen-subtitle">Prosty podgląd tego, co masz pod ręką.</p></div></div>'+
  '<div class="inventory-list">'+(state.inventory.length?state.inventory.map(x=>'<article class="inventory-row"><div class="inventory-row-head"><div><b>'+escapeHtml(x.name)+'</b><small>'+x.qty+' '+escapeHtml(x.unit)+'</small></div></div></article>').join(""):'<div class="empty-state"><h2>Lodówka jest pusta</h2><p>Dodaj produkty w trybie PRO.</p></div>')+'</div></section>';
}
function inventoryScreen(state){
  const lowCount=state.inventory.filter(x=>state.settings.lowStockAlerts&&Number(x.minQty)>0&&Number(x.qty)<=Number(x.minQty)).length;
  return '<section class="screen module-screen"><div class="module-head"><div><span class="section-kicker">STANY</span><h1 class="screen-title">Magazyn</h1><p class="screen-lead">Kontroluj ilości, minima i końcówki produktów.</p></div><div class="inventory-head-actions"><span class="inventory-count">'+state.inventory.length+'</span><button class="toggle inventory-alert-toggle '+(state.settings.lowStockAlerts?"active":"")+'" type="button" id="inventory-alert-toggle" aria-label="Przełącz alerty magazynu"><span></span></button></div></div>'+
    '<button class="module-card module-card-button inventory-scanner-launch" type="button" data-open-scanner><div><small>EAN / KOD KRESKOWY</small><p>Skanuj produkt aparatem albo wpisz kod ręcznie.</p></div><span>'+icon("barcode")+'</span></button><div class="scanner-panel" id="scanner-panel" hidden><div class="scanner-head"><div><small>SKANER</small><b>Dodaj produkt po EAN</b></div><button class="button button-secondary" type="button" data-close-scanner>Zamknij</button></div><div class="scanner-preview"><video id="barcode-video" playsinline muted></video><div class="scanner-frame"></div><span class="scanner-status" id="scanner-status">Uruchamiam kamerę…</span></div><div class="scanner-manual"><label>EAN<input class="input" id="barcode-ean" inputmode="numeric" autocomplete="off" placeholder="np. 5901234123457"></label><button class="button button-secondary" type="button" data-apply-ean>Użyj kodu</button></div><div class="scanner-result" id="scanner-result" hidden></div></div><form class="inventory-form" id="inventory-form"><input class="input" name="name" placeholder="Produkt..." autocomplete="off" required><div class="inventory-form-grid"><input class="input" name="qty" type="number" min="0" step="0.1" placeholder="Stan" required><input class="input" name="unit" value="g" placeholder="Jednostka"><input class="input" name="minQty" type="number" min="0" step="0.1" placeholder="Minimum"></div><label class="inventory-ean-field">EAN / kod<input class="input" name="ean" inputmode="numeric" autocomplete="off" placeholder="opcjonalnie"></label><label class="inventory-price-field">Cena zakupu za ten stan (zł)<input class="input" name="purchasePrice" type="number" min="0" step="0.01" placeholder="np. 25.00"></label><button class="button button-primary button-block" type="submit">＋ Dodaj do magazynu</button></form>'+
    (lowCount?'<div class="inventory-alert"><b>⚠ Niskie stany: '+lowCount+'</b><span>Produkty poniżej ustawionego minimum.</span></div>':'')+
    '<div class="module-list inventory-list">'+(state.inventory.length?state.inventory.map(x=>{const low=state.settings.lowStockAlerts&&Number(x.minQty)>0&&Number(x.qty)<=Number(x.minQty);return '<article class="inventory-row '+(low?'is-low':'')+'"><div class="inventory-row-head"><div><b>'+escapeHtml(x.name)+'</b><small>'+x.qty+' '+escapeHtml(x.unit)+' · minimum '+(Number(x.minQty)||0)+' '+escapeHtml(x.unit)+(Number(x.purchasePrice)>0?' · '+formatMoney(x.purchasePrice):'')+'</small></div>'+(low?'<span class="inventory-badge">NISKI STAN</span>':'')+'</div><div class="inventory-row-controls"><button type="button" class="inventory-step" data-inventory-step="-1" data-inventory-id="'+x.id+'" aria-label="Zmniejsz '+escapeHtml(x.name)+'">−</button><input class="input inventory-current" data-inventory-qty="'+x.id+'" type="number" min="0" step="0.1" value="'+x.qty+'" aria-label="Stan '+escapeHtml(x.name)+'"><button type="button" class="inventory-step" data-inventory-step="1" data-inventory-id="'+x.id+'" aria-label="Zwiększ '+escapeHtml(x.name)+'">＋</button><input class="input inventory-min" data-inventory-min="'+x.id+'" type="number" min="0" step="0.1" value="'+(Number(x.minQty)||0)+'" aria-label="Minimum '+escapeHtml(x.name)+'"><button type="button" class="row-remove" data-inventory-remove="'+x.id+'" aria-label="Usuń '+escapeHtml(x.name)+'">×</button></div></article>'}).join(''):'<div class="empty-state"><h2>Magazyn jest pusty</h2><p>Dodaj pierwszy produkt i ustaw mu minimum.</p></div>')+'</div></section>';
}
function calculatorsScreen(){return '<section class="screen module-screen calculators-screen"><span class="section-kicker">NARZĘDZIA</span><h1 class="screen-title">Kalkulatory</h1><p class="screen-lead">Praktyczne przeliczenia do codziennej pracy.</p><div class="calculator-grid"><div class="calculator-card"><div class="calculator-card-head"><div><small>MAM MĄKĘ</small><h2>Kalkulator ciasta</h2></div><span class="calculator-badge">PRO</span></div><p class="calculator-copy">Podaj ilość mąki. Reszta policzy się z procentów piekarskich.</p><div class="calculator-form"><label>Mąka (g)<input class="input" id="dough-flour" type="number" min="1" step="1" value="7500"></label><label>Hydracja (%)<input class="input" id="dough-hydration" type="number" min="0" max="100" step="0.1" value="65"></label><label>Sól (%)<input class="input" id="dough-salt" type="number" min="0" max="10" step="0.1" value="2.8"></label><label>Drożdże świeże (%)<input class="input" id="dough-yeast" type="number" min="0" max="5" step="0.01" value="0.1"></label><label>Oliwa (%)<input class="input" id="dough-oil" type="number" min="0" max="20" step="0.1" value="0"></label></div><div class="calculator-result"><div><span>Mąka</span><b id="dough-out-flour">0 g</b></div><div><span>Woda</span><b id="dough-out-water">0 g</b></div><div><span>Sól</span><b id="dough-out-salt">0 g</b></div><div><span>Drożdże</span><b id="dough-out-yeast">0 g</b></div><div><span>Oliwa</span><b id="dough-out-oil">0 g</b></div><div class="calculator-total"><span>Gotowe ciasto</span><b id="dough-out-total">0 g</b></div></div></div><button class="module-card module-card-button" type="button" data-route="recipes"><div><small>SKALOWANIE</small><p>Przelicz dowolną recepturę na liczbę porcji.</p></div><span>→</span></button></div></section>'}
function settingsScreen(state){return '<section class="screen module-screen"><span class="section-kicker">USTAWIENIA</span><h1 class="screen-title">Więcej</h1><p class="screen-lead">Wygląd i zachowanie Kucharzyny.</p><div class="settings-card"><div><b>Tryb aplikacji</b><small>'+(state.settings.mode==="amator"?"AMATOR · prosty interfejs dla domu":"PRO · pełne narzędzia kuchni profesjonalnej")+'</small></div><div class="mode-switch"><button class="button button-secondary '+(state.settings.mode==="pro"?"active":"")+'" type="button" data-mode="pro">PRO</button><button class="button button-secondary '+(state.settings.mode==="amator"?"active":"")+'" type="button" data-mode="amator">AMATOR</button></div></div><div class="settings-card"><div><b>Tryb ciemny</b><small>Interfejs dopasowany do pracy w kuchni.</small></div><button class="toggle '+(state.settings.theme==="dark"?'active':'')+'" type="button" id="theme-toggle" aria-label="Przełącz motyw"><span></span></button></div><div class="settings-card"><div><b>Alerty magazynu</b><small>Przygotowane pod kontrolę niskich stanów.</small></div><button class="toggle '+(state.settings.lowStockAlerts?'active':'')+'" type="button" id="stock-alert-toggle" aria-label="Przełącz alerty magazynu"><span></span></button></div></section>'}
function screenContent(route,state){
  if(route==="start")return startScreen(state);
  if(route==="recipes")return state.editorMode?recipeEditor(state):recipeScreen(state);
  if(route==="favorites")return recipeScreen(state,true);
  if(route==="cooking")return cookingScreen(state);
  if(route==="shopping")return shoppingScreen(state);
  if(route==="inventory")return state.settings.mode==="amator"?refrigeratorScreen(state):inventoryScreen(state);
  if(route==="calculators")return state.settings.mode==="pro"?calculatorsScreen():startScreen(state);
  if(route==="settings")return settingsScreen(state);
  return startScreen(state);
}

function render(state){
  const route=state.route;
  const nav=NAV.map(([id,iconName,label])=>
    '<button class="nav-item '+(route===id?"active":"")+'" data-route="'+id+'" type="button">'+
      '<span class="nav-icon">'+icon(iconName)+'</span><span class="nav-label">'+label+"</span>"+
    "</button>").join("");
  app.innerHTML=
    '<header class="app-topbar"><button class="brand-button" type="button" data-route="start" aria-label="Start"><span class="brand-mark">'+icon("chef")+'</span><span class="brand-title">Kucharzyna</span></button><span class="topbar-spacer"></span></header>'+
    '<main class="app-scroll" id="main-scroll">'+screenContent(route,state)+'</main>'+
    '<nav class="app-bottom-nav" aria-label="Główna nawigacja">'+nav+"</nav>";
  app.querySelectorAll("[data-route]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.route)));
  const shoppingForm=app.querySelector("#shopping-form");
  if(shoppingForm)shoppingForm.addEventListener("submit",async e=>{e.preventDefault();const input=shoppingForm.elements.namedItem("item");const name=input?.value.trim()||"";if(name){await saveShopping({name,purchased:false});input.value="";}});
  const addMissing=app.querySelector("[data-add-missing]"); if(addMissing)addMissing.addEventListener("click",async()=>{const s=getState();const recipe=s.recipes.find(r=>r.id===s.cookingRecipe);if(!recipe)return;const added=await addMissingToShopping(recipe.id,s.recipeTargetServings||recipe.servings);addMissing.textContent=added.length?"✓ Dodano do zakupów":"✓ Braki już są na liście";addMissing.disabled=true;});
  app.querySelectorAll("[data-shopping-toggle]").forEach(x=>x.addEventListener("change",()=>{const item=getState().shopping.find(i=>i.id===x.dataset.shoppingToggle);if(item)saveShopping({...item,purchased:x.checked})}));
  app.querySelectorAll("[data-shopping-remove]").forEach(x=>x.addEventListener("click",()=>removeShopping(x.dataset.shoppingRemove)));
  let scannerStream=null,scannerTimer=null;
  const scannerPanel=app.querySelector("#scanner-panel");
  const stopScanner=()=>{if(scannerTimer)clearTimeout(scannerTimer);scannerTimer=null;if(scannerStream){scannerStream.getTracks().forEach(track=>track.stop());scannerStream=null}const video=app.querySelector("#barcode-video");if(video)video.srcObject=null};
  const showScannerResult=(ean)=>{
    const clean=String(ean||"").replace(/\D/g,"").slice(0,14);
    const input=app.querySelector("#barcode-ean");if(input)input.value=clean;
    const result=app.querySelector("#scanner-result");
    if(result){result.hidden=!clean;result.innerHTML=clean?'<b>Kod odczytany</b><span>'+escapeHtml(clean)+'</span><small>Uzupełnij nazwę produktu poniżej i zapisz go do magazynu.</small>':'';}
    const status=app.querySelector("#scanner-status");if(status)status.textContent=clean?"✓ EAN odczytany":"Wpisz kod ręcznie";
  };
  const startScanner=async()=>{
    if(!scannerPanel)return;
    scannerPanel.hidden=false;
    const status=app.querySelector("#scanner-status");
    if(!("BarcodeDetector"in window)){if(status)status.textContent="Skanowanie aparatem niedostępne. Użyj EAN ręcznie.";return}
    if(!navigator.mediaDevices?.getUserMedia){if(status)status.textContent="Kamera niedostępna. Użyj EAN ręcznie.";return}
    try{
      const video=app.querySelector("#barcode-video");
      scannerStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});
      video.srcObject=scannerStream;await video.play();
      const detector=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e"]});
      const scan=async()=>{
        if(!scannerPanel.isConnected||scannerPanel.hidden)return;
        try{const codes=await detector.detect(video);if(codes.length){showScannerResult(codes[0].rawValue);stopScanner();return}}catch(_){}
        scannerTimer=setTimeout(scan,180);
      };
      if(status)status.textContent="Skieruj aparat na kod kreskowy";
      scan();
    }catch(error){if(status)status.textContent="Nie udało się uruchomić kamery. Użyj EAN ręcznie.";console.warn("Kucharzyna: scanner camera failed.",error)}
  };
  const scannerLaunch=app.querySelector("[data-open-scanner]");if(scannerLaunch)scannerLaunch.addEventListener("click",startScanner);
  const scannerClose=app.querySelector("[data-close-scanner]");if(scannerClose)scannerClose.addEventListener("click",()=>{stopScanner();scannerPanel.hidden=true});
  const applyEan=app.querySelector("[data-apply-ean]");if(applyEan)applyEan.addEventListener("click",()=>showScannerResult(app.querySelector("#barcode-ean")?.value));
  app.querySelector("#barcode-ean")?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();showScannerResult(e.currentTarget.value)}});

  const inventoryForm=app.querySelector("#inventory-form");
  if(inventoryForm)inventoryForm.addEventListener("submit",async e=>{e.preventDefault();const name=inventoryForm.elements.name.value.trim();if(name){await saveInventory({name,qty:Number(inventoryForm.elements.qty.value)||0,unit:inventoryForm.elements.unit.value.trim()||"g",minQty:Number(inventoryForm.elements.minQty.value)||0,purchasePrice:Number(inventoryForm.elements.purchasePrice.value)||0,ean:String(inventoryForm.elements.ean?.value||"").replace(/\D/g,"").slice(0,14)});}});
  app.querySelectorAll("[data-inventory-remove]").forEach(x=>x.addEventListener("click",()=>removeInventory(x.dataset.inventoryRemove)));
  app.querySelectorAll("[data-inventory-step]").forEach(x=>x.addEventListener("click",()=>{const item=getState().inventory.find(i=>i.id===x.dataset.inventoryId);if(item)saveInventory({...item,qty:Number(item.qty||0)+Number(x.dataset.inventoryStep)})}));
  app.querySelectorAll("[data-inventory-qty]").forEach(x=>x.addEventListener("change",()=>{const item=getState().inventory.find(i=>i.id===x.dataset.inventoryQty);if(item)saveInventory({...item,qty:Number(x.value)||0})}));
  app.querySelectorAll("[data-inventory-min]").forEach(x=>x.addEventListener("change",()=>{const item=getState().inventory.find(i=>i.id===x.dataset.inventoryMin);if(item)saveInventory({...item,minQty:Number(x.value)||0})}));
  const themeToggle=app.querySelector("#theme-toggle");
  if(themeToggle)themeToggle.addEventListener("click",()=>saveSettings({theme:getState().settings.theme==="dark"?"light":"dark"}));
  app.querySelectorAll("[data-mode]").forEach(button=>button.addEventListener("click",()=>setMode(button.dataset.mode)));
  const stockToggle=app.querySelector("#stock-alert-toggle");
  if(stockToggle)stockToggle.addEventListener("click",()=>saveSettings({lowStockAlerts:!getState().settings.lowStockAlerts}));
  const inventoryStockToggle=app.querySelector("#inventory-alert-toggle");
  if(inventoryStockToggle)inventoryStockToggle.addEventListener("click",()=>saveSettings({lowStockAlerts:!getState().settings.lowStockAlerts}));
  const addButton=app.querySelector(".recipe-add");
  if(addButton)addButton.addEventListener("click",()=>{getState().editorMode=true;selectRecipe(null)});
  const editorBack=app.querySelector("[data-editor-back]");
  if(editorBack)editorBack.addEventListener("click",()=>{getState().editorMode=false;selectRecipe(null)});
  const ingredientEditor=app.querySelector("#ingredient-editor");
  if(ingredientEditor){
    app.querySelector("#add-ingredient").addEventListener("click",()=>{ingredientEditor.insertAdjacentHTML("beforeend",ingredientRow({name:"",qty:"",unit:"g"}));bindEditorRemovers()});
    app.querySelector("#add-step").addEventListener("click",()=>{app.querySelector("#step-editor").insertAdjacentHTML("beforeend",'<div class="editor-row step-row"><span class="row-number">+</span><textarea name="step" rows="2" placeholder="Opisz kolejny krok..."></textarea><button type="button" class="row-remove" aria-label="Usuń krok">×</button></div>');bindEditorRemovers()});
    bindEditorRemovers();
    const form=app.querySelector("#recipe-form");
    form.addEventListener("submit",async e=>{
      e.preventDefault();
      const fd=new FormData(form);
      const ingredients=[...form.querySelectorAll(".ingredient-row")].map(row=>({name:row.querySelector("[name=ingredientName]").value.trim(),qty:row.querySelector("[name=ingredientQty]").value.trim(),unit:row.querySelector("[name=ingredientUnit]").value.trim()||"g"})).filter(x=>x.name);
      const steps=[...form.querySelectorAll("[name=step]")].map(x=>x.value.trim()).filter(Boolean);
      const recipe={id:getState().selectedRecipe||null,name:String(fd.get("name")||"").trim(),category:String(fd.get("category")||"Inne"),region:String(fd.get("region")||"").trim(),time:String(fd.get("time")||"").trim(),servings:Number(fd.get("servings")||1),favorite:false,sellPrice:Number(fd.get("sellPrice")||0),ingredients,steps,notes:String(fd.get("notes")||"").trim()};
      const old=getState().recipes.find(x=>x.id===recipe.id); if(old)recipe.favorite=old.favorite;
      await saveRecipe(recipe);
    });
  }
  app.querySelectorAll("[data-recipe]").forEach(b=>b.addEventListener("click",()=>selectRecipe(b.dataset.recipe)));
  app.querySelectorAll("[data-favorite]").forEach(b=>b.addEventListener("click",async()=>{try{await toggleFavorite(b.dataset.favorite)}catch(error){console.error("Kucharzyna: nie udało się zapisać ulubionej receptury.",error)}}));
  app.querySelectorAll("[data-start-cooking]").forEach(b=>b.addEventListener("click",()=>startCooking(b.dataset.startCooking)));
  app.querySelectorAll("[data-cook-step]").forEach(b=>b.addEventListener("click",()=>{const delta=Number(b.dataset.cookStep);const s=getState();const recipe=s.recipes.find(r=>r.id===s.cookingRecipe);if(!recipe)return;if(delta>0&&s.cookingStep>=recipe.steps.length-1){const status=getRecipeStockStatus(recipe.id,s.recipeTargetServings||recipe.servings);const message=status.missing.length?"Nie wszystkie składniki są dostępne w magazynie. Odjąć tylko te, które wystarczą?":"Rozliczyć składniki i odjąć je z magazynu?";if(confirm(message)){consumeRecipeIngredients(recipe.id,s.recipeTargetServings||recipe.servings)}finishCooking();navigate("recipes")}else setCookingStep(s.cookingStep+delta)}));
  app.querySelectorAll("[data-edit-recipe]").forEach(b=>b.addEventListener("click",()=>{getState().editorMode=true;render(getState())}));
  const back=app.querySelector("[data-recipe-back]"); if(back)back.addEventListener("click",()=>selectRecipe(null));
  const scaleInput=app.querySelector("#recipe-servings");
  if(scaleInput){
    const applyScale=value=>{const next=Math.max(1,Math.round(Number(value)||1));setRecipeTargetServings(next)};
    scaleInput.addEventListener("change",()=>applyScale(scaleInput.value));
    scaleInput.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();applyScale(scaleInput.value);scaleInput.blur()}});
    app.querySelectorAll("[data-scale-step]").forEach(button=>button.addEventListener("click",()=>applyScale(Number(scaleInput.value||1)+Number(button.dataset.scaleStep))));
  }
  const recipeInput=app.querySelector("#recipe-search");
  if(recipeInput){
    const clear=app.querySelector("#recipe-search-clear");
    let category="Wszystkie";
    const apply=()=>{
      const q=recipeInput.value.trim().toLocaleLowerCase("pl-PL");
      const filtered=getState().recipes.filter(r=>(category==="Wszystkie"||r.category===category)&&(!q||(r.name+" "+r.region+" "+r.category+" "+r.ingredients.map(i=>i.name).join(" ")).toLocaleLowerCase("pl-PL").includes(q)));
      app.querySelector("#recipe-results").innerHTML=recipeCards(filtered);
      app.querySelectorAll("[data-recipe]").forEach(b=>b.addEventListener("click",()=>selectRecipe(b.dataset.recipe)));
      clear.hidden=!recipeInput.value;
    };
    recipeInput.addEventListener("input",apply);
    clear.addEventListener("click",()=>{recipeInput.value="";apply();recipeInput.focus()});
    app.querySelectorAll("[data-category]").forEach(chip=>chip.addEventListener("click",()=>{category=chip.dataset.category;app.querySelectorAll("[data-category]").forEach(x=>x.classList.toggle("active",x===chip));apply()}));
  }
  const doughForm=app.querySelector(".calculators-screen");
  if(doughForm){
    const ids=["flour","hydration","salt","yeast","oil"];
    const value=id=>Number(doughForm.querySelector("#dough-"+id).value)||0;
    const format=n=>{const v=Math.round(n*100)/100;return Number.isInteger(v)?String(v):String(v)};
    const calculate=()=>{
      const flour=value("flour"), hydration=value("hydration"), salt=value("salt"), yeast=value("yeast"), oil=value("oil");
      const water=flour*hydration/100, saltG=flour*salt/100, yeastG=flour*yeast/100, oilG=flour*oil/100;
      doughForm.querySelector("#dough-out-flour").textContent=format(flour)+" g";
      doughForm.querySelector("#dough-out-water").textContent=format(water)+" g";
      doughForm.querySelector("#dough-out-salt").textContent=format(saltG)+" g";
      doughForm.querySelector("#dough-out-yeast").textContent=format(yeastG)+" g";
      doughForm.querySelector("#dough-out-oil").textContent=format(oilG)+" g";
      doughForm.querySelector("#dough-out-total").textContent=format(flour+water+saltG+yeastG+oilG)+" g";
    };
    ids.forEach(id=>doughForm.querySelector("#dough-"+id).addEventListener("input",calculate));
    calculate();
  }
  const input=app.querySelector("#home-search-input");
  const clear=app.querySelector(".home-search-clear");
  if(input){
    input.addEventListener("input",()=>{clear.hidden=!input.value});
    input.addEventListener("keydown",e=>{if(e.key==="Enter"&&input.value.trim()){navigate("recipes")}});
    clear.addEventListener("click",()=>{input.value="";clear.hidden=true;input.focus()});
  }
}

function bindEditorRemovers(){app.querySelectorAll(".row-remove").forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound="1";btn.addEventListener("click",()=>btn.closest(".editor-row")?.remove())})}

async function boot(){
  try{
    await hydrate();
  }catch(error){
    console.warn("Kucharzyna: IndexedDB hydrate failed, continuing with empty state.",error);
  }
  subscribe(render);
  initRouter(()=>render(getState()));
  render(getState());
  if("serviceWorker"in navigator)navigator.serviceWorker.register("./service-worker.js?v=20261001-9").catch(()=>{});
}
boot().catch(error=>{console.error(error);app.innerHTML='<main class="app-scroll"><section class="screen"><div class="empty-state"><h2>Nie udało się uruchomić Kucharzyny</h2><p>Odśwież aplikację.</p></div></section></main>'});
