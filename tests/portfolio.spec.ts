import { test, expect, type Page, type FrameLocator } from '@playwright/test';

const demos = ['barbearia', 'advocacia', 'culinaria', 'pet'] as const;
const tomorrow = () => {
    const date = new Date(); date.setDate(date.getDate() + 1);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
};

async function loadPhotos(page: Page) {
    await page.evaluate(async () => {
        for (const image of document.querySelectorAll<HTMLImageElement>('img[src]')) image.loading = 'eager';
        await Promise.all([...document.querySelectorAll<HTMLImageElement>('img[src]')].map(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.onload = resolve; image.onerror = resolve; })));
        await document.fonts.ready;
    });
}

async function appointment(scope: Page | FrameLocator) {
    await scope.locator('#book-name').fill('Pessoa de teste');
    await scope.locator('#book-date').fill(tomorrow());
    await scope.locator('#booking button[type=submit]').click();
    await expect(scope.locator('#booking [role="status"]')).toContainText('Nenhuma reserva foi realizada');
}

for (const slug of demos) {
    test(`${slug}: direct entry, local assets, responsive menu and keyboard`, async ({ page }) => {
        const errors: string[] = [];
        const failures: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
        page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
        const response = await page.goto(`/demos/${slug}/`);
        expect(response?.status()).toBe(200);
        await loadPhotos(page);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Demonstração/);
        expect(await page.locator('img[src]').evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
        expect(await page.evaluate(() => [...document.fonts].filter(font => font.status === 'error').length)).toBe(0);
        for (const width of [1440, 768, 390, 320]) {
            await page.setViewportSize({ width, height: 900 });
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        }
        const menu = page.getByRole('button', { name: 'Abrir menu' });
        await menu.click();
        await expect(menu).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('.site-nav')).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(menu).toHaveAttribute('aria-expanded', 'false');
        await expect(menu).toBeFocused();
        await menu.click();
        await page.locator('.site-nav a').first().click();
        await expect(menu).toHaveAttribute('aria-expanded', 'false');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
        await page.reload();
        await expect(page.locator('h1')).toBeVisible();
        expect(errors).toEqual([]); expect(failures).toEqual([]);
    });
}

test('barbershop: service selection, booking validation, gallery and dialog Escape', async ({ page }) => {
    await page.goto('/demos/barbearia/');
    await page.getByRole('button', { name: 'Agendar corte e barba' }).click();
    await expect(page.locator('#book-service')).toHaveValue('Corte + barba');
    await page.locator('#booking button[type=submit]').click();
    await expect(page.locator('#booking [role="status"]')).toBeEmpty();
    await appointment(page);
    await page.keyboard.press('Escape');
    await expect(page.locator('#booking')).not.toBeVisible();
    await page.locator('[data-photo]').first().click();
    await expect(page.locator('.lightbox')).toBeVisible();
    await expect(page.locator('.lightbox img')).toHaveAttribute('src', /corte.webp/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.lightbox')).not.toBeVisible();
});

test('law firm: FAQ and local contact validation without network submission', async ({ page }) => {
    await page.goto('/demos/advocacia/');
    await page.getByText('Este escritório existe?').click();
    await expect(page.getByText('Não. Almeida & Associados', { exact: false })).toBeVisible();
    await page.locator('#law-name').fill('Pessoa de teste');
    await page.locator('#law-email').fill('invalido');
    await page.locator('#law-message').fill('Mensagem demonstrativa sem dados pessoais.');
    await page.getByRole('button', { name: 'Simular contato' }).click();
    await expect(page.locator('.form-status')).toBeEmpty();
    expect(await page.locator('#law-email').evaluate((element: HTMLInputElement) => element.validity.typeMismatch)).toBe(true);
    await page.locator('#law-email').fill('teste@example.com');
    const requests: string[] = [];
    page.on('request', request => { if (request.method() !== 'GET') requests.push(request.url()); });
    await page.getByRole('button', { name: 'Simular contato' }).click();
    await expect(page.locator('.form-status')).toContainText('Nenhuma mensagem foi enviada');
    expect(requests).toEqual([]);
});

test('restaurant: category filters, dish detail and reservation', async ({ page }) => {
    await page.goto('/demos/culinaria/');
    for (const [name, category] of [['Entradas', 'entradas'], ['Principais', 'principais'], ['Sobremesas', 'sobremesas']]) {
        await page.getByRole('button', { name, exact: true }).click();
        await expect(page.locator('.dish:visible')).toHaveCount(1);
        await expect(page.locator('.dish:visible')).toHaveAttribute('data-category', category);
    }
    await page.getByRole('button', { name: 'Todos', exact: true }).click();
    await expect(page.locator('.dish:visible')).toHaveCount(3);
    await page.locator('.dish [data-photo]').first().click();
    await expect(page.locator('.lightbox figcaption')).toContainText('Salada da estação');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Reserve uma mesa' }).click();
    await appointment(page);
});

test('pet: service choice, FAQ and two-step scheduling with back navigation', async ({ page }) => {
    await page.goto('/demos/pet/');
    await page.getByRole('link', { name: 'Escolher tosa' }).click();
    await expect(page.locator('#pet-service')).toHaveValue('Tosa com calma');
    await page.getByRole('button', { name: 'Próxima etapa' }).click();
    await expect(page.locator('[data-step-label]')).toHaveText('Etapa 1 de 2');
    await page.locator('#pet-name').fill('Amigo');
    await page.getByRole('button', { name: 'Próxima etapa' }).click();
    await expect(page.locator('[data-step-label]')).toHaveText('Etapa 2 de 2');
    await page.getByRole('button', { name: 'Voltar', exact: true }).click();
    await expect(page.locator('#pet-name')).toHaveValue('Amigo');
    await page.getByRole('button', { name: 'Próxima etapa' }).click();
    await page.locator('#pet-tutor').fill('Pessoa de teste');
    await page.locator('#pet-date').fill(tomorrow());
    await page.getByRole('button', { name: 'Simular agendamento' }).click();
    await expect(page.locator('.form-status')).toContainText('Nenhuma reserva foi realizada');
    await page.getByText('O agendamento é real?').click();
    await expect(page.locator('details[open]')).toContainText('nenhuma solicitação é enviada');
});

test('portfolio: four real screenshots, preserved projects, keyboard tabs and contact', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('iframe')).toHaveCount(0);
    await expect(page.locator('.project')).toHaveCount(4);
    for (const image of await page.locator('.project img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveAttribute('src', /\/images\/projects\/.*\.webp/);
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    }
    const landing = page.getByRole('tab', { name: 'Landing Pages' });
    await landing.focus(); await page.keyboard.press('ArrowRight');
    await expect(page.locator('.project')).toHaveCount(3);
    await expect(page.getByRole('heading', { name: 'VeyraScreen', exact: true })).toBeVisible();
    await expect(page.locator('.project').filter({has: page.getByRole('heading', { name: 'VeyraScreen', exact: true })}).locator('.project-image')).toHaveAttribute('href', 'https://veyrascreen.onrender.com/');
    await expect(page.locator('.project img[src="/veyra-preview.jpg"]')).toHaveCount(1);
    await page.keyboard.press('Home');
    await expect(landing).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('link', { name: 'Solicitar orçamento' })).toHaveAttribute('href', '#contato');
});

for (const [index, slug] of demos.entries()) {
    test(`${slug}: sandboxed iframe, effective device widths, interaction and restored focus`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
        await page.goto('/');
        const opener = page.getByRole('button', { name: 'Explorar site', exact: true }).nth(index);
        await opener.scrollIntoViewIfNeeded();
        const scroll = await page.evaluate(() => scrollY);
        await opener.click();
        await expect(page.locator('iframe')).toHaveCount(1);
        await expect(page.locator('iframe')).toHaveAttribute('src', `/demos/${slug}/?lang=pt`);
        const frame = page.frameLocator('iframe');
        await expect(frame.locator('html')).toHaveAttribute('data-demo-ready', 'true');
        await expect(frame.locator('h1')).toBeVisible();
        await frame.locator('body').evaluate(() => document.fonts.ready);
        expect(await frame.locator('body').evaluate(() => [...document.fonts].filter(font => font.status === 'error').length)).toBe(0);
        expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
        expect(await frame.locator('body').evaluate(() => { try { return Boolean(parent.document.body); } catch { return false; } })).toBe(false);
        for (const [name, width] of [['Tablet', 768], ['Celular', 390]] as const) {
            await page.getByRole('button', { name, exact: true }).click();
            expect(await frame.locator('body').evaluate(() => innerWidth)).toBe(width);
        }
        await page.setViewportSize({ width: 320, height: 900 });
        await page.getByRole('button', { name: 'Tablet', exact: true }).click();
        expect(await frame.locator('body').evaluate(() => innerWidth)).toBe(768);
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.getByRole('button', { name: 'Desktop', exact: true }).click();
        if (slug === 'barbearia') { await frame.getByRole('button', { name: 'Escolher meu horário' }).click(); await appointment(frame); await frame.getByRole('button', { name: 'Fechar agendamento' }).click(); }
        if (slug === 'advocacia') { await frame.getByText('Este escritório existe?').click(); await expect(frame.locator('details[open]')).toBeVisible(); }
        if (slug === 'culinaria') { await frame.getByRole('button', { name: 'Principais', exact: true }).click(); await expect(frame.locator('.dish:visible')).toHaveCount(1); await frame.getByRole('button', { name: 'Reserve uma mesa' }).click(); await appointment(frame); await frame.getByRole('button', { name: 'Fechar agendamento' }).click(); }
        if (slug === 'pet') { await frame.getByRole('link', { name: 'Escolher banho' }).click(); await frame.locator('#pet-name').fill('Amigo'); await frame.getByRole('button', { name: 'Próxima etapa' }).click(); await frame.locator('#pet-tutor').fill('Pessoa de teste'); await frame.locator('#pet-date').fill(tomorrow()); await frame.getByRole('button', { name: 'Simular agendamento' }).click(); await expect(frame.locator('.form-status')).toContainText('Nenhuma reserva foi realizada'); }
        await frame.locator('h1').click();
        await page.keyboard.press('Escape');
        await expect(page.locator('dialog')).toHaveCount(0);
        await expect(page.locator('iframe')).toHaveCount(0);
        await expect(opener).toBeFocused();
        expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
        expect(Math.abs((await page.evaluate(() => scrollY)) - scroll)).toBeLessThan(5);
        expect(errors).toEqual([]);
    });
}


test('original portfolio layout with projects immediately after Me', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('#sobre').evaluate(element => element.nextElementSibling?.id)).toBe('projeto');
    await expect(page.locator('.typing-line')).toBeVisible();
    await expect(page.locator('#tech-stack')).toBeVisible();
    await expect(page.locator('.project-technologies')).toHaveCount(4);
    for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
});


for (const slug of demos) {
    test(`${slug}: PT/EN content, controls, responsive layout and accessible labels`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(`/demos/${slug}/?lang=en`);
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        await expect(page.getByRole('group', { name: 'Page language' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'English', exact: true })).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('.demo-notice')).toContainText('Fictional brand');
        await expect(page).toHaveTitle(/Demo project/);
        const english = await page.locator('h1').innerText();
        for (const width of [1440, 768, 390, 320]) {
            await page.setViewportSize({ width, height: 900 });
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        }
        await page.getByRole('button', { name: 'Open menu' }).click();
        await expect(page.locator('.site-nav')).toBeVisible();
        await page.keyboard.press('Escape');
        await page.getByRole('button', { name: 'Português', exact: true }).click();
        await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
        expect(await page.locator('h1').innerText()).not.toBe(english);
        await expect(page.locator('.demo-notice')).toContainText('Marca e informações fictícias');
        await page.getByRole('button', { name: 'English', exact: true }).click();
        await expect(page.locator('h1')).toHaveText(english, { useInnerText: true });
        expect(errors).toEqual([]);
    });
}

test('English demo flows translate feedback and keep selected service values stable', async ({ page }) => {
    await page.goto('/demos/barbearia/?lang=en');
    await page.getByRole('button', { name: 'Book a cut and beard' }).click();
    await expect(page.locator('#book-service')).toHaveValue('Corte + barba');
    await page.getByLabel('Your name', { exact: true }).fill('Demo person');
    await page.getByLabel('Preferred date').fill(tomorrow());
    await page.locator('#booking button[type=submit]').click();
    await expect(page.locator('#booking [role="status"]')).toContainText('No appointment has been made');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Português', exact: true }).click();
    await page.getByRole('button', { name: 'Escolher meu horário' }).click();
    await expect(page.locator('#booking [role="status"]')).toContainText('Nenhuma reserva foi realizada');
    await page.goto('/demos/advocacia/?lang=en');
    await page.getByLabel('Name', { exact: true }).fill('Demo person');
    await page.getByLabel('Email', { exact: true }).fill('demo@example.com');
    await page.getByLabel('Demo message', { exact: true }).fill('An illustrative message with no personal information.');
    await page.getByRole('button', { name: 'Try a demo enquiry' }).click();
    await expect(page.locator('.form-status')).toContainText('No message was sent');
    await page.goto('/demos/culinaria/?lang=en');
    await page.getByRole('button', { name: 'Mains', exact: true }).click();
    await expect(page.locator('[data-menu-status]')).toContainText('Dishes shown: 1');
    await page.getByRole('button', { name: 'Reserve a table' }).click();
    await page.getByLabel('Your name', { exact: true }).fill('Demo person');
    await page.getByLabel('Preferred date').fill(tomorrow());
    await page.locator('#booking button[type=submit]').click();
    await expect(page.locator('#booking [role="status"]')).toContainText('No reservation has been made');
    await page.goto('/demos/pet/?lang=en');
    await page.getByRole('link', { name: 'Choose grooming' }).click();
    await page.getByLabel("Pet's name").fill('Buddy');
    await page.getByRole('button', { name: 'Next step' }).click();
    await expect(page.locator('[data-step-label]')).toHaveText('Step 2 of 2');
    await page.getByRole('button', { name: 'Português', exact: true }).click();
    await expect(page.locator('[data-step-label]')).toHaveText('Etapa 2 de 2');
    await page.getByRole('button', { name: 'English', exact: true }).click();
    await page.getByLabel('Your name', { exact: true }).fill('Demo person');
    await page.getByLabel('Preferred date').fill(tomorrow());
    await page.getByRole('button', { name: 'Try a demo booking' }).click();
    await expect(page.locator('.form-status')).toContainText('No appointment was made and no details were sent');
});

 test('requested icons, Voxen, contact labels and galaxy motion preferences', async ({ page }) => {
 await page.goto('/');
 await expect(page.locator('.brand-symbol')).toBeVisible();
 await expect(page.locator('.hero-tags svg')).toHaveCount(4);
 await expect(page.locator('.project-technologies li[title="HTML"]')).toHaveCount(4);
 await expect(page.locator('#contato')).not.toContainText('eliaspessoal06@gmail.com');
 await page.getByRole('tab', {name:'Projetos Profissionais'}).click();
 await expect(page.getByRole('heading',{name:'Voxen',exact:true})).toBeVisible();
 await expect(page.locator('.project img[src="/images/projects/voxen.webp"]')).toBeVisible();
 await page.locator('#tech-stack').scrollIntoViewIfNeeded();
 await page.getByRole('button', {name:'Pausar animações'}).click();
 await expect(page.locator('.galaxy-backdrop')).toHaveClass(/galaxy-paused/);
 await page.emulateMedia({reducedMotion:'reduce'});
 expect(await page.locator('.galaxy-backdrop i').first().evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
 await expect(page.locator('.activity-overview')).toContainText('dias ativos');
 });

test('topbar language icons, menu keyboard and responsive layout', async ({ page }) => {
 await page.goto('/');
 await page.locator('.language-switcher summary').click();
 await expect(page.getByRole('button',{name:'Português',exact:true}).locator('svg')).toBeVisible();
 await expect(page.getByRole('button',{name:'English',exact:true}).locator('svg')).toBeVisible();
 await page.getByRole('button',{name:'English',exact:true}).click();
 await expect(page.locator('.language-switcher summary')).toContainText('EN');
 await expect(page.locator('.language-switcher summary svg.language-icon')).toBeVisible();
 await page.locator('.nav-more summary').click();
 await page.keyboard.press('Escape');
 await expect(page.locator('.nav-more')).not.toHaveAttribute('open','');
 for(const width of [1440,768,390,320]) {
 await page.setViewportSize({width,height:900});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('.brand')).toBeVisible();
 }
});
