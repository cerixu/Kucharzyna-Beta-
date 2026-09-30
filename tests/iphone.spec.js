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
