const t = (key, values = {}) => key.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? `{${name}}`);
/* Local demonstrations only. No analytics, requests, storage or real submissions. */
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.dataset.open = 'false';
}
menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.dataset.open = String(open);
});
navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
    const open = event.target.closest('[data-open-dialog]');
    const pick = event.target.closest('[data-pick-service]');
    if (pick) {
        const select = document.querySelector('[name="service"]');
        if (select) select.value = pick.dataset.pickService;
    }
    if (open) {
        const dialog = document.getElementById(open.dataset.openDialog);
        if (dialog instanceof HTMLDialogElement) dialog.showModal();
    }
    const close = event.target.closest('[data-close-dialog]');
    if (close) close.closest('dialog')?.close();
});
for (const dialog of document.querySelectorAll('dialog')) {
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}
// Escape closes an inner dialog first. With no inner dialog/menu, close the portfolio viewer.
document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (document.querySelector('dialog[open]')) return;
    if (menuButton?.getAttribute('aria-expanded') === 'true') {
        event.preventDefault(); closeMenu(); menuButton.focus(); return;
    }
    if (window.parent !== window) window.parent.postMessage('portfolio-preview:close', location.origin);
});

for (const input of document.querySelectorAll('input[type="date"]')) {
    const now = new Date();
    input.min = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
for (const form of document.querySelectorAll('[data-demo-form]')) {
    function simulate(event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const status = form.querySelector('[role="status"]');
        status.dataset.statusKey = form.dataset.success || 'Esta é uma demonstração. Nenhuma solicitação foi enviada.';
        status.textContent = t(status.dataset.statusKey);
        status.focus({preventScroll:true});
        form.dataset.simulated = 'true';
        form.querySelector('[type="submit"]').textContent = t('Simular novamente');
    }
    // Sandbox blocks the native submit algorithm before firing "submit".
    // Handle the action locally, preserving validation without allow-forms.
    const submit = form.querySelector('[type="submit"]');
    submit.addEventListener('click', simulate);
    form.addEventListener('submit', simulate);
    form.addEventListener('keydown', event => {
        if (event.key !== 'Enter' || !event.target.matches('input')) return;
        if (event.target.closest('[data-step]')?.querySelector('[data-next]')) return;
        event.preventDefault();
        submit.click();
    });
}

const galleryButtons = document.querySelectorAll('[data-photo]');
if (galleryButtons.length) {
    const lightbox = document.createElement('dialog');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('aria-label', t('Fotografia ampliada'));
    lightbox.innerHTML = '<div class="dialog-head"><p>Fotografia ilustrativa</p><button class="dialog-close" type="button" aria-label="Fechar fotografia"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button></div><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.append(lightbox);
    function localizeLightbox() {
        lightbox.setAttribute('aria-label', t('Fotografia ampliada'));
        lightbox.querySelector('.dialog-head p').textContent = t('Fotografia ilustrativa');
        lightbox.querySelector('.dialog-close').setAttribute('aria-label', t('Fechar fotografia'));
    }
    localizeLightbox();
    document.addEventListener('demo-language-change', localizeLightbox);
    lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
    for (const button of galleryButtons) button.addEventListener('click', () => {
        const image = button.querySelector('img');
        lightbox.querySelector('img').src = image.src;
        lightbox.querySelector('img').alt = image.alt;
        lightbox.querySelector('figcaption').textContent = t(button.dataset.caption || image.alt);
        lightbox.showModal();
    });
}

const filters = document.querySelectorAll('[data-filter]');
for (const button of filters) button.addEventListener('click', () => {
    for (const item of filters) item.setAttribute('aria-pressed', String(item === button));
    let count = 0;
    for (const dish of document.querySelectorAll('[data-category]')) {
        dish.hidden = button.dataset.filter !== 'todos' && dish.dataset.category !== button.dataset.filter;
        if (!dish.hidden) count++;
    }
    const status = document.querySelector('[data-menu-status]');
    if (status) { status.dataset.dishCount = String(count); status.textContent = t('{count} pratos na categoria selecionada.', { count }); }
});

const petForm = document.querySelector('[data-step-form]');
if (petForm) {
    const steps = [...petForm.querySelectorAll('[data-step]')];
    const progressText = petForm.querySelector('[data-step-label]');
    let current = 0;
    function render() {
        steps.forEach((step, index) => { step.hidden = index !== current; step.disabled = index !== current; });
        progressText.textContent = t('Etapa {step} de {total}', { step: current+1, total: steps.length });
        if (current > 0) steps[current].querySelector('input,select')?.focus({preventScroll:true});
    }
    render();
    document.addEventListener('demo-language-change', () => { progressText.textContent = t('Etapa {step} de {total}', { step: current+1, total: steps.length }); });
    petForm.querySelector('[data-next]').addEventListener('click', () => {
        for (const input of steps[current].querySelectorAll('input,select')) if (!input.reportValidity()) return;
        current = Math.min(current+1, steps.length-1); render();
    });
    petForm.querySelector('[data-back]').addEventListener('click', () => { current = 0; render(); });
    // Allow Enter in step one without submitting an incomplete appointment.
    petForm.addEventListener('keydown', event => {
        if (event.key === 'Enter' && current === 0 && event.target.matches('input')) { event.preventDefault(); petForm.querySelector('[data-next]').click(); }
    });
}

document.documentElement.dataset.demoReady = "true";

document.addEventListener('demo-language-change', () => {
    for (const status of document.querySelectorAll('[data-status-key]')) status.textContent = t(status.dataset.statusKey);
    for (const form of document.querySelectorAll('[data-simulated="true"]')) form.querySelector('[type="submit"]').textContent = t('Simular novamente');
    const menuStatus = document.querySelector('[data-dish-count]');
    if (menuStatus) menuStatus.textContent = t('{count} pratos na categoria selecionada.', { count: menuStatus.dataset.dishCount });
});
