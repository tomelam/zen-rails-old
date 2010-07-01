dojo.provide("zen.dojoWidget");
dojo.require("zen.rulesDB");

////
//// DOJO WIDGET HANDLING
////

// FIXME:
//
// It would be better to create a mixin to add to the widget class
// from which all Dojo, Dijit, and Dojox widgets inherit -- or to each
// widget class separately -- than to add methods separately to each
// class instance.
//
// FIXME: Change 'DojoWidget' to 'DojoCompon' because every Zen type
// should be a 'Compon' and because every Dojo compon is a widget.

zen.dojoWidget = {};

zen.dojoWidget.startup = function(widgetCompons) {
    // Start up all the Dojo widgets. The order is important.
    dojo.forEach(widgetCompons.reverse(),
		 function(w) {
		     w.startup();
		 });
};

dojo.require("dijit._base.manager");
zen.dojoWidget.fullSet = createNew(dijit.WidgetSet);

zen.dojoWidget.byId = function(id) {
    return zen.dojoWidget.fullSet.byId(id);
};

//FIXME: widgets have not been defined in terms of a Zen constructor.
//FIXME: See http://higginsforpresident.net/2010/01/widgets-within-widgets/
//
//FIXME: Is the following correct?
//
// Zen.createDojoWidget does not allow a widget to be built on a
// passed-in HTML element node. Instead, the widget constructor is
// called without reference to a node, thus causing it to create a
// root node on the fly. The widget can be added to a parent
// component afterwards.
zen.createDojoWidget = function(klass, initParms, rootNode) {
    var widget,
	node = null;
    dojo.require(klass);
    if (rootNode) {
	node = rootNode.getDomNode();
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
    widget.isDojoWidget = true; // FIXME: Dumb. Check prototype instead?
    widget.kind = klass; //FIXME: Use prototype instead? What about mixins?
    widget.children = createNew(dijit.WidgetSet);
    widget.getDomNode = function() {
	return widget.domNode;
    };
    widget.getChildCompons = function() {
	return widget.children;
    };
    widget.appendChild = function(child) { //FIXME: Test prototype instead?
	if (child.isDojoWidget && widget.addChild) {
	    console.debug("Adding child " + child + " to widget " + widget);
	    widget.children.add(child);
	    widget.addChild(child); // child is Dojo widget
	} else {
	    console.debug("Not tested yet?");
	    if (widget.children.some(function(){return true;})) {
		throw new Error("Exception: widget already has children.");
	    };
	    widget.children.add(child);
	    widget.attr("content", child.domNode); // child not widget
	};
    };
    widget.appendMyselfToParent = function(parent) {
	//FIXME: See the placeat method in _Widget.js.
	parent.appendChild(widget);
	widget.parent = parent;
	/*
	if (parent.isDojoWidget) {
	    parent.children.add(widget);
	    return parent.addChild(widget);       // parent is Dojo widget
	} else {
	    return parent.appendChild(widget);    // parent is not Dojo widget
	};
        */
    };
    widget.destroyCompon = function() {
	var compon, index;
	dojo.forEach(widget.getChildCompons(),
		     function(child) {
			 child.destroyCompon();
		     });
	widget.parent.children.remove(widget.id);
	widget.destroy();
    };
    zen.dojoWidget.fullSet.add(widget);
    return widget;
};

zen.rulesTable.addRule({
    createDijit   : [ "dijit.layout.ContentPane",
		      "dijit.layout.BorderContainer",
		      "dijit.layout.TabContainer",
		      "dijit.layout.AccordionContainer",
		      "dijit.layout.AccordionPane", //FIXME: deprecated
		      "dijit.DialogUnderlay",
		      "dijit.form.Button",
		      "dojox.layout.FloatingPane" //FIXME: deprecated
		    ]});
zen.invertedRulesTable.init();
zen.shortcutsTable.addShortcut(
    {createDijit    : zen.createDojoWidget});
