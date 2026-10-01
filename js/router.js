import{setRoute}from"./state.js";const VALID=new Set(["start","recipes","favorites","cooking","shopping","inventory","calculators","settings"]);
export function currentRoute(){const value=location.hash.replace(/^#\/?/,"")||"start";return VALID.has(value)?value:"start"}
export function navigate(route){const next=VALID.has(route)?route:"start";if(currentRoute()===next){setRoute(next);return}location.hash=next}
export function initRouter(onRoute){const handle=()=>{const route=currentRoute();setRoute(route);onRoute(route)};addEventListener("hashchange",handle);handle()}