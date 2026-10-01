const{test,expect}=require("@playwright/test");

test("Start fits the iPhone viewport",async({page})=>{
  await page.goto("/");
  await expect(page.getByText("Kucharzyna",{exact:true}).first()).toBeVisible();
  await expect(page.getByPlaceholder("Szukaj receptury, składnika...")).toBeVisible();
  await expect(page.locator(".home-action")).toHaveCount(9);
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
  await expect(page.getByRole("heading",{name:"Testowa receptura"})).toBeVisible();
  await expect(page.getByText("masło",{exact:true})).toBeVisible();
});
