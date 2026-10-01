import{getAll,put}from"./db.js";
const listeners=new Set();const state={route:"start",recipes:[],shopping:[],inventory:[],settings:{theme:"dark",lowStockAlerts:true,mode:"pro"},selectedRecipe:null,editorMode:false,recipeTargetServings:null,cookingRecipe:null,cookingStep:0};
const DEFAULT_RECIPES=[
{id:"carbonara",name:"Spaghetti alla Carbonara",category:"Pasta",region:"Lazio, Włochy",time:"25 min",servings:1,favorite:false,ingredients:[{name:"świeży makaron",qty:150,unit:"g"},{name:"guanciale",qty:50,unit:"g"},{name:"żółtko",qty:2,unit:"szt."},{name:"Pecorino Romano",qty:35,unit:"g"},{name:"pieprz czarny",qty:2,unit:"g"}],steps:["Podsmaż guanciale na średnim ogniu.","Utrzyj Pecorino z żółtkami i pieprzem.","Ugotuj makaron al dente i zachowaj wodę z gotowania.","Połącz makaron z guanciale, zdejmij z ognia i dodaj masę serową. Reguluj wodą z makaronu."]},
{id:"pizza-napoletana",name:"Pizza Napoletana",category:"Pizza",region:"Campania, Włochy",time:"24 h",servings:4,favorite:false,ingredients:[{name:"mąka 00",qty:650,unit:"g"},{name:"woda",qty:422,unit:"g"},{name:"sól",qty:19,unit:"g"},{name:"drożdże świeże",qty:1,unit:"g"},{name:"pomodoro",qty:120,unit:"g"}],steps:["Wymieszaj mąkę z większością wody.","Dodaj sól, resztę wody i drożdże.","Wyrób do uzyskania gładkiego ciasta.","Fermentuj, podziel na kule i wypiekaj w bardzo wysokiej temperaturze."]},
{id:"tiramisu",name:"Tiramisù Classico",category:"Desery",region:"Włochy",time:"35 min",servings:6,favorite:false,ingredients:[{name:"mascarpone",qty:500,unit:"g"},{name:"jajka",qty:4,unit:"szt."},{name:"cukier",qty:100,unit:"g"},{name:"savoiardi",qty:250,unit:"g"},{name:"espresso",qty:250,unit:"ml"}],steps:["Ubij żółtka z cukrem.","Połącz z mascarpone.","Ubij białka i delikatnie wmieszaj.","Nasączaj savoiardi espresso i układaj warstwami z kremem. Schłodź."]}
];

export function getState(){return state}export function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)}
export function selectRecipe(id){state.selectedRecipe=id;const recipe=state.recipes.find(x=>x.id===id);state.recipeTargetServings=recipe?Number(recipe.servings)||1:null;notify()}
export function setRecipeTargetServings(value){state.recipeTargetServings=Math.max(1,Math.round(Number(value)||1));notify()}
export function startCooking(id){const recipe=state.recipes.find(x=>x.id===id);if(!recipe)return;state.cookingRecipe=id;state.cookingStep=0;state.route="cooking";state.selectedRecipe=id;notify()}
export function setCookingStep(value){const recipe=state.recipes.find(x=>x.id===state.cookingRecipe);const max=Math.max(0,(recipe?.steps?.length||1)-1);state.cookingStep=Math.min(max,Math.max(0,Math.round(Number(value)||0)));notify()}
export function getRecipeCost(recipeId,targetServings){
  const recipe=state.recipes.find(x=>x.id===recipeId); if(!recipe)return {items:[],cost:0,priced:[],unpriced:[]};
  const factor=Math.max(1,Number(targetServings)||Number(recipe.servings)||1)/(Number(recipe.servings)||1);
  const normalize=value=>String(value||"").trim().toLocaleLowerCase("pl-PL").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const items=(recipe.ingredients||[]).map(i=>{
    const required=Number(i.qty)*factor;
    const stock=state.inventory.find(x=>normalize(x.name)===normalize(i.name)&&normalize(x.unit)===normalize(i.unit));
    const unitPrice=stock&&Number(stock.qty)>0?Number(stock.purchasePrice||0)/Number(stock.qty):0;
    const cost=Number.isFinite(required)&&unitPrice>0?required*unitPrice:0;
    return {name:i.name,unit:i.unit,required:Number.isFinite(required)?required:0,inventoryId:stock?.id||null,unitPrice,cost,priced:Boolean(stock&&Number(stock.qty)>0&&Number(stock.purchasePrice)>0)};
  });
  const priced=items.filter(x=>x.priced),unpriced=items.filter(x=>!x.priced);
  return {items,cost:priced.reduce((sum,x)=>sum+x.cost,0),priced,unpriced};
}
export function getRecipeFoodCost(recipeId,targetServings){
  const recipe=state.recipes.find(x=>x.id===recipeId); const cost=getRecipeCost(recipeId,targetServings);
  const servings=Math.max(1,Number(targetServings)||Number(recipe?.servings)||1); const costPerServing=cost.cost/servings; const sellPrice=Number(recipe?.sellPrice)||0;
  return {...cost,servings,costPerServing,sellPrice,percent:sellPrice>0?(costPerServing/sellPrice)*100:null};
}
export function getRecipeStockStatus(recipeId,targetServings){
  const recipe=state.recipes.find(x=>x.id===recipeId);
  if(!recipe)return {items:[],matched:[],missing:[]};
  const factor=Math.max(1,Number(targetServings)||Number(recipe.servings)||1)/(Number(recipe.servings)||1);
  const normalize=value=>String(value||"").trim().toLocaleLowerCase("pl-PL").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const items=(recipe.ingredients||[]).map(i=>{
    const required=Number(i.qty)*factor;
    const stock=state.inventory.find(x=>normalize(x.name)===normalize(i.name)&&normalize(x.unit)===normalize(i.unit));
    return {name:i.name,unit:i.unit,required:Number.isFinite(required)?required:0,available:stock?Number(stock.qty)||0:0,inventoryId:stock?.id||null};
  });
  return {items,matched:items.filter(x=>x.inventoryId&&x.available>=x.required),missing:items.filter(x=>!x.inventoryId||x.available<x.required)};
}
export async function addMissingToShopping(recipeId,targetServings){
  const status=getRecipeStockStatus(recipeId,targetServings);
  const added=[];
  for(const item of status.missing){
    const missingQty=Math.max(0,item.required-item.available);
    if(!missingQty)continue;
    const name=item.unit?item.name+" · "+missingQty+" "+item.unit:item.name;
    const existing=state.shopping.find(x=>String(x.name||"").toLocaleLowerCase("pl-PL")===name.toLocaleLowerCase("pl-PL")&&!x.purchased);
    if(existing)continue;
    const value=await saveShopping({name,purchased:false,sourceRecipeId:recipeId});
    added.push(value);
  }
  return added;
}
export async function consumeRecipeIngredients(recipeId,targetServings){
  const status=getRecipeStockStatus(recipeId,targetServings);
  const consumed=[];
  const missing=[];
  for(const item of status.items){
    if(!item.inventoryId){missing.push({...item,reason:"brak w magazynie"});continue}
    if(item.available<item.required){missing.push({...item,reason:"za mało w magazynie"});continue}
    const stock=state.inventory.find(x=>x.id===item.inventoryId);
    if(!stock)continue;
    const next=Math.max(0,Number(stock.qty||0)-item.required);
    await put("inventory",{...stock,qty:next});
    stock.qty=next;
    consumed.push({...item,remaining:next});
  }
  notify();
  return {consumed,missing};
}
export function finishCooking(){state.cookingRecipe=null;state.cookingStep=0;notify()}
export async function saveRecipe(recipe){const value={...recipe,id:recipe.id||("recipe-"+Date.now()),favorite:Boolean(recipe.favorite),servings:Math.max(1,Number(recipe.servings)||1),sellPrice:Math.max(0,Number(recipe.sellPrice)||0),ingredients:(recipe.ingredients||[]).map(i=>{const n=Number(i.qty);return{...i,qty:Number.isFinite(n)?n:i.qty}})};const index=state.recipes.findIndex(x=>x.id===value.id);if(index>=0)state.recipes[index]=value;else state.recipes.push(value);state.selectedRecipe=value.id;state.editorMode=false;state.route="recipes";notify();return put("recipes",value).then(()=>value).catch(error=>{console.warn("Kucharzyna: recipe persistence failed.",error);return value})}
export async function saveShopping(item){const value={...item,id:item.id||("shopping-"+Date.now()+"-"+Math.random().toString(36).slice(2,7))};const index=state.shopping.findIndex(x=>x.id===value.id);if(index>=0)state.shopping[index]=value;else state.shopping.push(value);notify();return put("shopping",value).then(()=>value).catch(error=>{console.warn("Kucharzyna: shopping persistence failed.",error);return value})}
export async function removeShopping(id){await import("./db.js").then(db=>db.remove("shopping",id));state.shopping=state.shopping.filter(x=>x.id!==id);notify()}
export async function saveInventory(item){const value={...item,id:item.id||("inventory-"+Date.now()+"-"+Math.random().toString(36).slice(2,7)),qty:Math.max(0,Number(item.qty)||0),minQty:Math.max(0,Number(item.minQty)||0),purchasePrice:Math.max(0,Number(item.purchasePrice)||0),unit:String(item.unit||"g").trim()||"g",name:String(item.name||"").trim(),ean:String(item.ean||"").replace(/\D/g,"").slice(0,14)};const index=state.inventory.findIndex(x=>x.id===value.id);if(index>=0)state.inventory[index]=value;else state.inventory.push(value);notify();return put("inventory",value).then(()=>value).catch(error=>{console.warn("Kucharzyna: inventory persistence failed.",error);return value})}
export async function removeInventory(id){await import("./db.js").then(db=>db.remove("inventory",id));state.inventory=state.inventory.filter(x=>x.id!==id);notify()}
export async function toggleFavorite(id){const recipe=state.recipes.find(x=>x.id===id);if(!recipe)return;recipe.favorite=!recipe.favorite;notify();return put("recipes",recipe).catch(error=>console.warn("Kucharzyna: favorite persistence failed.",error))}
export async function setMode(mode){state.settings.mode=mode==="amator"?"amator":"pro";notify();return put("settings",{id:"app",value:state.settings}).catch(error=>console.warn("Kucharzyna: mode persistence failed.",error))}
export function isProMode(){return state.settings.mode!=="amator"}
export function setRoute(route){state.route=route;if(route!=="recipes"){state.editorMode=false;state.recipeTargetServings=null}if(route!=="cooking"){state.cookingRecipe=null;state.cookingStep=0}notify()}export function update(partial){Object.assign(state,partial);notify()}
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
export async function saveSettings(value){state.settings={...state.settings,...value};document.documentElement.dataset.theme=state.settings.theme;notify();return put("settings",{id:"app",value:state.settings}).catch(error=>console.warn("Kucharzyna: settings persistence failed.",error))}
function notify(){for(const fn of listeners)fn(state)}