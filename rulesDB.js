dojo.provide("zen.rulesDB");
dojo.require("zen.object");

////
//// RULES DATABASES
////

//FIXME: Use this function where useful.
zen.createCompon = function(treeSpec) {
    var rule, constructor,
	componKind = treeSpec[0],
	rule = zen.invertedRulesTable[componKind],
	initParms = treeSpec[1];
    constructor = zen.rule2ref(rule);
    //console.debug("zen.createCompon: constructor => " + constructor);
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
zen.rulesTable = {};
zen.rulesTable.addRule = function(rule) {
    dojo.mixin(zen.rulesTable, rule);
};

// This is a table for looking up a rule given a component
// name as a key. We fill it up by immediately calling
// initIRT.
zen.invertedRulesTable = {};
// Get a reference to a prototype function, given a rule.
//
// NOTE: Eval would not be cool here. FaceBook and MySpace, for
// example, won't allow it in included JavaScript. See
// http://www.dojotoolkit.org/reference-guide/dojo/_base/json.html for
// a safe way to evaluate JSON strings.
//
// Get a reference in place of the argument, which is, or will be
// immediately converted to, a string. The dojo.fromJson()
// function safely evaluates the string and produces a JavaScript
// reference to a function. (The JavaScript function eval()
// could do the same thing as dojo.fromJson(), but not safely:
// it will execute arbitrary code, not just JSON code.)
zen.rule2ref = function(rule) {
    var shortcut;
    //console.debug("zen.rule2ref(" + dojo.toJson(rule) + ")");
    // First, look for the rule in the table of shortcuts.
    for (shortcut in zen.shortcutsTable) {
	if (shortcut == rule) {
	    // Found it! Use it to get a long-form reference.
	    //console.debug("shortcut; returning " + zen.shortcutsTable[rule]);
	    return dojo.fromJson(zen.shortcutsTable[rule]);
	};
    };
    //console.debug("no shortcut; returning " + rule);
    // The rule is not in the table of shortcuts. Just evaluate the
    // string (safely) to get a reference in place of the string.
    return dojo.fromJson(rule);
};

// These shortcuts make it easy to specify methods for creating
// various kinds of components.
zen.shortcutsTable = {};
zen.shortcutsTable.addShortcut = function(shortcut) {
    dojo.mixin(zen.shortcutsTable, shortcut);
};

zen.invertedRulesTable.init = function() {
    var components, index, rule, len;
    for (rule in zen.rulesTable) {
	components = zen.rulesTable[rule];
	len = components.length;
	for (index=0; index<len; index++) {
	    zen.invertedRulesTable[components[index]] = rule;
	};
    };
};