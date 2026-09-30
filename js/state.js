import{getAll,put}from"./db.js";
const listeners=new Set();const state={route:"start",recipes:[],shopping:[],inventory:[],settings:{theme:"dark",lowStockAlerts:true}};
export function getState(){return state}export function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)}
export function setRoute(route){state.route=route;notify()}export function update(partial){Object.assign(state,partial);notify()}
export async function hydrate(){const[recipes,shopping,inventory,settings]=await Promise.all([getAll("recipes"),getAll("shopping"),getAll("inventory"),getAll("settings")]);state.recipes=recipes;state.shopping=shopping;state.inventory=inventory;const saved=settings.find(x=>x.id==="app");if(saved)state.settings={...state.settings,...saved.value};document.documentElement.dataset.theme=state.settings.theme;notify()}
export async function saveSettings(value){state.settings={...state.settings,...value};document.documentElement.dataset.theme=state.settings.theme;await put("settings",{id:"app",value:state.settings});notify()}
function notify(){for(const fn of listeners)fn(state)}