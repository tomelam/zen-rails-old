//FIXME: Put this into object.js instead?
//// Replace the default Object constructor so that light-weight
//// objects can be built from closures and have a default message
//// dispatcher.
//Object = function() {
//    return function(m) {
//	console.debug("Message not understood: " + m);
//    };
//};

//// THE NODE INTERFACE
////
//// A node can only append a DOM node to itself.
////
makeNode = function() {
    var node;
    return function(m, arg1) {
	if (m == 0) {
	    node = document.createElement(arg1);
	    console.debug("create element: arg1 => " + arg1 +
			  ", DOM node => " + node);
	    var appendChild = node.appendChild;
	    return node;
	} else if (m == 1) {
	    node = document.getElementById(arg1);
	    console.debug("get element by id: arg1 => " + arg1 +
			  ", node => " + node);
	    return node;
	} else if (m == 2) {
	    console.debug("append child: node => " + node +
			  ", arg1 => " + arg1);
	    node.appendChild(printDomNode(arg1));
	} else if (m == 3) {
	    node = arg1;
	    console.debug("set DOM node: DOM node => " + node);
	} else if (m == 4) {
	    console.debug("print DOM node: DOM node => " + node);
	    return node;
	} else {
	    throw new Error("Message not understood");
	};
    };
};

if (typeof doc != "undefined") {
    throw new Error("doc was unexpectedly defined");
} else {
    makeDoc = function() {
	return function(m) {
	    console.debug("Message not understood: " + m);
	};
    };
    doc = makeDoc();
};

// Weak attempt to replace document.createElement and
// document.getElementById.  If Dojo uses the shortcut 'doc' in place
// of 'document' everywhere, maybe such a shortcut can be made to work
// for Dojo.
//
//FIXME: Should doc.createElement should be a Smalltalkish object?
//If it were, interesting things like tracing it could be done.
doc.createElement = function(type) {
    var stNode = makeNode();
    stNode(0, type);
    return stNode;
};
doc.getElementById = function(id) {
    var stNode = makeNode();
    return stNode(1, id);
};

appendChild = function(parent, child) {
    return parent(2, child);
};

setDomNode = function(stNode, node) {
    return stNode(3, node);
};

printDomNode = function(stNode) {
    return stNode(4);
};

if (typeof zen == "undefined") {
    makeZen = function() {
	return function(m) {
	    console.debug("Message not understood: " + m);
	};
    };
    //zen = makeZen();
};
