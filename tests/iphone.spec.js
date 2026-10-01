const{test,expect}=require("@playwright/test");

test("Start fits the iPhone viewport",async({page})=>{
  await page.goto("/");
  await expect(page.getByText("Kucharzyna",{exact:true}).first()).toBeVisible();\n  await expect(page.getByText("v0.1.13",{exact:true})).toBeVisible();
  await expect(page.getByPlaceholder("Szukaj receptury, składnika...")).toBeVisible();
  await expect(page.locator(".home-action")).toHaveCount(7);
  await expect(page.locator(".category-card")).toHaveCount(4);
  await expect(page.locator(".app-bottom-nav")).toBeVisible();
  const m=await page.evaluate(()=>({w:innerWidth,h:innerHeight,scrollWidth:document.documentElement.scrollWidth,navBottom:document.querySelector(".app-bottom-nav").getBoundingClientRect().bottom}));
  expect(m.scrollWidth).toBeLessThanOrEqual(m.w);
  expect(m.navBottom).toBeLessThanOrEqual(m.h+1);
});

test("Start navigation opens core screens",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Receptury"}).last().click();
  await expect(page.getByRole("heading",{name:"Receptury"})).toBeVisible();
  await page.getByRole("button",{name:"Zakupy"}).last().click();
  await expect(page.getByRole("heading",{name:"Zakupy"})).toBeVisible();
  await page.getByRole("button",{name:"Kuchnia"}).last().click();
  await expect(page.getByRole("heading",{name:"Kuchnia"})).toBeVisible();
});

test("Start search control is usable",async({page})=>{
  await page.goto("/");
  const input=page.getByPlaceholder("Szukaj receptury, składnika...");
  await input.fill("carbonara");
  await expect(page.locator(".home-search-clear")).toBeVisible();
  await input.press("Enter");
  await expect(page.getByRole("heading",{name:"Receptury"})).toBeVisible();
});

test("Recipes search, filters and detail work",async({page})=>{
  await page.goto("#/recipes");
  await expect(page.getByRole("heading",{name:"Receptury"})).toBeVisible();
  await expect(page.locator(".recipe-card")).toHaveCount(3);
  const input=page.getByPlaceholder("Szukaj receptury lub składnika...");
  await input.fill("guanciale");
  await expect(page.locator(".recipe-card")).toHaveCount(1);
  await page.locator(".recipe-card").click();
  await expect(page.getByRole("heading",{name:"Spaghetti alla Carbonara"})).toBeVisible();
  await expect(page.getByText("guanciale",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:/Dodaj do ulubionych/}).click();
  await expect(page.getByRole("button",{name:/Ulubione/})).toBeVisible();
  await page.getByRole("button",{name:"‹ Receptury"}).click();
  await expect(page.getByRole("heading",{name:"Receptury"})).toBeVisible();
});

test("Recipe editor creates and saves a recipe",async({page})=>{
  await page.goto("#/recipes");
  await page.getByRole("button",{name:"Dodaj recepturę"}).click();
  await expect(page.getByRole("heading",{name:"Nowa receptura"})).toBeVisible();
  await page.getByLabel("Nazwa").fill("Testowa receptura");
  await page.getByLabel("Region / kuchnia").fill("Polska");
  await page.getByRole("button",{name:"＋ Dodaj"}).click();
  await page.locator("[name=ingredientName]").nth(1).fill("masło");
  await page.locator("[name=ingredientQty]").nth(1).fill("20");
  await page.locator("[name=ingredientUnit]").nth(1).fill("g");
  await page.getByRole("button",{name:"＋ Krok"}).click();
  await page.locator("[name=step]").nth(1).fill("Wymieszaj składniki.");
  await page.getByRole("button",{name:"Zapisz recepturę"}).click();
  await expect(page.getByRole("heading",{name:"Testowa receptura",exact:true})).toBeVisible();
  await expect(page.getByText("masło",{exact:true})).toBeVisible();
});


test("Recipe scaling recalculates ingredient quantities",async({page})=>{
  await page.goto("#/recipes");
  await page.getByPlaceholder("Szukaj receptury lub składnika...").fill("carbonara");
  await page.locator(".recipe-card").click();
  await expect(page.getByRole("heading",{name:"Spaghetti alla Carbonara"})).toBeVisible();
  await expect(page.getByText("50 g",{exact:true})).toBeVisible();
  await page.getByLabel("Docelowa liczba porcji").fill("20");
  await page.getByLabel("Docelowa liczba porcji").press("Enter");
  await expect(page.getByText("1000 g",{exact:true})).toBeVisible();
});

test("Mam Mąkę calculator calculates dough from flour",async({page})=>{
  await page.goto("#/calculators");
  await expect(page.getByRole("heading",{name:"Kalkulatory"})).toBeVisible();
  await expect(page.getByText("Kalkulator ciasta")).toBeVisible();
  await expect(page.locator("#dough-flour")).toHaveValue("7500");
  await expect(page.getByText("4875 g",{exact:true})).toBeVisible();
  await expect(page.getByText("12592.5 g",{exact:true})).toBeVisible();
  await page.locator("#dough-hydration").fill("70");
  await expect(page.getByText("5250 g",{exact:true})).toBeVisible();
  await expect(page.getByText("12967.5 g",{exact:true})).toBeVisible();
});

test("Kuchnia prowadzi przez kroki receptury",async({page})=>{
  await page.goto("#/recipes");
  await page.locator(".recipe-card").first().click();
  await expect(page.getByRole("heading",{name:"Spaghetti alla Carbonara"})).toBeVisible();
  await page.getByRole("button",{name:"👨‍🍳 Zacznij gotowanie"}).click();
  await expect(page.getByRole("heading",{name:"Kuchnia"})).toBeVisible();
  await expect(page.getByText("KROK 1 / 4")).toBeVisible();
  await expect(page.locator(".cook-step-card strong")).toHaveText("Podsmaż guanciale na średnim ogniu.");
  await page.getByRole("button",{name:"Dalej →"}).click();
  await expect(page.getByText("KROK 2 / 4")).toBeVisible();
  await expect(page.locator(".cook-step-card strong")).toHaveText("Utrzyj Pecorino z żółtkami i pieprzem.");
});

test("Kuchnia rozlicza zużyte składniki z magazynu",async({page})=>{
  await page.goto("#/inventory");
  const form=page.locator("#inventory-form");
  const items=[
    ["świeży makaron","300","g"],
    ["guanciale","100","g"],
    ["żółtko","4","szt."],
    ["Pecorino Romano","70","g"],
    ["pieprz czarny","4","g"]
  ];
  for(const [name,qty,unit] of items){
    await form.locator("[name=name]").fill(name);
    await form.locator("[name=qty]").fill(qty);
    await form.locator("[name=unit]").fill(unit);
    await form.locator("[name=minQty]").fill("0");
    await form.getByRole("button",{name:"＋ Dodaj do magazynu"}).click();
  }
  await page.goto("#/recipes");
  await page.locator(".recipe-card").filter({hasText:"Spaghetti alla Carbonara"}).click();
  await page.getByRole("button",{name:"👨‍🍳 Zacznij gotowanie"}).click();
  page.once("dialog",dialog=>dialog.accept());
  for(let i=0;i<4;i++)await page.getByRole("button",{name:i===3?"Zakończ i rozlicz":"Dalej →"}).click();
  await expect(page.getByRole("heading",{name:"Spaghetti alla Carbonara",exact:true})).toBeVisible();
  await page.goto("#/inventory");
  const guanciale=page.locator(".inventory-row").filter({hasText:"guanciale"});
  await expect(guanciale.locator("[data-inventory-qty]")).toHaveValue("50");
  const pasta=page.locator(".inventory-row").filter({hasText:"świeży makaron"});
  await expect(pasta.locator("[data-inventory-qty]")).toHaveValue("150");
  const pecorino=page.locator(".inventory-row").filter({hasText:"Pecorino Romano"});
  await expect(pecorino.locator("[data-inventory-qty]")).toHaveValue("35");
});

test("Braki receptury trafiają do zakupów z dokładną ilością",async({page})=>{
  await page.goto("#/inventory");
  const form=page.locator("#inventory-form");
  await form.locator("[name=name]").fill("guanciale");
  await form.locator("[name=qty]").fill("30");
  await form.locator("[name=unit]").fill("g");
  await form.getByRole("button",{name:"＋ Dodaj do magazynu"}).click();
  await page.goto("#/recipes");
  await page.locator(".recipe-card").filter({hasText:"Spaghetti alla Carbonara"}).click();
  await page.getByRole("button",{name:"👨‍🍳 Zacznij gotowanie"}).click();
  await expect(page.getByText(/brakuje 20 g/)).toBeVisible();
  await page.getByRole("button",{name:"＋ Dodaj braki do zakupów"}).click();
  await page.goto("#/shopping");
  await expect(page.getByText("guanciale · 20 g",{exact:true})).toBeVisible();
});

test("Magazyn obsługuje minima, alerty i edycję stanu",async({page})=>{
  await page.goto("#/inventory");
  await expect(page.getByRole("heading",{name:"Magazyn",exact:true})).toBeVisible();
  const form=page.locator("#inventory-form");
  await form.locator("[name=name]").fill("mąka 00");
  await form.locator("[name=qty]").fill("5000");
  await form.locator("[name=unit]").fill("g");
  await form.locator("[name=minQty]").fill("6000");
  await form.getByRole("button",{name:"＋ Dodaj do magazynu"}).click();
  await expect(page.getByText("NISKI STAN",{exact:true})).toBeVisible();
  await expect(page.getByText("Niskie stany: 1",{exact:false})).toBeVisible();
  const row=page.locator(".inventory-row").filter({hasText:"mąka 00"});
  await row.getByRole("button",{name:"Zwiększ mąka 00"}).click();
  await expect(row.locator("[data-inventory-qty]")).toHaveValue("5001");
  await row.locator("[data-inventory-qty]").fill("7000");
  await row.locator("[data-inventory-qty]").press("Enter");
  await expect(page.getByText("NISKI STAN",{exact:true})).toHaveCount(0);
  await page.getByRole("button",{name:"Przełącz alerty magazynu"}).click();
  await expect(page.getByRole("button",{name:"Przełącz alerty magazynu"})).not.toHaveClass(/active/);
  await row.locator("[data-inventory-min]").fill("8000");
  await row.locator("[data-inventory-min]").press("Enter");
  await expect(page.getByText("NISKI STAN",{exact:true})).toHaveCount(0);
});

test("Working modules no longer show placeholder",async({page})=>{
  await page.goto("/");
  await page.getByRole("button",{name:"Zakupy"}).last().click();
  await expect(page.getByRole("heading",{name:"Zakupy"})).toBeVisible();
  await expect(page.getByText("Lista jest pusta")).toBeVisible();
  await page.getByPlaceholder("Dodaj produkt...").fill("mąka 00");
  await page.locator("#shopping-form").getByRole("button",{name:"＋"}).click();
  await expect(page.getByText("mąka 00",{exact:true})).toBeVisible();
  await page.goto("#/inventory");
  await expect(page.getByRole("heading",{name:"Magazyn",exact:true})).toBeVisible();
  await expect(page.getByText("Magazyn jest pusty")).toBeVisible();
  await page.getByPlaceholder("Produkt...").fill("mąka 00");
  await page.locator("#inventory-form input[name=qty]").fill("5000");
  await page.locator("#inventory-form input[name=unit]").fill("g");
  await page.locator("#inventory-form").getByRole("button",{name:/Dodaj do magazynu/}).click();
  await expect(page.getByText("mąka 00",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Więcej"}).last().click();
  await expect(page.getByRole("heading",{name:"Więcej"})).toBeVisible();
  await expect(page.getByText("Kolejne funkcje dokładamy", {exact:false})).toHaveCount(0);
});


test("Food Cost liczy koszt receptury i koszt porcji",async({page})=>{
  await page.goto("#/inventory");const form=page.locator("#inventory-form");
  const items=[["świeży makaron","300","g","6"],["guanciale","100","g","8"],["żółtko","4","szt.","4"],["Pecorino Romano","70","g","14"],["pieprz czarny","4","g","2"]];
  for(const [name,qty,unit,price] of items){await form.locator("[name=name]").fill(name);await form.locator("[name=qty]").fill(qty);await form.locator("[name=unit]").fill(unit);await form.locator("[name=minQty]").fill("0");await form.locator("[name=purchasePrice]").fill(price);await form.getByRole("button",{name:"＋ Dodaj do magazynu"}).click();}
  await page.goto("#/recipes");await page.locator(".recipe-card").filter({hasText:"Spaghetti alla Carbonara"}).click();
  await expect(page.getByText("Koszt receptury")).toBeVisible();await expect(page.getByText("17,00 zł",{exact:true})).toHaveCount(2);
});
test("Food Cost procent i skalowanie działają",async({page})=>{
  await page.goto("#/inventory");const form=page.locator("#inventory-form");await form.locator("[name=name]").fill("mąka test");await form.locator("[name=qty]").fill("1000");await form.locator("[name=unit]").fill("g");await form.locator("[name=purchasePrice]").fill("20");await form.getByRole("button",{name:"＋ Dodaj do magazynu"}).click();
  await page.goto("#/recipes");await page.getByRole("button",{name:"Dodaj recepturę"}).click();await page.getByLabel("Nazwa").fill("Food Cost Test");await page.getByLabel("Cena sprzedaży / porcję (zł)").fill("40");await page.locator("[name=ingredientName]").first().fill("mąka test");await page.locator("[name=ingredientQty]").first().fill("100");await page.locator("[name=ingredientUnit]").first().fill("g");await page.getByRole("button",{name:"Zapisz recepturę"}).click();
  await expect(page.getByText("2,00 zł",{exact:true})).toHaveCount(2);await expect(page.getByText("5%",{exact:true})).toBeVisible();await page.getByLabel("Docelowa liczba porcji").fill("2");await page.getByLabel("Docelowa liczba porcji").press("Enter");await expect(page.getByText("4,00 zł",{exact:true})).toBeVisible();
});


test("Tryby PRO i AMATOR zmieniają dostępne funkcje",async({page})=>{
  await page.goto("#/settings");
  await expect(page.getByText("Tryb aplikacji")).toBeVisible();
  await page.getByRole("button",{name:"AMATOR"}).click();
  await page.goto("#/inventory");
  await expect(page.getByRole("heading",{name:"Lodówka",exact:true})).toBeVisible();
  await page.goto("#/settings");
  await page.getByRole("button",{name:"PRO"}).click();
  await page.goto("#/inventory");
  await expect(page.getByRole("heading",{name:"Magazyn",exact:true})).toBeVisible();
});

test("User data is isolated between separate browser contexts",async({browser})=>{
  const userA=await browser.newContext();
  const userB=await browser.newContext();
  const pageA=await userA.newPage();
  const pageB=await userB.newPage();

  await pageA.goto("#/recipes");
  await pageA.getByRole("button",{name:"Dodaj recepturę"}).click();
  await pageA.getByLabel("Nazwa").fill("Tylko Użytkownik A");
  await pageA.getByLabel("Region / kuchnia").fill("Prywatne");
  await pageA.locator("[name=ingredientName]").first().fill("test A");
  await pageA.locator("[name=ingredientQty]").first().fill("1");
  await pageA.locator("[name=ingredientUnit]").first().fill("szt.");
  await pageA.getByRole("button",{name:"Zapisz recepturę"}).click();
  await expect(pageA.getByRole("heading",{name:"Tylko Użytkownik A",exact:true})).toBeVisible();

  await pageB.goto("#/recipes");
  await expect(pageB.getByText("Tylko Użytkownik A",{exact:true})).toHaveCount(0);

  await pageB.getByRole("button",{name:"Dodaj recepturę"}).click();
  await pageB.getByLabel("Nazwa").fill("Tylko Użytkownik B");
  await pageB.locator("[name=ingredientName]").first().fill("test B");
  await pageB.locator("[name=ingredientQty]").first().fill("1");
  await pageB.locator("[name=ingredientUnit]").first().fill("szt.");
  await pageB.getByRole("button",{name:"Zapisz recepturę"}).click();
  await expect(pageB.getByRole("heading",{name:"Tylko Użytkownik B",exact:true})).toBeVisible();

  await pageA.goto("#/recipes");
  await expect(pageA.getByText("Tylko Użytkownik A",{exact:true})).toBeVisible();
  await expect(pageA.getByText("Tylko Użytkownik B",{exact:true})).toHaveCount(0);

  await userA.close();
  await userB.close();
});


test("PRO inventory exposes EAN scanner fallback", async ({page})=>{
  await page.goto("#/inventory");
  await expect(page.getByRole("heading",{name:"Magazyn",exact:true})).toBeVisible();
  await page.getByRole("button",{name:/Skanuj produkt/i}).click();
  await expect(page.getByText("Dodaj produkt po EAN",{exact:true})).toBeVisible();
  const ean=page.locator("#barcode-ean");
  await ean.fill("5901234123457");
  await page.getByRole("button",{name:"Użyj kodu"}).click();
  await expect(page.getByText("5901234123457",{exact:true})).toBeVisible();
  await expect(page.locator("#inventory-form [name=ean]")).toHaveValue("5901234123457");
  await expect(page.locator("#inventory-form [name=inventoryId]")).toHaveValue("");
  await page.locator("#inventory-form [name=name]").fill("Testowy produkt EAN");
  await page.locator("#inventory-form [name=qty]").fill("100");
  await page.locator("#inventory-form [name=unit]").fill("szt.");
  await page.locator("#inventory-form [name=minQty]").fill("10");
  await page.locator("#inventory-form").getByRole("button",{name:"＋ Dodaj do magazynu"}).click();
  await expect(page.getByText("Testowy produkt EAN",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:/Skanuj produkt/i}).click();
  await page.locator("#barcode-ean").fill("5901234123457");
  await page.getByRole("button",{name:"Użyj kodu"}).click();
  await expect(page.getByText("Produkt już jest w magazynie",{exact:false})).toBeVisible();
  await expect(page.locator("#inventory-form [name=inventoryId]")).not.toHaveValue("");
  await expect(page.locator("#inventory-form [name=name]")).toHaveValue("Testowy produkt EAN");
  await expect(page.locator("#inventory-form [name=qty]")).toHaveValue("100");
  await expect(page.locator("#inventory-form [name=ean]")).toHaveValue("5901234123457");
});


test("Ulubione pokazują tylko zapisane receptury i zachowują stan po przeładowaniu",async({page})=>{
  await page.goto("#/recipes");
  await page.locator(".recipe-card").filter({hasText:"Spaghetti alla Carbonara"}).click();
  await page.getByRole("button",{name:/Dodaj do ulubionych/}).click();
  await page.goto("#/favorites");
  await expect(page.getByRole("heading",{name:"Ulubione",exact:true})).toBeVisible();
  await expect(page.getByText("Spaghetti alla Carbonara",{exact:true})).toBeVisible();
  await expect(page.getByText("Pizza Napoletana",{exact:true})).toHaveCount(0);
  await page.reload();
  await expect(page.getByText("Spaghetti alla Carbonara",{exact:true})).toBeVisible();
  await expect(page.getByText("Pizza Napoletana",{exact:true})).toHaveCount(0);
});

test("AMATOR blokuje kalkulator i ukrywa funkcje PRO",async({page})=>{
  await page.goto("#/settings");
  await page.getByRole("button",{name:"AMATOR"}).click();
  await page.goto("/");
  await expect(page.getByText("Kalkulator",{exact:true})).toHaveCount(0);
  await page.goto("#/calculators");
  await expect(page.getByRole("heading",{name:"Co dziś"})).toBeVisible();
  await page.goto("#/recipes");
  await page.locator(".recipe-card").first().click();
  await expect(page.getByText("FOOD COST",{exact:true})).toHaveCount(0);
});
