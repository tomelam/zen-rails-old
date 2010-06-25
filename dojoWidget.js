dojo.provide("zen.dojoWidget");
dojo.require("zen.component");


////
//// DOJO WIDGET HANDLING
////

// Although no special prototype is defined for Dojo widgets, the
// object zen.dojoWidget is defined to parallel the object
// zen.domNode.
zen.dojoWidget.startup = function(widgetCompons) {
    // Start up all the Dojo widgets. The order is important.
    dojo.forEach(widgetCompons.reverse(),
		 function(w) {
		     w.startup();
		 });
};

//FIXME: widgets have not been defined in terms of a Zen constructor.
//FIXME: See http://higginsforpresident.net/2010/01/widgets-within-widgets/
//
// Zen.createDojoWidget does not allow a widget to be built on a
// passed-in HTML element node. Instead, the widget constructor is
// called without reference to a node, thus causing it to create a
// root node on the fly. The widget can be added to a parent
// component afterwards.
zen.createDojoWidget = function(klass, initParms, rootNode) {
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
	  "Exception: zen.createDojoWidget: widget already exists w/ id => "+
	  initParms.id + ", klass => " + klass);
	};
	if (dojo.byId(initParms.id) != null) {
	  throw new Error(
	  "Exception: zen.createDojoWidget: element already exists w/ id => "+
	  initParms.id + ", klass => " + klass);
	};
    };
    //console.debug("zen.createDojoWidget: ");
    widget = createNew(zen.rule2ref(klass), initParms, node);
    if (!widget) {
	throw new Error("Exception: zen.createDojoWidget: creation failed");
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
	    //return widget.setContent(child.domNode); // child isn't Dojo widget
	    return widget.attr("content", child.domNode);
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

zen.rulesTable.addRule({
    createDijit   : [ "dijit.layout.ContentPane",
		      "dijit.layout.BorderContainer",
		      "dijit.layout.AccordionContainer",
		      "dijit.layout.AccordionPane", //FIXME: deprecated
		      "dijit.DialogUnderlay",
		      "dijit.form.Button",
		      "dojox.layout.FloatingPane" //FIXME: deprecated
		    ]});
zen.invertedRulesTable.init();
zen.shortcutsTable.addShortcut(
    {createDijit    : zen.createDojoWidget});
