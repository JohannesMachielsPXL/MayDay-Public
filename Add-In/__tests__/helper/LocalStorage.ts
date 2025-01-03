import {Page} from "@playwright/test";
import ICategory from "../../src/models/ICategory";
import IPreferences from "../../src/models/IPreferences";
import ISubCategory from "../../src/models/ISubCategory";

export async function saveToLocalStorage(page: Page, key: string, value: string): Promise<void> {
    await page.evaluate(({key, value}) => {
        localStorage.setItem(key, value);
    }, {key: key, value: value});
}

export async function saveAllToLocalStorage(page: Page, categories: ICategory[], subCategories: ISubCategory[], preferences: IPreferences): Promise<void> {
    await saveToLocalStorage(page, "categories", JSON.stringify(categories));
    await saveToLocalStorage(page, "subCategories", JSON.stringify(subCategories));
    await saveToLocalStorage(page, "preferences", JSON.stringify(preferences));
}

export async function cleanLocalStorage(page: Page): Promise<void> {
    await page.evaluate(() => {
        localStorage.clear();
    });
}
