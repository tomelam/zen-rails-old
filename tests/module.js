dojo.provide("zen.tests.module");

try {
    dojo.require("zen.tests.object");
    dojo.require("zen.tests.element");
    dojo.require("zen.tests.component");
    dojo.require("zen.tests.tree");
} catch(e) {
    console.debug("Exception: " + e);
};
