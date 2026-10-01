import{hydrate,subscribe,getState,selectRecipe,toggleFavorite,saveRecipe,setRecipeTargetServings}from"./state.js";import{initRouter,navigate}from"./router.js";

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
  arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>'
};

const QUICK=[
  ["recipes","plus","Nowa receptura","Stwórz własną recepturę"],
  ["cooking","flame","Gotowanie","Tryb pracy krok po kroku"],
  ["shopping","cart","Zakupy","Dodaj i połącz produkty"],
  ["inventory","box","Magazyn","Stany i końcówki"],
  ["cooking","prep","Prep / produkcja","Plan na kuchnię"],
  ["recipes","menu","Menu","Pozycje i kategorie"],
  ["calculators","calc","Kalkulator","Pizza, koszt, proporcje"],
  ["recipes","heart","Ulubione","Twoje zapisane receptury"],
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
    '<div class="home-action-grid">'+QUICK.map(([route,ic,title,copy])=>
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
      '<label>Czas<input class="input" name="time" value="'+escapeHtml(recipe.time||"")+'" placeholder="np. 25 min"></label></div></div>'+
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
function recipeScreen(state){
  const recipes=state.recipes;
  const selected=recipes.find(r=>r.id===state.selectedRecipe);
  if(selected){
    return '<section class="screen module-screen recipe-detail">'+
      '<button class="back-link" type="button" data-recipe-back>‹ Receptury</button>'+
      '<span class="section-kicker">'+selected.category+' · '+selected.region+'</span>'+
      '<h1 class="screen-title">'+selected.name+'</h1>'+
      '<div class="recipe-meta"><span>'+selected.time+'</span><span>'+selected.servings+' porcji</span><span>'+selected.ingredients.length+' składników</span></div>'+
      '<div class="scale-panel"><div><small>SKALOWANIE RECEPTURY</small><strong>Na ile porcji?</strong></div><div class="scale-controls"><button type="button" class="scale-step" data-scale-step="-1" aria-label="Zmniejsz liczbę porcji">−</button><input id="recipe-servings" class="scale-input" type="number" min="1" step="1" value="'+(state.recipeTargetServings||selected.servings)+'" aria-label="Docelowa liczba porcji"><button type="button" class="scale-step" data-scale-step="1" aria-label="Zwiększ liczbę porcji">＋</button></div><span class="scale-note">Bazowa receptura: '+selected.servings+' porcji</span></div><div class="recipe-detail-actions"><button class="button button-secondary" type="button" data-favorite="'+selected.id+'">'+(selected.favorite?'♥ Ulubione':'♡ Dodaj do ulubionych')+'</button><button class="button button-secondary" type="button" data-edit-recipe="'+selected.id+'">✎ Edytuj</button></div>'+
      '<div class="recipe-block"><div class="section-heading"><span><small>SKŁADNIKI</small><h2>Składniki</h2></span></div>'+
      '<ul class="ingredient-list">'+selected.ingredients.map(i=>'<li><span>'+i.name+'</span><b>'+formatScaledQuantity(i.qty,(state.recipeTargetServings||selected.servings)/Math.max(1,Number(selected.servings)))+' '+i.unit+'</b></li>').join('')+'</ul></div>'+
      '<div class="recipe-block"><div class="section-heading"><span><small>PRACA</small><h2>Przygotowanie</h2></span></div>'+
      '<ol class="steps-list">'+selected.steps.map(x=>'<li>'+x+'</li>').join('')+'</ol></div>'+
    '</section>';
  }
  const categories=["Wszystkie",...new Set(recipes.map(r=>r.category))];
  return '<section class="screen module-screen recipes-screen">'+
    '<div class="module-head"><div><span class="section-kicker">KUCHARZYNA</span><h1 class="screen-title">Receptury</h1><p class="screen-lead">Twoja baza receptur, gotowa do pracy.</p></div><button class="button button-primary recipe-add" type="button" aria-label="Dodaj recepturę">＋</button></div>'+
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
function screenContent(route,state){
  if(route==="start")return startScreen(state);
  if(route==="recipes")return state.editorMode?recipeEditor(state):recipeScreen(state);
  const titles={
    cooking:["Kuchnia","Prowadź aktualne danie bez zbędnego klikania."],
    shopping:["Zakupy","Lista produktów zebranych z Twojej kuchni."],
    inventory:["Magazyn","Stany produktów i kontrola końcówek."],
    calculators:["Kalkulatory","Narzędzia do codziennej pracy w kuchni."],
    settings:["Więcej","Wygląd, dane i preferencje Kucharzyny."]
  };
  const [title,lead]=titles[route]||titles.cooking;
  return '<section class="screen module-screen"><span class="section-kicker">KUCHARZYNA</span><h1 class="screen-title">'+title+'</h1><p class="screen-lead">'+lead+'</p><div class="empty-state"><h2>Moduł gotowy</h2><p>Kolejne funkcje dokładamy na czystej architekturze beta 0.1.</p></div></section>';
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
  const addButton=app.querySelector(".recipe-add");
  if(addButton)addButton.addEventListener("click",()=>{getState().editorMode=true;render(getState())});
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
      const recipe={id:getState().selectedRecipe||null,name:String(fd.get("name")||"").trim(),category:String(fd.get("category")||"Inne"),region:String(fd.get("region")||"").trim(),time:String(fd.get("time")||"").trim(),servings:Number(fd.get("servings")||1),favorite:false,ingredients,steps,notes:String(fd.get("notes")||"").trim()};
      const old=getState().recipes.find(x=>x.id===recipe.id); if(old)recipe.favorite=old.favorite;
      await saveRecipe(recipe);getState().editorMode=false;
    });
  }
  app.querySelectorAll("[data-recipe]").forEach(b=>b.addEventListener("click",()=>selectRecipe(b.dataset.recipe)));
  app.querySelectorAll("[data-favorite]").forEach(b=>b.addEventListener("click",()=>toggleFavorite(b.dataset.favorite)));\n  app.querySelectorAll("[data-edit-recipe]").forEach(b=>b.addEventListener("click",()=>{getState().editorMode=true;render(getState())}));
  const back=app.querySelector("[data-recipe-back]"); if(back)back.addEventListener("click",()=>selectRecipe(null));
  const scaleInput=app.querySelector("#recipe-servings");
  if(scaleInput){
    const applyScale=value=>{const next=Math.max(1,Math.round(Number(value)||1));setRecipeTargetServings(next)};
    scaleInput.addEventListener("change",()=>applyScale(scaleInput.value));
    scaleInput.addEventListener("input",()=>{if(scaleInput.value)applyScale(scaleInput.value)});
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
  // Render the shell immediately. IndexedDB must never block the first paint.
  render(getState());
  subscribe(render);
  initRouter(()=>render(getState()));
  try{
    await hydrate();
  }catch(error){
    console.warn("Kucharzyna: IndexedDB hydrate failed, continuing with empty state.",error);
  }
  if("serviceWorker"in navigator)navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
}
boot().catch(error=>{console.error(error);app.innerHTML='<main class="app-scroll"><section class="screen"><div class="empty-state"><h2>Nie udało się uruchomić Kucharzyny</h2><p>Odśwież aplikację.</p></div></section></main>'});
