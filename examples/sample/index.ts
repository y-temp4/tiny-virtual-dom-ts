import { h, patch } from "../../src";

const $rootElement = document.getElementById("app");

var currentTree = h(
  "ul",
  null,
  h("li", { style: { color: "red" } }, "One"),
  h("li", { style: { color: "blue" } }, "Two"),
  h("li", { style: { color: "green" } }, "Three")
);

// first time
patch($rootElement, currentTree);

// wait 2 secs
setTimeout(() => {
  let nextTree = h(
    "ul",
    null,
    h("li", { style: { color: "red" } }, "One"),
    h("li", { style: { color: "orange" } }, "Two")
  );
  patch($rootElement, nextTree, currentTree);
  currentTree = nextTree;
}, 2000);

// wait 4 secs
setTimeout(() => {
  let nextTree = h(
    "ul",
    null,
    h("li", { style: { color: "purple" } }, "Hello"),
    h("li", { style: { color: "gray" } }, "Hi!")
  );
  patch($rootElement, nextTree, currentTree);
  currentTree = nextTree;
}, 4000);
