var zen = {};


////
//// DEBUGGING FACILITIES
////
//// Debug Levels, by Convention
//// 0 = off
//// 1 = group, groupEnd, dir (maybe these should be 5)
//// 2 = error
//// 3 = warn
//// 4 = info
//// 5 = debug
//// 6 = log
//zen.debugLevel = 0; // Off.
var d = 5; // Off.
zen.log = console.log;
zen.debug = console.debug;
zen.info = console.info;
zen.warn = console.warn;
zen.error = console.error;
zen.group = console.group;
zen.groupEnd = console.groupEnd;
zen.dir = console.dir;


/*
////FIXME: Create these functions programmatically to save code.
// For verbose logging: log everything, virtually all activity.
zen.log = function() {
    if (zen.debugLevel > 5) {
	var args = Array.prototype.slice.call(arguments); // Get a real array.
	console.log.apply(null, args);
    };
};

// For detailed debugging.
zen.debug = function() {
    if (zen.debugLevel > 4) {
	var args = Array.prototype.slice.call(arguments); // Get a real array.
	console.debug.apply(null, args);
    };
};

// Useful information.
zen.info = function() {
    if (zen.debugLevel > 3) {
	var args = Array.prototype.slice.call(arguments); // Get a real array.
	console.info.apply(null, args); 
   };
};

// We should keep an eye on any messages this prints.
zen.warn = function() {
    if (zen.debugLevel > 2) {
	var args = Array.prototype.slice.call(arguments); // Get a real array.
	console.warn.apply(null, args);
    };
};

// Something is definitely wrong if these messages are printed.
zen.error = function() {
    if (zen.debugLevel > 1) {
	var args = Array.prototype.slice.call(arguments); // Get a real array.
	console.error.apply(null, args);
    };
};

zen.group = function() {
    if (zen.debugLevel > 0) {
	var args = Array.prototype.slice.call(arguments); // Get a real array.
	console.group.apply(null, args);
    };
};

zen.groupEnd = function() {
    if (zen.debugLevel > 0) {
	var args = Array.prototype.slice.call(arguments); // Get a real array.
	console.groupEnd.apply(null, args);
    };
};

zen.dir = function() {
    if (zen.debugLevel > 0) {
	var args = Array.prototype.slice.call(arguments); // Get a real array.
	console.dir.apply(null, args);
    };
};
*/


////
//// CONSTRUCTORS
////
zen.TreeCompons = function() {
    this.domNodeCompons = [];
    this.widgets = [];
};

//FIXME: widgets have not been defined in terms of a Zen constructor.
zen.Tree = function() {
    this.topCompon = null;
    this.treeCompons = [];
}


////
//// GENERIC COMPONENT HANDLING
////
//FIXME: Use this function where useful.
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
	//return "[zen.DomNodeCompon " + this.domNode + "]";
	return "[zen.DomNodeCompon " +
	    String(this.domNode).replace(/^\[object /,"").replace(/\]$/,"") +
	    "]";
    };
    this.appendMyselfToParent = function (parent) {
	zen.debug("* DomNodeCompon.appendMyselfToParent: domNode => " +
		      this.domNode + ", parent => " + parent);
	parent.appendChild(this);
    };
    this.appendChild = function (child) {
	zen.debug("* DomNodeCompon.appendChild: child => " +
		      child + ", this => " + this);
	this.domNode.appendChild(child.getDomNode());
	this.children.push(child);
    };
    this.getDomNode = function () {
	zen.debug("* DomNodeCompon.getDomNode: domNode => " + this.domNode);
	return this.domNode;
    };
    this.getChildCompons = function () { //FIXME: WORKING ON THIS: WAS BROKEN!
	return this.children;
	var domNode = this.domNode;
	zen.debug("* zen.DomNodeCompon.getChildCompons: domNode => " +
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
	var compon, index;
	zen.debug("* zen.DomNodeCompon.destroyCompon: this => " + this +
		      ", domNode => " + this.domNode);
	dojo.forEach(this.getChildCompons(),
		     function(child) {
			 child.destroyCompon();
		     });
	dojo.destroy(this.domNode);
    };
}

zen.DomNodeCompon.fromDomNode = function (node) {
    var index = 0, compon, len; // = zen.domNodeCompons.length;
    var allDomNodeCompons;
    zen.debug("* zen.DomNodeCompon.fromDomNode: len => " + len +
	      ", node => " + node);
    allDomNodeCompons = canvas.topCompons.domNodeCompons.concat(
	toolbars.topCompons.domNodeCompons);
    len = allDomNodeCompons.length;
    for (index; index<len; index++) {
	compon = allDomNodeCompons[index];
	zen.debug("* ...fromDomNode: index => " + index +
		  ", compon => " + compon +
		  ", allDomNodeCompons.length => " +
		  allDomNodeCompons.length);
	if (compon.domNode == node) {
	    zen.debug("* ...fromDomNode: returning compon " + compon);
	    return compon;
	};
    };
    if(d>1)zen.error("* ...fromDomNode: returning null, node => " +
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
    //if(d>4)zen.debug("* zen.createTextNode: # of domNodeCompons => " +
    //		  zen.domNodeCompons.length);
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
	 "Exception: zen.createElement: Dojo widget already exists with id => "+
	 attributes.id + ", kind => " + kind);
	};
	if (dojo.byId(attributes.id) != null) {
	throw new Error(
	"Exception: zen.createElement: HTML element already exists with id => "+
	attributes.id + ", kind => " + kind);
	};
    };
    // FIXME: Use dojo.create.
    var domNode = document.createElement(kind);
    if(d>4)zen.debug("* zen.createElement: domNode => " + domNode);
    //zen.domNodeCompons.push(domNodeCompon);
    //if(d>4)zen.debug("* zen.createElement: # of domNodeCompons => " +
    //		  zen.domNodeCompons.length);
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
		     //if(d>4)zen.debug("* starting up " + w);
		     w.startup(); }
		);
};

// Zen.createDijit does not allow a dijit to be built on a
// passed-in HTML element node. Instead, the dijit constructor is
// called without reference to a node, thus causing it to create a
// top node on the fly. The dijit can be added to a parent
// component afterwards.
zen.createDijit = function(klass, initParms, topNode) {
    if(d>4)zen.debug("zen.dojo.createDijit, klass => " + klass);
    var node = null;
    var widget;
    dojo.require(klass);
    if (topNode) {
	node = topNode.domNode;
    };
    //NOTE: We don't use console.assert because it won't throw in Firebug Lite.
    if (initParms && initParms.id) {
	if (dijit.byId(initParms.id) != null) {
	  throw new Error(
	  "Exception: zen.createDijit: Dojo widget already exists with id => " +
	  initParms.id + ", klass => " + klass);
	};
	if (dojo.byId(initParms.id) != null) {
	  throw new Error(
	  "Exception: zen.createDijit: HTML element already exists with id => "+
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
	    return parent.addChild(widget);         // parent is Dojo widget
	} else {
	    if(d>4)zen.debug("domNode.appendChild(widget.domNode)");
	    return parent.appendChild(widget);      // parent is not Dojo widget
	};
    };
    widget.appendChild = function(child) {
	if(d>4)zen.debug("widget.appendChild: child => " + child);
	if (child.isDojoWidget) {
	    if(d>4)zen.debug("widget.appendChild(widget)");
	    widget.children.push(child);
	    return widget.addChild(child);           // child is Dojo widget
	} else {
	    if(d>4)zen.debug("widget.appendChild(domNode)");
	    if (widget.children.length > 0) {
		if(d>2)zen.warn(
		    "A widget can have only one child if it's only HTML.");
	    }
	    widget.children = [child];
	    return widget.setContent(child.domNode); // child is not Dojo widget
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
    //zen.widgets.push(widget);
    return widget;
};


////
//// TREE HANDLING
////
zen.renderTree = function(treeSpec, parent) {
    var zenTree;
    if(d>3)zen.info("##### ENTER: zen.renderTree #####");
    zenTree = zen.createSubtree(treeSpec);
    if(d>4)zen.debug("* Created zenTree");
    if(d>0)zen.dir(zenTree);
    if(d>4)zen.debug("##### zen.renderTree: zenTree => " + zenTree);
    zenTree.topCompon.appendMyselfToParent(parent);
    if(d>4)zen.debug("* Appended new tree to parent");
    if(d>0)zen.dir(zenTree);
    zen.startup(zenTree.treeCompons.widgets);
    if(d>3)zen.info("##### EXIT: zen.renderTree #####");
    if(d>0)zen.dir(zenTree);
    return zenTree;
};

zen.createSubtree = function(treeSpec) {
    var index, rule, topCompon, newCompon, len, constructor,
	treeCompons = createNew(zen.TreeCompons),
        zenTree = createNew(zen.Tree),
	componKind = treeSpec[0],
	initParms = treeSpec[1],
	subtreeSpec = treeSpec[2];
    rule = zen.invertedRulesTable[componKind];
    if(d>4)zen.debug("* ENTER zen.createSubtree: rule => " + rule +
		  ", componKind => " + componKind);
    constructor = zen.rule2ref(rule);
    topCompon = constructor.call(document, componKind, initParms);
    zenTree.topCompon = topCompon;
    if(d>4)zen.debug("* zen.createSubtree: topCompon => " + topCompon);
    len = subtreeSpec.length;
    for (index=0; index<len; index++) {
	newCompon = zen.createSubtree(subtreeSpec[index]).topCompon;
	newCompon.appendMyselfToParent(topCompon);
	if (newCompon.isDojoWidget) {
	    treeCompons.widgets.push(newCompon);
	} else {
	    treeCompons.domNodeCompons.push(newCompon);
	};
    };
    zenTree.treeCompons = treeCompons;
    if(d>4)zen.debug("* EXIT zen.createSubtree, topCompon => " + topCompon);
    if(d>0)zen.dir(zenTree);
    return zenTree;
};

//FIXME: Maybe we could think up a good scheme for which components to
//save and which to destroy.
zen.clearTheCanvas = function (componsToDestroy, componsToSave) {
    if (typeof componsToSave == 'undefined' || !componsToSave) {
	componsToSave = null;
    };
    if(d>4)zen.debug("* Entering zen.clearTheCanvas, destroying compons " +
		  componsToDestroy + " except for " + componsToSave);
    if(d>4)zen.debug("* componsToDestroy.length => " + componsToDestroy.length);
    dojo.forEach(componsToDestroy,
		 function(compon) {
		     if(d>4)zen.debug("*** compon => " + compon);
		 });
    if(d>4)zen.debug("* Destroying");
    dojo.forEach(componsToDestroy,
		 function(compon) {
		     if(d>4)zen.debug("compon => " + compon);
		     if (!componsToSave ||
			 (componsToSave.indexOf(compon) < 0)) {
			 compon.destroyCompon();
		     };
		 });
    if(d>4)zen.debug("* Exiting zen.clearTheCanvas");
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


////
//// TREE DIAGRAMS
////
zen.diagramTree = function(newComponent) {
    var tblCompon, contentBox, floatingPaneContent;
    var diagramPaneCompon, floatingPane;
    if(d>3)zen.info("##### ENTER: zen.diagramTree #####");
    if(d>4)zen.debug("##### dojo.byId('diagramPane') => " +
	      dojo.byId("diagramPane"));
    zen.clearTheHierarchyDiagram();
    tblCompon = zen.createElement("table",
				  {id:"componTbl",class:"boxTable"});
    if(d>4)zen.debug("* tblCompon => " + tblCompon +
	      ", tblCompon.domNode => " + tblCompon.domNode);
    diagramPaneCompon = createNew(zen.DomNodeCompon,
				  dojo.byId("diagramPane"));
    if(d>4)zen.debug("* diagramPaneCompon => " + diagramPaneCompon);
    dojo.require("dijit._base");
    floatingPane = dijit.byId("diagramPane");
    if (!floatingPane) {
	floatingPane = zen.createDijit(
	    "dojox.layout.FloatingPane",
	    {title:"Hierarchy of Web Page Components",
	     style:{backgroundColor:"yellow", zIndex:"10"},
	     resizable:true},
	    diagramPaneCompon);
    };
    if(d>4)zen.debug("* Appended diagramPaneCompon");
    tblCompon.appendMyselfToParent(floatingPane);
    if(d>4)zen.debug("* Appended tblCompon");
    zen.boxTable([newComponent], tblCompon);
    if(d>4)zen.debug("* Created boxTable");
    contentBox = dojo.contentBox("componTbl");
    if(d>4)zen.debug("* Got contentBox => " + contentBox);
    floatingPane.startup();
    if(d>4)zen.debug("* Started up floatingPane");
    floatingPane.resize({t:30, l:30, w:contentBox.w+5, h:contentBox.h+31});
    if(d>4)zen.debug("* Resized floatingPane");
    floatingPaneContent = dojo.query(
	"#diagramPane.dojoxFloatingPane > .dojoxFloatingPaneCanvas > .dojoxFloatingPaneContent")[0];
    if(d>4)zen.debug("* floatingPaneContent => " + floatingPaneContent);
    dojo.addClass(floatingPaneContent,"zenDiagramFloatingPaneContent");
    if(d>3)zen.info("##### EXIT: zen.diagramTree #####");
    return floatingPane;
};

//FIXME: Use dojo.create.
zen.boxCompon = function(component, tbl) {
    if(d>4)zen.debug("* ENTER zen.boxCompon");
    var row = zen.createElement("tr");
    var cell = zen.createElement("td", {class:"boxTD1"});
    var div = zen.createElement("div", {class:"visualRep"});
    if(d>4)zen.debug("* zen.boxCompon: createTextNode " + component);
    var text = zen.createTextNode("" + component);
    if(d>4)zen.debug("* zen.boxCompon: createTextNode done, call dojo.attr");
    dojo.attr(cell.domNode, "mouseover",
	      function() {
		  var domNode = component.getDomNode();
		  if(d>4)zen.debug("* zen.boxCompon: component => " + component +
			    ", domNode => " + domNode +
			    ", childNodes => " +
			    domNode.childNodes);
		  domNode.savedBackgroundColor = dojo.style(
		      domNode, "backgroundColor");
		  dojo.style(
		      domNode,
		      {backgroundColor:"lightblue"});
		  dojo.forEach(
		      domNode.childNodes,
		      function(n) {
			  dojo.addClass(n,"invisible");
		      });
	      });
    dojo.attr(cell.domNode, "mouseout",
	      function() {
		  var domNode = component.getDomNode();
		  dojo.style(domNode, "backgroundColor",
			     domNode.savedBackgroundColor);
		  dojo.forEach(
		      domNode.childNodes,
		      function(n) {
			  dojo.removeClass(n,"invisible");
		      });
	      });
    if(d>4)zen.debug("* zen.boxCompon: called dojo.attr");
    tbl.appendChild(row);
    if(d>4)zen.debug("* zen.boxCompon: appended row");
    row.appendChild(cell);
    if(d>4)zen.debug("* zen.boxCompon: appended cell");
    cell.appendChild(div);
    if(d>4)zen.debug("* zen.boxCompon: appended div");
    div.appendChild(text);
    if(d>4)zen.debug("* EXIT zen.boxCompon: returning compon with domNode => " +
		  row.domNode);
    return row;
};

// FIXME: Use dojo.create.
zen.boxTable = function(componList, tbl) {
    var tbl1, index, compon, children, row, cell, div,
	len = componList.length;
    if(d>4)zen.debug("* ENTER zen.boxTable: len => " + len);
    for (index=0; index<len; index++) {
	if(d>4)zen.debug("* zen.boxTable: index => " + index);
	// Treat this as info-level messages.
	if(d>0)zen.group("* zen.boxTable: componList");
	if(d>0)zen.dir(componList);
	if(d>0)zen.groupEnd();
	compon = componList[index];
	if(d>4)zen.debug("* zen.boxTable: compon => " + compon);
	row = zen.boxCompon(compon, tbl);
	if(d>4)zen.debug("* zen.boxTable: compon => " + compon + ", domNode => " +
		      compon.domNode);
	children = compon.getChildCompons();
	// Treat these as an info-level messages.
	if(d>0)zen.group("* zen.boxTable: component children");
	if(d>0)zen.dir(children);
	if(d>0)zen.groupEnd();
	if (children.length > 0) {
	    if(d>4)zen.debug("* zen.boxTable: create cell");
	    cell = zen.createElement("td", {class:"boxTD2"});
	    if(d>4)zen.debug("* zen.boxTable: row.domNode => " + row.domNode);
	    row.appendChild(cell);
	    if(d>4)zen.debug("* zen.boxTable: create table");
	    tbl1 = zen.createElement("table", {class:"boxTable"});
	    if(d>4)zen.debug("* zen.boxTable: append table to cell");
	    cell.appendChild(tbl1);
	    zen.boxTable(children, tbl1);
	};
    };
    if(d>4)zen.debug("* EXIT zen.boxTable");
};

zen.clearTheHierarchyDiagram = function () {
    var diagramPaneElementx, diagramPaneCompon;
    if(d>4)zen.debug("* Clearing the hierarchy diagram");
    diagramPaneElement = dojo.byId("diagramPane");
    if (!diagramPaneElement) {
	diagramPaneElement = zen.createElement(
	    "div",
	    {id:"diagramPane",
	     style:
	     "position:absolute;width:100px;height:100px;top:100px;left:300px;",
	     duration:"750"});
	zen.body.appendChild(diagramPaneElement);
    };
    diagramPaneCompon = dijit.byId("diagramPane");
    // Even if an element with id 'diagramPane' exists, we need to
    // have a Zen component so that we can use it. If we already have
    // a widget with that id, we can use that.
    if (!diagramPaneCompon) {
	diagramPaneCompon = createNew(zen.DomNodeCompon,
				      dojo.byId("diagramPane"));
    }
    var compons = diagramPaneCompon.getChildCompons();
    if(d>4)zen.debug("compons => " + compons);
    dojo.forEach(diagramPaneCompon.getChildCompons(),
		 function(child) {
		     if(d>4)zen.debug("Destroying " + child);
		     child.destroyCompon();
		 });
    if(d>4)zen.debug("* Exiting clear");
};


////
//// INITIALIZE TOOLBOX AND SOME VARIABLES
////
////
zen.init = function() {
    //FIXME: This version of toolbox is just for testing. Think of a
    //way it can be kept for regression testing.
    var toolboxTree;
    var toolbox =
    ["dojox.layout.FloatingPane",
     {id:"testRendering",
      title:"Rendering Tests",style:{top:"30px",right:"30px"},closable:true},
     [["center", {},
       [["dijit.form.Button",
	 {label:"Clear the Test Rendering",
	  onClick:function() {
	      clearTheTestRendering();
	  }},
	 []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"Clear the Canvas",
	  onClick:function() {
	      clearTheCanvas();
	  }},
	 []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"Clear the Hierarchy Chart",
	  onClick:function(){zen.clearTheHierarchyDiagram()}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 1: red DIV",
	  onClick:function(){test(tree1)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 2: red DIV with orange DIV",
	  onClick:function(){test(tree2)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 3: red DIV with table",
	  onClick:function(){test(tree3)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 4: DIV with P and red ContentPane",
	  onClick:function(){test(tree4)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 5: DIV (id:workingNode) with<br/>ContentPane (class:box)",
	  onClick:function(){test(tree5)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:
	  "test 6: DIV w/ P & red ContentPane<br/>w/ box ContentPane w/ DIV",
	  onClick:function(){test(tree6)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:
	  "test 7: AccordionContainer & AccordionPanes<br/>" +
	  "'workingNode' & 'cp1'",
	  onClick:function(){test(tree7)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:
	  "test 8: AccordionContainer 'workingNode' & AccordionPane with title",
	  onClick:function(){test(tree8)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 9: AccordionContainer w/ AccordionPanes, each w/ DIV",
	  onClick:function(){test(tree9)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 10: AccordionContainer w/ AccordionPanes, each /w DIV",
	  onClick:function(){test(tree10)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 11: nested AccordionPanes & ContentPanes",
	  onClick:function(){test(tree11)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 12: nested AccordionPanes & ContentPanes",
	  onClick:function(){test(tree12)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"Main Controls",onClick:function(){test(devTools)}}, []]]]]];
    zen.initIRT();
    zen.body = createNew(zen.DomNodeCompon, dojo.body());
    if(d>4)zen.debug("zen.body => " + zen.body + 
	      ", zen.body.domNode => " + zen.body.domNode);
    toolboxTree = zen.renderTree(toolbox, zen.body);
    //zen.debugLevel = 5;
    d = 5;
};