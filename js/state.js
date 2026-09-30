import{getAll,put}from"./db.js";
const listeners=new Set();const state={route:"start",recipes:[],shopping:[],inventory:[],settings:{theme:"dark",lowStockAlerts:true}};
export function getState(){return state}export function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)}
export function setRoute(route){state.route=route;notify()}export function update(partial){Object.assign(state,partial);notify()}
export async function hydrate(){
  const results=await Promise.allSettled([getAll("recipes"),getAll("shopping"),getAll("inventory"),getAll("settings")]);
  state.recipes=results[0].status==="fulfilled"?results[0].value:[];
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