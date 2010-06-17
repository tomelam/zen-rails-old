console.debug("Providing zen.dijit");
dojo.provide("zen.dijit");


////
//// DOJO WIDGET HANDLING
////
zen.startup = function(widgetCompons) {
    // Start up all the Dojo widgets. The order is important.
    //FIXME: Previously, we used zen.widgets in place of
    //widgetCompons, which was pushed to in zen.createDijit.
    dojo.forEach(widgetCompons.reverse(),
		 function(w) {
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
    widget.isDojoWidget = true; // FIXME: Dumb.
    widget.kind = klass;
    widget.children = [];
    widget.getDomNode = function() {
	return widget.domNode;
    };
    widget.getChildCompons = function() {
	return widget.children;
    };
    widget.appendMyselfToParent = function(parent) {
	//FIXME: See the placeat method in _Widget.js.
	if (parent.isDojoWidget) {
	    parent.children.push(widget);
	    return parent.addChild(widget);       // parent is Dojo widget
	} else {
	    return parent.appendChild(widget);    // parent is not Dojo widget
	};
    };
    widget.appendChild = function(child) {
	if (child.isDojoWidget) {
	    widget.children.push(child);
	    return widget.addChild(child);        // child is Dojo widget
	} else {
	    widget.children = [child];
	    return widget.setContent(child.domNode); // child isn't Dojo widget
	};
    };
    widget.destroyCompon = function() {
	var compon, index;
	dojo.forEach(widget.getChildCompons(),
		     function(child) {
			 child.destroyCompon();
		     });
	widget.destroy();
    };
    return widget;
};