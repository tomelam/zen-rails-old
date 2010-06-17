console.debug("Providing zen.dijit");
dojo.provide("zen.dijit");


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