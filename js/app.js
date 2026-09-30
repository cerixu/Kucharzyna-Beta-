import{hydrate,subscribe,getState}from"./state.js";import{initRouter,navigate}from"./router.js";

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

function screenContent(route,state){
  if(route==="start")return startScreen(state);
  const titles={
    recipes:["Przepisy","Twoja baza przepisów, gotowa do pracy."],
    cooking:["Kuchnia","Prowadź aktualne danie bez zbędnego klikania."],
    shopping:["Zakupy","Lista produktów zebranych z Twojej kuchni."],
    inventory:["Magazyn","Stany produktów i kontrola końcówek."],
    calculators:["Kalkulatory","Narzędzia do codziennej pracy w kuchni."],
    settings:["Więcej","Wygląd, dane i preferencje Kucharzyny."]
  };
  const [title,lead]=titles[route]||titles.start;
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
  const input=app.querySelector("#home-search-input");
  const clear=app.querySelector(".home-search-clear");
  if(input){
    input.addEventListener("input",()=>{clear.hidden=!input.value});
    input.addEventListener("keydown",e=>{if(e.key==="Enter"&&input.value.trim()){navigate("recipes")}});
    clear.addEventListener("click",()=>{input.value="";clear.hidden=true;input.focus()});
  }
}

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
