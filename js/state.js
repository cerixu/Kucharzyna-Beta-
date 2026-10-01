import{getAll,put}from"./db.js";
const listeners=new Set();const state={route:"start",recipes:[],shopping:[],inventory:[],settings:{theme:"dark",lowStockAlerts:true},selectedRecipe:null,editorMode:false};
const DEFAULT_RECIPES=[
{id:"carbonara",name:"Spaghetti alla Carbonara",category:"Pasta",region:"Lazio, Włochy",time:"25 min",servings:1,favorite:false,ingredients:[{name:"świeży makaron",qty:150,unit:"g"},{name:"guanciale",qty:50,unit:"g"},{name:"żółtko",qty:2,unit:"szt."},{name:"Pecorino Romano",qty:35,unit:"g"},{name:"pieprz czarny",qty:2,unit:"g"}],steps:["Podsmaż guanciale na średnim ogniu.","Utrzyj Pecorino z żółtkami i pieprzem.","Ugotuj makaron al dente i zachowaj wodę z gotowania.","Połącz makaron z guanciale, zdejmij z ognia i dodaj masę serową. Reguluj wodą z makaronu."]},
{id:"pizza-napoletana",name:"Pizza Napoletana",category:"Pizza",region:"Campania, Włochy",time:"24 h",servings:4,favorite:false,ingredients:[{name:"mąka 00",qty:650,unit:"g"},{name:"woda",qty:422,unit:"g"},{name:"sól",qty:19,unit:"g"},{name:"drożdże świeże",qty:1,unit:"g"},{name:"pomodoro",qty:120,unit:"g"}],steps:["Wymieszaj mąkę z większością wody.","Dodaj sól, resztę wody i drożdże.","Wyrób do uzyskania gładkiego ciasta.","Fermentuj, podziel na kule i wypiekaj w bardzo wysokiej temperaturze."]},
{id:"tiramisu",name:"Tiramisù Classico",category:"Desery",region:"Włochy",time:"35 min",servings:6,favorite:false,ingredients:[{name:"mascarpone",qty:500,unit:"g"},{name:"jajka",qty:4,unit:"szt."},{name:"cukier",qty:100,unit:"g"},{name:"savoiardi",qty:250,unit:"g"},{name:"espresso",qty:250,unit:"ml"}],steps:["Ubij żółtka z cukrem.","Połącz z mascarpone.","Ubij białka i delikatnie wmieszaj.","Nasączaj savoiardi espresso i układaj warstwami z kremem. Schłodź."]}
];

export function getState(){return state}export function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)}
export function selectRecipe(id){state.selectedRecipe=id;notify()}
export async function saveRecipe(recipe){const value={...recipe,id:recipe.id||("recipe-"+Date.now()),favorite:Boolean(recipe.favorite)};await put("recipes",value);const index=state.recipes.findIndex(x=>x.id===value.id);if(index>=0)state.recipes[index]=value;else state.recipes.push(value);state.selectedRecipe=value.id;notify();return value}
export async function toggleFavorite(id){const recipe=state.recipes.find(x=>x.id===id);if(!recipe)return;recipe.favorite=!recipe.favorite;await put("recipes",recipe);notify()}
export function setRoute(route){state.route=route;if(route!=="recipes"){state.selectedRecipe=null;state.editorMode=false}notify()}export function update(partial){Object.assign(state,partial);notify()}
export async function hydrate(){
  const results=await Promise.allSettled([getAll("recipes"),getAll("shopping"),getAll("inventory"),getAll("settings")]);
  state.recipes=results[0].status==="fulfilled"?results[0].value:[];
if(!state.recipes.length){
  state.recipes=DEFAULT_RECIPES;
  await Promise.all(state.recipes.map(recipe=>put("recipes",recipe).catch(()=>null)));
}
  state.shopping=results[1].status==="fulfilled"?results[1].value:[];
  state.inventory=results[2].status==="fulfilled"?results[2].value:[];
  const settings=results[3].status==="fulfilled"?results[3].value:[];
  const saved=settings.find(x=>x.id==="app");
  if(saved)state.settings={...state.settings,...saved.value};
  document.documentElement.dataset.theme=state.settings.theme;
  notify();
}
export async function saveSettings(value){state.settings={...state.settings,...value};document.documentElement.dataset.theme=state.settings.theme;await put("settings",{id:"app",value:state.settings});notify()}
function notify(){for(const fn of listeners)fn(state)}