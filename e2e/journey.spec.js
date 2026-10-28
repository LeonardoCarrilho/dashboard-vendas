import {test,expect} from "@playwright/test";
test("filtro de período atualiza seleção",async({page})=>{
 await page.goto("./"); const button=page.getByRole("button",{name:"7 dias",exact:true});await button.click();await expect(button).toHaveAttribute("aria-pressed","true");
});
