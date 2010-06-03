zen = {};

zen.domNodeCompons = [];

zen.DomNodeCompon = function(e) {
    this.domNode = e;
    this.appendMyselfToParent = function (parent) {
	console.debug("DomNodeCompon.appendMyselfToParent: domNode => " +
		      this.domNode + ", parent => " + parent);
	parent.appendChild(this);
    };
    this.appendChild = function (child) {
	console.debug("DomNodeCompon.appendChild: child => " +
		      child + ", this => " + this);
	this.domNode.appendChild(child.getDomNode());
    };
    this.getDomNode = function () {
	console.debug("DomNodeCompon.getDomNode: domNode => " + this.domNode);
	return this.domNode;
    };
    this.getChildCompons = function () { //FIXME: WORKING ON THIS: WAS BROKEN!
	var domNode = this.domNode;
	console.debug("zen.DomNodeCompon.getChildCompons: domNode => " + domNode);
	return dojo.map(domNode.children,
			function(c) {
			    var w = dijit.byNode(c);
			    //return w || c;
			    return w || zen.DomNodeCompon.nodeToDomNodeCompon(c);
			});
    };
}

zen.DomNodeCompon.nodeToDomNodeCompon = function (node) {
    var i = 0;
    var len = zen.domNodeCompons.length;
    var compon;
    //console.debug("zen.DomNodeCompon.nodeToDomNodeCompon: len => " + len +
    //		  ", node => " + node);
    for (i; i<len; i++) {
	compon = zen.domNodeCompons[i];
	//console.debug("...nodeToDomNodeCompon: i => " + i + ", compon => " +
	//	      compon);
	if (compon.domNode == node) {
	    //console.debug("...nodeToDomNodeCompon: returning compon " + compon);
	    return compon;
	};
    };
    console.error("...nodeToDomNodeCompon: returning null, node => " +
		  node + ", i => " + i);
    return null;
};

// Create a component that refers to an HTML text node or HTML
// element. This avoids some conflict with Dojo that results when
// trying to use prototype.js to add methods to an element. It also is
// more future proof since an element can be handled in a clean way.
//
// FIXME: Can text nodes have attributes?
zen.createTextNode = function(text, attributes) {
//zen.TextNode = function(text, attributes) {
    var domNodeCompon = createNew(zen.DomNodeCompon);
    console.debug("*** zen.createTextNode: text => " + text +
		  ", attributes => " + attributes);
    // FIXME: Use dojo.create, if appropriate.
    var domNode = document.createTextNode(text);
    console.debug("zen.createTextNode: domNode => " + domNode);
    zen.domNodeCompons.push(domNodeCompon);
    console.debug("zen.createTextNode: # of domNodeCompons => " +
		  zen.domNodeCompons.length);
    domNodeCompon.domNode = domNode;
    return domNodeCompon;
};

// FIXME: Consider using dojo.fromJSON here for safety.
zen.createElement = function(kind, attributes) {
//zen.createElement = function(kind, attributes) {
    var domNodeCompon = createNew(zen.DomNodeCompon);
    console.debug("*** zen.createElement: kind => " + kind +
		  ", attributes => " + attributes);
    // FIXME: Use dojo.create.
    var domNode = document.createElement(kind);
    console.debug("zen.createElement: domNode => " + domNode);
    zen.domNodeCompons.push(domNodeCompon);
    console.debug("zen.createElement: # of domNodeCompons => " +
		  zen.domNodeCompons.length);
    dojo.attr(domNode, attributes || {}); //FIXME: Check this.
    domNodeCompon.domNode = domNode;
    return domNodeCompon;
};

zen.createSubtree = function(treeSpec) {
    var i, rule, parentCompon, compon, len, constructor, parentDomNode,
	componKind = treeSpec[0],
	initParms = treeSpec[1],
	subtree = treeSpec[2];
    rule = zen.invertedRulesTable[componKind];
    console.debug("* ENTER zen.createSubtree: rule => " + rule +
		  ", componKind => " + componKind);
    constructor = zen.rule2ref(rule);
    parentCompon = constructor.call(document, componKind, initParms);
    console.debug("* zen.createSubtree: parentCompon => " + parentCompon);
    len = subtree.length;
    for (i=0; i<len; i++) {
	compon = zen.createSubtree(subtree[i]);
	compon.appendMyselfToParent(parentCompon);
    };
    console.debug("* EXIT zen.createSubtree, parentCompon => " + parentCompon);
    return parentCompon;
};

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

zen.widgets = [];

zen.startup = function() {
    // Start up all the Dojo widgets. The order is important.
    dojo.forEach(zen.widgets.reverse(),
		 function(w) {
		     console.debug("starting up " + w);
		     w.startup(); }
		);
};

zen.walkTheDOM = function(node, func) {
    var oldNode;
    console.debug("node => " + node);
    func(node);
    node = node.firstChild;
    while (node) {
	zen.walkTheDOM(node, func);
	//oldNode = node;
	node = node.nextSibling;
	//oldNode.parentNode.removeChild(oldNode);
    }
};

zen.walkTree = function(tree, func) {
    console.debug("tree => " + tree);
    func(tree);
    var children = tree.getChildCompons();
    console.debug("children.length => " + children.length);
    var i;
    for (i=0; i<children.length; i++) {
	func(children[i]);
	zen.walkTree(children[i], func);
    };
    console.debug("pop");
};

//FIXME: Use dojo.create.
zen.boxCompon = function(component, tbl) {
    console.debug("** ENTER zen.boxCompon");
    var row = zen.createElement("tr");
    var cell = zen.createElement("td", {class:"boxTD1"});
    var div = zen.createElement("div", {class:"visualRep"});
    console.debug("** zen.boxCompon: createTextNode " + component);
    var text = zen.createTextNode("" + component);
    console.debug("** zen.boxCompon: createTextNode done, call dojo.attr");
    dojo.attr(cell.domNode, "mouseover",
	      function() {
		  var domNode = component.getDomNode();
		  console.debug("** zen.boxCompon: component => " + component +
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
    console.debug("** zen.boxCompon: called dojo.attr");
    tbl.appendChild(row);
    console.debug("** zen.boxCompon: appended row");
    row.appendChild(cell);
    console.debug("** zen.boxCompon: appended cell");
    cell.appendChild(div);
    console.debug("** zen.boxCompon: appended div");
    div.appendChild(text);
    console.debug("** EXIT zen.boxCompon: returning compon with domNode => " +
		  row.domNode);
    return row;
};

// FIXME: Use dojo.create.
zen.boxTable = function(componList, tbl) {
    var tbl1, i, len = componList.length, compon, children, row, cell, div;
    console.debug("* ENTER zen.boxTable: len => " + len);
    for (i=0; i<len; i++) {

	console.debug("* zen.boxTable: i => " + i);
	console.group("* zen.boxTable: componentList");
	console.dir(componList);
	console.groupEnd();

	compon = componList[i];
	console.debug("* zen.boxTable: compon => " + compon);
	row = zen.boxCompon(compon, tbl);
	console.debug("* zen.boxTable: compon => " + compon + ", domNode => " +
		      compon.domNode);
	children = compon.getChildCompons();

	console.group("* zen.boxTable: component children");
	console.dir(children);
	console.groupEnd();

	if (children.length > 0) {
	    console.debug("* zen.boxTable: create cell");
	    cell = zen.createElement("td", {class:"boxTD2"});
	    console.debug("* zen.boxTable: row.domNode => " + row.domNode);
	    row.appendChild(cell);
	    console.debug("* zen.boxTable: create table");
	    tbl1 = zen.createElement("table", {class:"boxTable"});
	    console.debug("* zen.boxTable: append table to cell");
	    cell.appendChild(tbl1);
	    zen.boxTable(children, tbl1);
	};
    };
    console.debug("* EXIT zen.boxTable");
};

// Zen.createDijit does not allow a dijit to be built on a
// passed-in HTML element node. Instead, the dijit constructor is
// called without reference to a node, thus causing it to create a
// top node on the fly. The dijit can be added to a parent
// component afterwards.
zen.createDijit = function(klass, initParms, topNode) {
    console.debug("zen.dojo.createDijit, klass => " + klass);
    var node = null, widget;
    dojo.require(klass);
    if (topNode) {
	node = topNode.domNode;
    }
    widget = createNew(zen.rule2ref(klass), initParms, node);
    console.debug("widget => " + widget);
    widget.isDojoWidget = true; // FIXME: Dumb.
    widget.kind = klass;
    widget.children = [];
    widget.getDomNode = function() {
	console.debug("widget.getDomNode: domNode => " + widget.domNode);
	return widget.domNode;
    };
    widget.getChildCompons = function() {
	return widget.children;
    };
    widget.appendMyselfToParent = function(parent) {
	//FIXME: See the placeat method in _Widget.js.
	console.debug("appendMyselfToParent: widget => " + widget +
		      ", parent => " + parent);
	if (parent.isDojoWidget) {
	    console.debug("widgetp.addChild(widgetc), widgetp => " +
			  parent + ", widgetc => " + widget);
	    parent.children.push(widget);
	    return parent.addChild(widget);         // parent is Dojo widget
	} else {
	    console.debug("domNode.appendChild(widget.domNode)");
	    return parent.appendChild(widget);      // parent is not Dojo widget
	};
    };
    widget.appendChild = function(child) {
	console.debug("widget.appendChild: child => " + child);
	if (child.isDojoWidget) {
	    console.debug("widget.appendChild(widget)");
	    widget.children.push(child);
	    return widget.addChild(child);           // child is Dojo widget
	} else {
	    console.debug("widget.appendChild(domNode)");
	    if (widget.children.length > 0) {
		console.warn(
		    "A widget can have only one child if it's only HTML.");
	    }
	    widget.children = [child];
	    return widget.setContent(child.domNode); // child is not Dojo widget
	};
    };
    widget.destroyChild = function(child) {
	console.debug("widget.destroyChild: child => " + child);
    };
    zen.widgets.push(widget);
    return widget;
};

// These shortcuts make it easy to specify methods for creating
// various kinds of components.
zen.shortcutsTable = {
    createElement : zen.createElement,
    createTextNode : document.createTextNode,
    createDijit : zen.createDijit
};

zen.init = function() {
    zen.initIRT();
    zen.body = createNew(zen.DomNodeCompon, dojo.body());
    console.debug("zen.body.domNode => " + zen.body.domNode);
}


