/* Preserve original text nodes and form values when switching languages. */
const dictionary = window.demoTranslations || {};
const textRecords = [];
const attributeRecords = [];
const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.parentElement?.closest('script,style')) continue;
    const original = node.nodeValue;
    const key = original.trim();
    if (dictionary[key]) textRecords.push({ node, original, key, before: original.match(/^\s*/)[0], after: original.match(/\s*$/)[0] });
}
// A translated option's implicit value would change; service identifiers stay stable.
for (const option of document.querySelectorAll('option')) if (!option.hasAttribute('value')) option.value = option.textContent;
for (const element of document.querySelectorAll('[aria-label],[alt],[placeholder],meta[content],[data-caption]')) {
    for (const name of ['aria-label', 'alt', 'placeholder', 'content', 'data-caption']) {
        const original = element.getAttribute(name);
        if (original && dictionary[original]) attributeRecords.push({ element, name, original });
    }
}
let language = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'pt';
function translate(key, values = {}) {
    let value = language === 'en' ? dictionary[key] || key : key;
    for (const [name, text] of Object.entries(values)) value = value.replaceAll(`{${name}}`, String(text));
    return value;
}
function setLanguage(value) {
    language = value === 'en' ? 'en' : 'pt';
    document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';
    for (const record of textRecords) record.node.nodeValue = language === 'en' ? record.before + dictionary[record.key] + record.after : record.original;
    for (const record of attributeRecords) record.element.setAttribute(record.name, translate(record.original));
    for (const button of document.querySelectorAll('[data-language]')) button.setAttribute('aria-pressed', String(button.dataset.language === language));
    // No storage or history access is required in the opaque-origin iframe.
    if (parent === window) {
        const url = new URL(location.href);
        url.searchParams.set('lang', language);
        history.replaceState(null, '', url);
    }
    document.dispatchEvent(new CustomEvent('demo-language-change'));
}
window.demoI18n = { t: translate, get language() { return language; } };
for (const button of document.querySelectorAll('[data-language]')) button.addEventListener('click', () => setLanguage(button.dataset.language));
setLanguage(language);
