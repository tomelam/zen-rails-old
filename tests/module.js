dojo.provide("zen.tests.module");

try {
    //dojo.require("zen.tests.object");
    //dojo.require("zen.tests.rulesDB");
    dojo.require("zen.tests.domNode");
    dojo.require("zen.tests.dojoWidget");
    //dojo.require("zen.tests.tree");
    dojo.registerUrl("zen.tests.AccordionContainer",
		     dojo.moduleUrl("zen", "tests/AccordionContainer.html"),
		     99999999);
    dojo.debug("Finishing load of module.js");
								     
} catch(e) {
    console.debug("Exception: " + e);
};
