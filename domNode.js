dojo.provide("zen.domNode");
dojo.require("zen.component");

//FIXME: Move all dojo.require calls here, after checking that every
//function herein needs them.


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
	parent.appendChild(this);
    };
    this.appendChild = function (child) {
	//console.dir(child);
	//console.debug("zen.DomNodeCompon: this.appendChild(" + child + ")");
	this.domNode.appendChild(child.getDomNode());
	this.children.push(child);
    };
    this.getDomNode = function () {
	return this.domNode;
    };
    this.getChildCompons = function () { //FIXME: WORKING ON THIS: WAS BROKEN!
	return this.children;
	var domNode = this.domNode;
	return dojo.map(domNode.children,
			function(c) {
			    var w = dijit.byNode(c);
			    return w ||
				zen.DomNodeCompon.fromDomNode(c);
			});
    };
    this.destroyCompon = function() {
	var compon, index, lengthBefore, lengthAfter;
	dojo.forEach(this.getChildCompons(),
		     function(child) {
			 child.destroyCompon();
		     });
	dojo.destroy(this.domNode);
	index = zen.DomNodeCompon.allDomNodeCompons.indexOf(this);
	if (index < 0) {
	    console.group("Looking for " + this + " in list");
	    console.dir(this);
	    console.groupEnd();
	    throw new Error("Exception: couldn't find DomNodeCompon in list.");
	} else {
	    if (index == (zen.DomNodeCompon.allDomNodeCompons.length - 1)) {
		lengthBefore = zen.DomNodeCompon.allDomNodeCompons.length;
 		//delete zen.DomNodeCompon.allDomNodeCompons[index];
		zen.DomNodeCompon.allDomNodeCompons.pop();
		lengthAfter = zen.DomNodeCompon.allDomNodeCompons.length;
		if (lengthBefore == lengthAfter) {
		    throw new Error("Exception! Length should reduce.");
		};
	    } else {
		lengthBefore = zen.DomNodeCompon.allDomNodeCompons.length;
 		delete zen.DomNodeCompon.allDomNodeCompons[index];
		lengthAfter = zen.DomNodeCompon.allDomNodeCompons.length;
 		zen.DomNodeCompon.allDomNodeCompons[index] =
		    zen.DomNodeCompon.allDomNodeCompons.pop();
		lengthAfter = zen.DomNodeCompon.allDomNodeCompons.length;
		if (lengthBefore == lengthAfter) {
		    throw new Error("Exception! Length should reduce.");
		};
	    };
	};
    };
    zen.DomNodeCompon.allDomNodeCompons.push(this);
    index = zen.DomNodeCompon.allDomNodeCompons.indexOf(this);
};

// Singletons.
zen.DomNodeCompon.allDomNodeCompons = [];
zen.DomNodeCompon.fromDomNode = function (node) {
    var index = 0, compon, len;
    var allDomNodeCompons;
    /*
    allDomNodeCompons = canvas.rootCompons.domNodeCompons.concat(
	toolbars.rootCompons.domNodeCompons);
    */
    allDomNodeCompons = zen.DomNodeCompon.allDomNodeCompons;
    len = allDomNodeCompons.length;
    for (index; index<len; index++) {
	compon = allDomNodeCompons[index];
	if (compon.domNode == node) {
	    return compon;
	};
    };
    return null;
};

//FIXME: compon.toString() prints "[object HTMLSpanElement]" for the
//CENTER element.
zen.createElement = function(kind, attributes) {
    dojo.require("zen.object");
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
	throw new Error(
	"Exception: zen.createElement: HTML element already exists w/ id => "+
	attributes.id + ", kind => " + kind);
	};
    };
    // FIXME: Use dojo.create.
    var domNode = document.createElement(kind);
    dojo.attr(domNode, attributes || {}); //FIXME: Check this.
    domNodeCompon.domNode = domNode;
    return domNodeCompon;
};

// Create a component that refers to an HTML text node or HTML
// element. This avoids some conflict with Dojo that results when
// trying to use prototype.js to add methods to an element. It also is
// more future proof since an element can be handled in a clean way.
//
// FIXME: Can text nodes have attributes?
zen.createTextNode = function(text, attributes) {
    dojo.require("zen.object");
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

