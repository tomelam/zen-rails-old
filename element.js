console.debug("Providing zen.element");
dojo.provide("zen.element");


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
