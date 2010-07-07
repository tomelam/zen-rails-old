dojo.provide("zen.tests.module");

try{
    doh.registerUrl("zen.tests.smalltalkish",
		    dojo.moduleUrl("zen", "tests/smalltalkish.html"), 99999999);
    dojo.require("zen.tests.object");
    dojo.require("zen.tests.rulesDB");
    dojo.require("zen.tests.domNode");
    doh.registerUrl("zen.tests.dojoWidget", dojo.moduleUrl(
    	"zen", "tests/dojoWidget.html"), 99999999);
    dojo.require("zen.tests.tree");
}catch(e){
    doh.debug(e);
}
