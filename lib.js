export function h(tagName, attributes, children) {
  const el = document.createElement(tagName);
  for (let [key, value] of Object.entries(attributes)) {
    if (key.match(/^on/)) {
      el.addEventListener(key.substring(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  }
  if (typeof children === "string") {
    el.appendChild(document.createTextNode(children));
  } else if (Array.isArray(children)) {
    for (let child of children) {
      el.appendChild(child);
    }
  } else if (children) {
    el.appendChild(children);
  }
  return el;
}

export function component(renderFunc) {
  return function (props, children) {
    let el;
    function rerender() {
      let newEl = renderFunc(props, children, rerender);
      el.replaceWith(newEl);
      el = newEl;
    }

    el = renderFunc(props, children, rerender);
    return el;
  };
}
