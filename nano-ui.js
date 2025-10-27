import { signal, computed, effect, batch } from './nano-signals.js';

export { signal, computed, effect, batch };

export function bind(selector, signalOrComputed, render) {
  const el = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!el) throw new Error(`Elemento no encontrado: ${selector}`);

  effect(() => {
    const value = signalOrComputed.value;
    render(el, value);
  });
}

export function bindText(selector, signalOrComputed) {
  bind(selector, signalOrComputed, (el, value) => {
    el.textContent = value;
  });
}

export function bindHTML(selector, signalOrComputed) {
  bind(selector, signalOrComputed, (el, value) => {
    el.innerHTML = value;
  });
}

export function bindClass(selector, className, signalOrComputed) {
  bind(selector, signalOrComputed, (el, condition) => {
    el.classList.toggle(className, condition);
  });
}

export function on(selector, event, handler) {
  const el = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!el) throw new Error(`Elemento no encontrado: ${selector}`);
  el.addEventListener(event, handler);
}

export function list(selector, itemsSignal, renderItem) {
  bindHTML(selector, computed(() => {
    return itemsSignal.value.map(renderItem).join('');
  }));
}

export function onDelegate(parentSelector, event, childSelector, handler) {
  const parent = typeof parentSelector === 'string'
    ? document.querySelector(parentSelector)
    : parentSelector;

  if (!parent) throw new Error(`Elemento no encontrado: ${parentSelector}`);

  parent.addEventListener(event, (e) => {
    const target = e.target.closest(childSelector);
    if (target) handler(e, target);
  });
}

export function model(selector, sig) {
  const el = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!el) throw new Error(`Elemento no encontrado: ${selector}`);

  effect(() => {
    if (el.value !== sig.value) {
      el.value = sig.value;
    }
  });

  el.addEventListener('input', () => {
    sig.value = el.value;
  });
}

export function mount(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

export function $(selector) {
  return document.querySelector(selector);
}

export function $$(selector) {
  return document.querySelectorAll(selector);
}

export function store(initialState) {
  const state = {};
  for (const [key, value] of Object.entries(initialState)) {
    state[key] = signal(value);
  }
  return state;
}