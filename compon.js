console.debug("Providing zen.compon");
dojo.provide("zen.compon");



////
//// DEBUGGING FACILITIES
////
//// Debug Levels, by Convention Only
//// 0 = off
//// 1 = group, groupEnd, dir (maybe these should be 5)
//// 2 = error
//// 3 = warn
//// 4 = info
//// 5 = debug
//// 6 = log
var d = 0; // Off.
zen.log = console.log;
zen.debug = console.debug;
zen.info = console.info;
zen.warn = console.warn;
zen.error = console.error;
zen.group = console.group;
zen.groupEnd = console.groupEnd;
zen.dir = console.dir;


////
//// GENERIC COMPONENT HANDLING
////
//FIXME: Use this function where useful.
zen.createCompon = function(treeSpec) {
    var rule, constructor,
	componKind = treeSpec[0],
	rule = zen.invertedRulesTable[componKind],        
	initParms = treeSpec[1];
    constructor = zen.rule2ref(rule);
    return constructor.call(document, componKind, initParms);
};

zen.walkZen = function(compon, func) {
    func(compon);
    dojo.forEach(compon.getChildCompons(),
		 function(child) {
		     zen.walkZen(child, func);
		 });
};


////
//// COMPONENT CREATION RULES
////
// Each property of rulesTable is the name of a rule
// (i.e. method) for creating a kind of component. The value
// of each property is the set (an array) of the kinds of
// component that can be created using the rule.
zen.rulesTable = {
    createElement : [ "div", "table", "tr", "td", "p", "span",
		      "center", "br" ],
    createDijit   : [ "dijit.layout.ContentPane",
		      "dijit.layout.BorderContainer",
		      "dijit.layout.AccordionContainer",
		      "dijit.layout.AccordionPane", //FIXME: deprecated
		      "dijit.DialogUnderlay",
		      "dijit.form.Button",
		      "dojox.layout.FloatingPane" //FIXME: deprecated
		    ],
    createTextNode : [ "text" ]
};

// This is a table for looking up a rule given a component
// name as a key. We fill it up by immediately calling
// initIRT.
zen.invertedRulesTable = {};

zen.initIRT = function() {
    var components, c, rule, len;
    for (rule in zen.rulesTable) {
	components = zen.rulesTable[rule];
	len = components.length;
	for (c=0; c<len; c++) {
	    zen.invertedRulesTable[components[c]] = rule;
	};
    };
};

// FIXME: eval is not cool here. FaceBook and MySpace, for
// example, won't allow it in included JavaScript. See
// http://www.dojotoolkit.org/reference-guide/dojo/_base/json.html
// for a safe way to evaluate JSON strings.
zen.rule2ref = function(rule) {
    var s;
    for (s in zen.shortcutsTable) {
	if (s == rule) {
	    //return eval(zen.shortcutsTable[rule]);
	    return dojo.fromJson(zen.shortcutsTable[rule]);
	}
    }
    //return eval(rule);
    return dojo.fromJson(rule)
};

// These shortcuts make it easy to specify methods for creating
// various kinds of components.
zen.shortcutsTable = {
    createElement : zen.createElement,
    createTextNode : document.createTextNode,
    createDijit : zen.createDijit
};
