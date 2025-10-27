# **Nano-UI: Nano-Signals DOM**

## **Descripción General**
**Nano-UI** es una extensión del sistema de reactividad minimalista [`nano-signals.js`](./nano-signals.js), diseñado para facilitar la **manipulación reactiva del DOM** de manera declarativa y eficiente. Proporciona utilidades para enlazar señales reactivas con elementos del DOM, manejar eventos, renderizar listas y más, inspirado en bibliotecas como **SolidJS**, **Svelte** o **Vue**.

---

## **Características Principales**
- **Enlace reactivo con el DOM**: Vincula señales y valores computados a elementos del DOM.
- **Manejo de eventos**: Facilita la escucha de eventos y delegación de eventos.
- **Renderizado de listas**: Permite renderizar listas de elementos de forma reactiva.
- **Two-way data binding**: Sincronización bidireccional entre señales y elementos de formulario.
- **Utilidades para selección de elementos**: Funciones auxiliares para seleccionar elementos del DOM.
- **Store reactivo**: Crea un almacén de estado reactivo a partir de un objeto inicial.

---

## **API de Nano-Signals DOM**

### **1. Enlace de Señales al DOM**
#### **`bind(selector, signalOrComputed, render)`**
Enlaza una señal o valor computado a un elemento del DOM, utilizando una función de renderizado personalizada.

- **`selector`**: Selector CSS o elemento del DOM.
- **`signalOrComputed`**: Señal o valor computado a enlazar.
- **`render(el, value)`**: Función que renderiza el valor en el elemento.

**Ejemplo:**
```javascript
const name = signal("Mario");
bind("#name", name, (el, value) => {
  el.textContent = `Hola, ${value}`;
});
```

---

#### **`bindText(selector, signalOrComputed)`**
Enlaza una señal o valor computado al contenido de texto de un elemento.

**Ejemplo:**
```javascript
const greeting = signal("Hola, mundo");
bindText("#greeting", greeting);
```

---

#### **`bindHTML(selector, signalOrComputed)`**
Enlaza una señal o valor computado al contenido HTML de un elemento.

**Ejemplo:**
```javascript
const htmlContent = signal("<strong>Contenido HTML</strong>");
bindHTML("#content", htmlContent);
```

---

#### **`bindClass(selector, className, signalOrComputed)`**
Enlaza una señal o valor computado a una clase CSS de un elemento. La clase se aplica si el valor es `true`.

**Ejemplo:**
```javascript
const isActive = signal(true);
bindClass("#button", "active", isActive);
```

---

### **2. Manejo de Eventos**
#### **`on(selector, event, handler)`**
Agrega un escucha de eventos a un elemento del DOM.

**Ejemplo:**
```javascript
on("#button", "click", () => {
  console.log("Botón clickeado");
});
```

---

#### **`onDelegate(parentSelector, event, childSelector, handler)`**
Delega eventos a elementos hijos que coinciden con un selector, mejorando el rendimiento al evitar escuchas individuales.

**Ejemplo:**
```javascript
onDelegate("#list", "click", ".item", (e, target) => {
  console.log("Elemento clickeado:", target);
});
```

---

### **3. Renderizado de Listas**
#### **`list(selector, itemsSignal, renderItem)`**
Renderiza una lista de elementos de forma reactiva, basada en una señal de arreglo.

- **`itemsSignal`**: Señal que contiene un arreglo de elementos.
- **`renderItem(item)`**: Función que renderiza un elemento individual.

**Ejemplo:**
```javascript
const items = signal(["Manzana", "Banana", "Cereza"]);
list("#list", items, (item) => `<li>${item}</li>`);
```

---

### **4. Two-Way Data Binding**
#### **`model(selector, sig)`**
Crea un enlace bidireccional entre una señal y un elemento de formulario (como `<input>`, `<textarea>`, `<select>`).

**Ejemplo:**
```javascript
const username = signal("usuario123");
model("#username-input", username);
```

---

### **5. Utilidades para Selección de Elementos**
#### **`$(selector)`**
Selecciona el primer elemento que coincide con el selector.

**Ejemplo:**
```javascript
const button = $("#button");
```

---

#### **`$$(selector)`**
Selecciona todos los elementos que coinciden con el selector.

**Ejemplo:**
```javascript
const buttons = $$(".button");
```

---

### **6. Ejecución al Cargar el DOM**
#### **`mount(fn)`**
Ejecuta una función cuando el DOM está listo.

**Ejemplo:**
```javascript
mount(() => {
  console.log("DOM cargado");
});
```

---

### **7. Almacén de Estado Reactivo**
#### **`store(initialState)`**
Crea un almacén de estado reactivo a partir de un objeto inicial.

**Ejemplo:**
```javascript
const userStore = store({
  name: "Mario",
  age: 30
});
// Accede a las señales individuales:
userStore.name.value; // "Mario"
```

---

## **Ejemplo Completo**
```javascript
import { signal, computed } from './nano-signals.js';
import { bindText, bindClass, list, model, mount } from './nano-signals-dom.js';

// Estado reactivo
const todos = signal([
  { id: 1, text: "Aprender Nano-Signals", done: false },
  { id: 2, text: "Crear un proyecto", done: true }
]);

const newTodo = signal("");

// Computed: Todos pendientes
const pendingTodos = computed(() =>
  todos.value.filter(todo => !todo.done).length
);

// Renderiza la lista de todos
list("#todos", todos, (todo) => `
  <li class="${todo.done ? 'done' : ''}">
    ${todo.text}
    <button onclick="toggleTodo(${todo.id})">
      ${todo.done ? 'Deshacer' : 'Completar'}
    </button>
  </li>
`);

// Enlaza el contador de pendientes
bindText("#pending-count", computed(() => `Pendientes: ${pendingTodos.value}`));

// Enlaza el input para nuevos todos
model("#new-todo", newTodo);

// Añade un nuevo todo
mount(() => {
  $("#add-todo").addEventListener("click", () => {
    todos.value = [
      ...todos.value,
      { id: Date.now(), text: newTodo.value, done: false }
    ];
    newTodo.value = "";
  });
});

// Función para alternar el estado de un todo
window.toggleTodo = (id) => {
  todos.value = todos.value.map(todo =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  );
};
```

---

## **Casos de Uso**
- **Aplicaciones web reactivas**: Ideal para crear interfaces de usuario reactivas sin frameworks pesados.
- **Prototipado rápido**: Permite prototipar interfaces con estado reactivo de manera sencilla.
- **Integración con proyectos existentes**: Puede usarse junto a otras bibliotecas o frameworks.

---

## **Ventajas**
- **Tamaño reducido**: Código minimalista y fácil de integrar.
- **Rendimiento**: Actualizaciones eficientes gracias al sistema de reactividad subyacente.
- **Declarativo**: Sintaxis clara y expresiva para manipulación del DOM.

---

## **Limitaciones**
- **No es un framework completo**: Solo proporciona utilidades básicas para manipulación del DOM.
- **Sin manejo avanzado de eventos**: No incluye manejo de eventos complejos o ciclos de vida.

---

## **Posibles Mejoras**
- Añadir soporte para **animaciones reactivas**.
- Implementar **transiciones** para listas y elementos.
- Añadir **soporte para componentes** reutilizables.

---
