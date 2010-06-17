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
//// DOM NODE HANDLING
////
zen.DomNodeCompon = function(element) {
    this.domNode = element;
    this.stringRep = "[zen.DomNodeCompon " + this.domNode + "]";
    this.children = [];
    this.toString = function () { // Without this, we get '[object Object]'.
	return "[zen.DomNodeCompon " +
	    String(this.domNode).replace(/^\[object /,"").replace(/\]$/,"") +
	    "]";
    };
    this.appendMyselfToParent = function (parent) {
	if(d>4)zen.debug("* DomNodeCompon.appendMyselfToParent: domNode => " +
			 this.domNode + ", parent => " + parent);
	parent.appendChild(this);
    };
    this.appendChild = function (child) {
	if(d>4)zen.debug("* DomNodeCompon.appendChild: child => " +
			 child + ", this => " + this);
	this.domNode.appendChild(child.getDomNode());
	this.children.push(child);
    };
    this.getDomNode = function () {
	if(d>4)zen.debug("* DomNodeCompon.getDomNode: domNode => " +
			 this.domNode);
	return this.domNode;
    };
    this.getChildCompons = function () { //FIXME: WORKING ON THIS: WAS BROKEN!
	return this.children;
	var domNode = this.domNode;
	if(d>4)zen.debug("* zen.DomNodeCompon.getChildCompons: domNode => " +
			 domNode);
	return dojo.map(domNode.children,
			function(c) {
			    var w = dijit.byNode(c);
			    //return w || c;
			    return w ||
				zen.DomNodeCompon.fromDomNode(c);
			});
    };
    this.destroyCompon = function() {
	var compon, index, lengthBefore, lengthAfter;
	if(d>4)zen.debug("* zen.DomNodeCompon.destroyCompon: this => " + this +
			 ", domNode => " + this.domNode);
	dojo.forEach(this.getChildCompons(),
		     function(child) {
			 child.destroyCompon();
		     });
	dojo.destroy(this.domNode);
	index = zen.DomNodeCompon.allDomNodeCompons.indexOf(this);
	zen.info("index => " + index);
	if (index < 0) {
	    console.group("Looking for " + this + " in list");
	    console.dir(this);
	    console.groupEnd();
	    throw new Error("Exception: couldn't find DomNodeCompon in list.");
	} else {
	    if (index == (zen.DomNodeCompon.allDomNodeCompons.length - 1)) {
		zen.info("Deleted compon is last; won't replace!");
		lengthBefore = zen.DomNodeCompon.allDomNodeCompons.length;
		zen.info("length before pop => " + lengthBefore);
 		//delete zen.DomNodeCompon.allDomNodeCompons[index];
		zen.DomNodeCompon.allDomNodeCompons.pop();
		lengthAfter = zen.DomNodeCompon.allDomNodeCompons.length;
		zen.info("length after pop => " + lengthAfter);
		if (lengthBefore == lengthAfter) {
		    throw new Error("Exception! Length should reduce.");
		};
	    } else {
		zen.info("Deleted compon is *NOT* last; will replace!");
		lengthBefore = zen.DomNodeCompon.allDomNodeCompons.length;
		zen.info("length before deletion => " + lengthBefore);
 		delete zen.DomNodeCompon.allDomNodeCompons[index];
		lengthAfter = zen.DomNodeCompon.allDomNodeCompons.length;
		zen.info("length after deletion => " + lengthAfter);
 		zen.DomNodeCompon.allDomNodeCompons[index] =
		    zen.DomNodeCompon.allDomNodeCompons.pop();
		zen.dir(zen.DomNodeCompon.allDomNodeCompons);
		lengthAfter = zen.DomNodeCompon.allDomNodeCompons.length;
		zen.info("length after replacement => " + lengthAfter);
		if (lengthBefore == lengthAfter) {
		    throw new Error("Exception! Length should reduce.");
		};
	    };
	};
    };
    zen.DomNodeCompon.allDomNodeCompons.push(this);
    console.group("Pushed " + this + " onto list");
    console.dir(this);
    console.groupEnd();
    index = zen.DomNodeCompon.allDomNodeCompons.indexOf(this);
    console.debug("index => " + index);
};

// Singletons.
zen.DomNodeCompon.allDomNodeCompons = [];
zen.DomNodeCompon.fromDomNode = function (node) {
    var index = 0, compon, len; // = zen.domNodeCompons.length;
    var allDomNodeCompons;
    if(d>4)zen.debug("* zen.DomNodeCompon.fromDomNode: len => " + len +
		     ", node => " + node);
    /*
    allDomNodeCompons = canvas.rootCompons.domNodeCompons.concat(
	toolbars.rootCompons.domNodeCompons);
    */
    allDomNodeCompons = zen.DomNodeCompon.allDomNodeCompons;
    len = allDomNodeCompons.length;
    for (index; index<len; index++) {
	compon = allDomNodeCompons[index];
	if(d>4)zen.debug("* ...fromDomNode: index => " + index +
			 ", compon => " + compon +
			 ", allDomNodeCompons.length => " +
			 allDomNodeCompons.length);
	if (compon.domNode == node) {
	    if(d>4)zen.debug("* ...fromDomNode: returning compon " + compon);
	    return compon;
	};
    };
    if(d>4)zen.error("* ...fromDomNode: returning null, node => " +
		     node + ", index => " + index);
    return null;
};

// Create a component that refers to an HTML text node or HTML
// element. This avoids some conflict with Dojo that results when
// trying to use prototype.js to add methods to an element. It also is
// more future proof since an element can be handled in a clean way.
//
// FIXME: Can text nodes have attributes?
zen.createTextNode = function(text, attributes) {
    var domNodeCompon = createNew(zen.DomNodeCompon);
    if(d>4)zen.debug("* zen.createTextNode: text => " + text +
		  ", attributes => " + attributes);
    // FIXME: Use dojo.create, if appropriate.
    var domNode = document.createTextNode(text);
    if(d>4)zen.debug("* zen.createTextNode: domNode => " + domNode);
    domNodeCompon.domNode = domNode;
    return domNodeCompon;
};

//FIXME: compon.toString() prints "[object HTMLSpanElement]" for the
//CENTER element.
zen.createElement = function(kind, attributes) {
    var domNodeCompon = createNew(zen.DomNodeCompon);
    if(d>4)zen.debug("* zen.createElement: kind => " + kind +
		  ", attributes => " + attributes);
    if (attributes && attributes.id) {
	if (dijit.byId(attributes.id) != null) {
	 throw new Error(
	 "Exception: zen.createElement: Dojo widget already exists w/ id => "+
	 attributes.id + ", kind => " + kind);
	};
	if (dojo.byId(attributes.id) != null) {
	throw new Error(
	"Exception: zen.createElement: HTML element already exists w/ id => "+
	attributes.id + ", kind => " + kind);
	};
    };
    // FIXME: Use dojo.create.
    var domNode = document.createElement(kind);
    if(d>4)zen.debug("* zen.createElement: domNode => " + domNode);
    dojo.attr(domNode, attributes || {}); //FIXME: Check this.
    domNodeCompon.domNode = domNode;
    return domNodeCompon;
};


////
//// DOJO WIDGET HANDLING
////
zen.startup = function(widgetCompons) {
    // Start up all the Dojo widgets. The order is important.
    if(d>4)zen.debug("* zen.startup: starting up widgets");
    //FIXME: Previously, we used zen.widgets in place of
    //widgetCompons, which was pushed to in zen.createDijit.
    dojo.forEach(widgetCompons.reverse(),
		 function(w) {
		     if(d>4)zen.debug("* starting up " + w);
		     w.startup(); }
		);
};

//FIXME: widgets have not been defined in terms of a Zen constructor.
//FIXME: See http://higginsforpresident.net/2010/01/widgets-within-widgets/
//
// Zen.createDijit does not allow a dijit to be built on a
// passed-in HTML element node. Instead, the dijit constructor is
// called without reference to a node, thus causing it to create a
// root node on the fly. The dijit can be added to a parent
// component afterwards.
zen.createDijit = function(klass, initParms, rootNode) {
    if(d>4)zen.debug("zen.dojo.createDijit, klass => " + klass);
    var node = null;
    var widget;
    dojo.require(klass);
    if (rootNode) {
	node = rootNode.domNode;
    };
    //NOTE: We don't use console.assert because it won't throw in Firebug Lite.
    if (initParms && initParms.id) {
	if (dijit.byId(initParms.id) != null) {
	  throw new Error(
	  "Exception: zen.createDijit: Dojo widget already exists w/ id => "+
	  initParms.id + ", klass => " + klass);
	};
	if (dojo.byId(initParms.id) != null) {
	  throw new Error(
	  "Exception: zen.createDijit: HTML element already exists w/ id => "+
	  initParms.id + ", klass => " + klass);
	};
    };
    widget = createNew(zen.rule2ref(klass), initParms, node);
    if (!widget) {
	throw new Error("Exception: zen.createDijit: dijit creation failed");
    }
    if(d>4)zen.debug("widget => " + widget);
    widget.isDojoWidget = true; // FIXME: Dumb.
    widget.kind = klass;
    widget.children = [];
    widget.getDomNode = function() {
	if(d>4)zen.debug("widget.getDomNode: domNode => " + widget.domNode);
	return widget.domNode;
    };
    widget.getChildCompons = function() {
	return widget.children;
    };
    widget.appendMyselfToParent = function(parent) {
	//FIXME: See the placeat method in _Widget.js.
	if(d>4)zen.debug("appendMyselfToParent: widget => " + widget +
		      ", parent => " + parent);
	if (parent.isDojoWidget) {
	    if(d>4)zen.debug("widgetp.addChild(widgetc), widgetp => " +
			  parent + ", widgetc => " + widget);
	    parent.children.push(widget);
	    return parent.addChild(widget);       // parent is Dojo widget
	} else {
	    if(d>4)zen.debug("domNode.appendChild(widget.domNode)");
	    return parent.appendChild(widget);    // parent is not Dojo widget
	};
    };
    widget.appendChild = function(child) {
	if(d>4)zen.debug("widget.appendChild: child => " + child);
	if (child.isDojoWidget) {
	    if(d>4)zen.debug("widget.appendChild(widget)");
	    widget.children.push(child);
	    return widget.addChild(child);        // child is Dojo widget
	} else {
	    if(d>4)zen.debug("widget.appendChild(domNode)");
	    if (widget.children.length > 0) {
		if(d>2)zen.warn(
		    "A widget can have only one child if it's only HTML.");
	    }
	    widget.children = [child];
	    return widget.setContent(child.domNode); // child isn't Dojo widget
	};
    };
    widget.destroyCompon = function() {
	var compon, index;
	if(d>4)zen.debug("* widget.destroyCompon: widget => " + widget +
		  ", domNode => " + widget.domNode);
	dojo.forEach(widget.getChildCompons(),
		     function(child) {
			 child.destroyCompon();
		     });
	widget.destroy();
    };
    return widget;
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
