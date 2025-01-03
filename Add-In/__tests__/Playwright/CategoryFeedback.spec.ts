import { test, expect } from "playwright-test-coverage";

test.describe('Category Feedback Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://localhost:3000/taskpane.html');
    });

    test('should fill the Vrije Commentaar placeholder', async ({ page }) => {
        await page.getByRole('button', { name: 'Spelling', exact: true }).click();
        await page.getByPlaceholder('Vrije commentaar').click();
        await page.getByPlaceholder('Vrije commentaar').fill('feedback');
        await expect(page.getByPlaceholder('Vrije commentaar')).toHaveValue('feedback');
    });

    test('should add the comment when Toevoegen button is clicked', async ({ page }) => {
        await page.getByRole('button', { name: 'Spelling', exact: true }).click();
        await page.getByPlaceholder('Vrije Commentaar').click();
        await page.getByPlaceholder('Vrije Commentaar').fill('azerty');
        const toevoegenButton = page.getByRole('button', { name: 'Toevoegen' });
        await toevoegenButton.click();
        await expect(toevoegenButton).toBeVisible();
    });

    test('should call service when Toevoegen button is clicked', async ({ page }) => {
        page.on('console', msg => console.log(msg.text()));

        await page.getByRole('button', { name: 'Spelling', exact: true }).click();
        await page.getByPlaceholder('Vrije Commentaar').click();
        await page.getByPlaceholder('Vrije Commentaar').fill('azerty');
        const toevoegenButton = page.getByRole('button', { name: 'Toevoegen' });
        await toevoegenButton.click();

        const [message] = await Promise.all([
            page.waitForEvent('console', msg => msg.text() === 'submitFeedback'),
            page.getByRole('button', { name: 'Toevoegen' }).click()
        ]);
        expect(message.text()).toBe('submitFeedback');

    });
    



});