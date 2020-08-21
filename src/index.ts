import { isArray, isObject, head, merge } from "./helpers";

type Node = {
  tagName: string;
  props: Properties;
  children: Children;
};

type Properties = {
  [K in string]: Properties | string;
};

type Children = string[];

export function h(tagName: string, props: Properties, ...children: Children) {
  if (isArray(head(children))) {
    children = head(children);
  }
  return { tagName, props: props || {}, children };
}

function createElement(node: string | Node) {
  if (!isObject(node)) {
    return document.createTextNode(String(node));
  }
  const $el = document.createElement(node.tagName);
  applyProps($el, node.props);
  node.children.map((child) => $el.appendChild(createElement(child)));
  return $el;
}

function applyProps(
  $el: any,
  newProps: Properties | string,
  oldProps: Properties | string | undefined = {}
) {
  const props = merge(newProps, oldProps);
  Object.keys(props).map((name) => {
    const newValue = isObject(newProps) ? newProps[name] : newProps;
    const oldValue = isObject(oldProps) ? oldProps[name] : oldProps;
    if (isObject(newValue)) {
      applyProps($el[name], newValue, oldValue);
      return;
    }
    if (!newValue) {
      removeProp($el, name);
    } else if (newValue !== oldValue) {
      setProp($el, name, newValue);
    }
  });
}

function setProp($el: any, name: string, value: string) {
  if (name === "className") {
    $el.setAttribute("class", value);
  } else {
    $el[name] = value;
  }
}

function removeProp($el: any, name: string) {
  if (name === "className") {
    $el.removeAttribute("class");
  } else {
    $el[name] = null;
    delete $el[name];
  }
}

export function patch(
  $parent: HTMLElement | ChildNode,
  newTree: Node | string | undefined,
  oldTree: Node | string | undefined,
  index = 0
) {
  if (!oldTree && newTree) {
    $parent.appendChild(createElement(newTree));
  }
  if (!newTree) {
    removeChildren($parent, index);
  } else if (changed(newTree, oldTree)) {
    $parent.replaceChild(createElement(newTree), $parent.childNodes[index]);
  } else if (isObject(newTree) && isObject(oldTree)) {
    applyProps($parent.childNodes[index], newTree.props, oldTree.props);
    patchNodes($parent, newTree, oldTree, index);
  }
}

function removeChildren($parent: HTMLElement | ChildNode, index: number) {
  let times = ($parent.childNodes.length || 0) - index;
  while (times-- > 0) {
    if ($parent.lastChild) {
      $parent.removeChild($parent.lastChild);
    }
  }
}

function changed(a: any, b: any) {
  return (
    typeof a !== typeof b || (!isObject(a) && a !== b) || a.type !== b.type
  );
}

function patchNodes(
  $parent: HTMLElement | ChildNode,
  newTree: Node,
  oldTree: Node,
  index: number
) {
  const len = Math.max(newTree.children.length, oldTree.children.length);
  let i = -1;
  while (++i < len) {
    patch(
      $parent.childNodes[index],
      newTree.children[i],
      oldTree.children[i],
      i
    );
  }
}
