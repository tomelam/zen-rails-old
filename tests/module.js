dojo.provide("zen.tests.module");

try{
    dojo.require("zen.tests.object");
    dojo.require("zen.tests.rulesDB");
    dojo.require("zen.tests.domNode");
    //dojo.require("zen.tests.dojoWidget");
    doh.registerUrl("zen.tests.dojoWidget", dojo.moduleUrl("zen", "tests/dojoWidget.html"), 99999999);
    dojo.require("zen.tests.tree");
}catch(e){
    doh.debug(e);
}
