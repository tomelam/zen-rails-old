dojo.provide("zen.domNode");
dojo.require("zen.object");
dojo.require("zen.rulesDB");

////
//// DOM NODE HANDLING
////

// FIXME:
//
// Consider creating a Dojo widget for *every* DOM node.
//
// FIXME:
//
// A DomNodeCompon can be created as 'new zen.DomNodeCompon(element)'
// or 'createNew(zen.DomNodeCompon(element))', where 'element' is a
// DOM node reference.
//
// A DomNodeCompon can also be created as
// 'zen.createElement(kind, attributes)'.
//
// Wouldn't it be nice to simply combine these 2 methods of creating a
// DomNodeCompon? Either an argument count (being careful to allow a
// DomNodeCompon to be created with its domNode unset, in case this
// becomes useful someday) or a type check on the first argument
// (check for a function). Check to see whether the resulting
// interface (using createNew instead of zen.createElement) could be
// combined with the rules in rulesDB.js.

// NOTES on the tracking of components:
//
// 1. When a component is created, it must be registered so that it
// can be operated upon later (destroyed, or located via DOM node
// reference, etc.). Since JavaScript does not support a reference to
// an object being used as a property name, the DOM node cannot be
// used as a key to look up the DomNodeCompon. A unique id could be
// given to every DOM node so that any DOM node's id could be used to
// look up the DomNodeCompon, but we will use a simple array instead
// and search the array for the node's containing DomNodeCompon
// object. See dojo/dijit/_base/manager.js for ideas.
//
// 2. When a component is destroyed, first its children must be
// destroyed.
//
// 3. When a component is destroyed, its registration must be
// cancelled.  Since a reference to a JavaScript object cannot be used
// as a JavaScript property name, the component has to be found by a
// brute force search.

zen.DomNodeCompon = function(element) {
    this.domNode = element;
    this.parent = null;
    this.stringRep = "[zen.DomNodeCompon " + this.domNode + "]";
    this.children = createNew(zen.Set);
    this.toString = function () { // Without this, we get '[object Object]'.
	return "[zen.DomNodeCompon " +
	    String(this.domNode).replace(/^\[object /,"").replace(/\]$/,"") +
	    "]";
    };
    // FIXME: Consider dojo.html.set.
    this.appendChild = function (child) {
	//console.dir(child);
	//console.debug("zen.DomNodeCompon: this.appendChild(" + child + ")");
	this.domNode.appendChild(child.getDomNode());
	this.children.add(child);
	//console.group("appendChild: this.children");
	//console.dir(this.children);
	//console.groupEnd();
    };
    this.appendMyselfToParent = function (parent) {
	parent.appendChild(this);
	this.parent = parent;
    };
    this.getDomNode = function () {
	return this.domNode;
    };
    this.getChildCompons = function () { //FIXME: WORKING ON THIS: WAS BROKEN!
	return this.children.registry;
	var domNode = this.domNode;
	return dojo.map(domNode.children,
			function(c) {
			    var w = dijit.byNode(c);
			    return w ||
				zen.DomNodeCompon.fromDomNode(c);
			});
    };
    this.destroyCompon = function () {
	dojo.forEach(this.getChildCompons(),
		     function(child) { child.destroyCompon(); });
	//console.group("destroyCompon: this.parent");
	//console.dir(this.parent);
	//console.groupEnd();
	this.parent.children.remove(this);
	dojo.destroy(this.getDomNode());
    };
    zen.DomNodeCompon.fullSet.add(this);
    //console.group("zen.DomNodeCompon: zen.DomNodeCompon.fullSet");
    //console.dir(zen.DomNodeCompon.fullSet);
    //console.groupEnd();
};

// Singletons.
zen.DomNodeCompon.fullSet = createNew(zen.Set);
zen.DomNodeCompon.fromDomNode = function (node) {
    var index = 0, compon, len;
    var registry;
    registry = zen.DomNodeCompon.fullSet.registry;
    len = registry.length;
    for (index; index<len; index++) {
	compon = registry[index];
	if (compon.domNode == node) {
	    return compon;
	};
    };
    return null;
};
zen.DomNodeCompon.byId = function (id) {
    return zen.DomNodeCompon.fromDomNode(dojo.byId(id));
};

//FIXME: compon.toString() prints "[object HTMLSpanElement]" for the
//CENTER element.
zen.createElement = function(kind, attributes) {
    var domNodeCompon = createNew(zen.DomNodeCompon);
    if (attributes && attributes.id) {
	/*FIXME: Revisit this. Currently it would cause a test to fail
          because we are not requiring dijit at this point. (We
          shouldn't, either.)
	if (dijit.byId(attributes.id) != null) {
	 throw new Error(
	 "Exception: zen.createElement: Dojo widget already exists w/ id => "+
	 attributes.id + ", kind => " + kind);
	};
        */
	if (dojo.byId(attributes.id) != null) {
	zen.DomNodeCompon.fullSet.remove(domNodeCompon);
	throw new Error(
	"Exception: zen.createElement: HTML element already exists w/ id => "+
	attributes.id + ", kind => " + kind);
	};
    };
    // FIXME: Use dojo.create. Note that attributes can be set with it.
    // FIXME: Consider dojo.html.set -- maybe not here, but somewhere
    // (appendMyselfToParent?).
    var domNode = document.createElement(kind);
    dojo.attr(domNode, attributes || {}); //FIXME: Check this.
    domNodeCompon.domNode = domNode; //FIXME: Maybe should use a setter.
    return domNodeCompon;
};

// Create a component that refers to an HTML text node or HTML
// element. This avoids some conflict with Dojo that results when
// trying to use prototype.js to add methods to an element. It also is
// more future proof since an element can be handled in a clean way.
//
// FIXME: Can text nodes have attributes?
zen.createTextNode = function(text, attributes) {
    var domNodeCompon = createNew(zen.DomNodeCompon);
    // FIXME: Use dojo.create, if appropriate.
    var domNode = document.createTextNode(text);
    domNodeCompon.domNode = domNode;
    return domNodeCompon;
};

zen.rulesTable.addRule(
    {createElement : [ "div", "table", "tr", "td",
		       "p", "span", "center", "br" ]});
zen.rulesTable.addRule({createTextNode: [ "text" ]});
zen.invertedRulesTable.init();
zen.body = createNew(zen.DomNodeCompon, dojo.body());
zen.shortcutsTable.addShortcut(
    {createElement  : zen.createElement});
zen.shortcutsTable.addShortcut(
    {createTextNode : zen.createTextNode}); //FIXME: document.createTextNode?

