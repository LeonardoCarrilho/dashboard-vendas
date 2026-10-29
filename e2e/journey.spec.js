import {test,expect} from "@playwright/test";
for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test.describe("jornada em " + viewport.width + "px", () => {
    test.use({ viewport });
test("filtro de período atualiza seleção",async({page})=>{
 await page.goto("./"); const button=page.getByRole("button",{name:"7 dias",exact:true});await button.click();await expect(button).toHaveAttribute("aria-pressed","true");
});

  });
}
