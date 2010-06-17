if (dojo) {
    console.debug("Providing zen.createTree");
    dojo.provide("zen.createTree");
} else {
    console.debug("No dojo!");
};


var zen = {};


////
//// CONSTRUCTORS
////
zen.Tree = function() {
    this.doNotDelete = false;
    this.rootCompon = null;
    this.treeCompons = []; // List of zen.TreeCompons.
}
// Singleton.
zen.Tree.allTrees = [];    // List of all separately created zen.Trees.

//FIXME: Bad name. Also: must the zen.TreeCompons class know about
//widgets & DOM nodes?
//
//FIXME: See http://higginsforpresident.net/2010/01/widgets-within-widgets/
zen.TreeCompons = function() {
    this.domNodeCompons = []; // List of zen.DomNodeCompons.
    this.widgets = [];
    this.pushCompon = function(component) {
	if (component.isDojoWidget) {
	    this.widgets.push(component);
	    if (this.widgets.length > 1) alert("widgets!");
	} else {
	    this.domNodeCompons.push(component);
	    if (this.domNodeCompons.length > 1) alert("domNodeCompons!");
	};
    };
};


////
//// TREE HANDLING
////
zen.renderTree = function(treeSpec, parent) {
    var zenTree;
    if(d>4)zen.info("##### ENTER: zen.renderTree #####");
    zenTree = zen.createTree(treeSpec);
    if(d>4)zen.group("renderTree: new zenTree");
    if(d>4)zen.dir(zenTree);
    if(d>4)zen.groupEnd();
    if(d>4)zen.debug("##### zen.renderTree: zenTree => " + zenTree);
    zenTree.rootCompon.appendMyselfToParent(parent);
    if(d>4)zen.group("renderTree: Appended new zenTree to parent");
    if(d>4)zen.dir(zenTree);
    if(d>4)zen.groupEnd();
    zen.startup(zenTree.treeCompons.widgets);
    if(d>4)zen.info("##### EXIT: zen.renderTree #####");
    return zenTree;
};

var recursion = 0,
    transitoryTrees = createNew(zen.Tree);
zen.createTree = function(treeSpec) {
    var index, newCompon, newSubtree,
        rootCompon = zen.createCompon(treeSpec),
	treeCompons = createNew(zen.TreeCompons),
        zenTree = createNew(zen.Tree);
    recursion += 1;
    if(d>4)zen.group("ENTER createTree: zenTree, recursion => " + recursion);
    if(d>4)zen.dir(zenTree);
    if(d>4)zen.groupEnd();
    zen.createChildren(rootCompon, treeSpec[2]);
    zenTree.rootCompon = rootCompon;
    treeCompons.pushCompon(rootCompon);
    //transitoryTrees.push(zenTree);
    zenTree.treeCompons = treeCompons;
    if(d>4)zen.group("EXIT createTree: zenTree, recursion => " + recursion);
    if(d>4)zen.dir(zenTree);
    if(d>4)zen.groupEnd();
    recursion -= 1;
    return zenTree;
};

zen.createChildren = function(parentCompon, childrenSpecs) {
    dojo.forEach(childrenSpecs,
		 function(childSpec) {
		     newSubtree = zen.createTree(childSpec);
		     newSubtree.rootCompon.appendMyselfToParent(parentCompon);
		 });
    /*
	dojo.forEach(
	    newSubtree.treeCompons.domNodeCompons.concat(
		newSubtree.treeCompons.widgets),
	    function(compon) {
		treeCompons.pushCompon(compon);
		if(d>4)zen.group("forEach(compon)");
		if(d>4)zen.dir(compon);
		if(d>4)zen.groupEnd();
	    });
	treeCompons.pushCompon(newSubtree.rootCompon);
    */
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
    if(d>4)zen.group("zen.clearTheCanvas: componsToDestroy");
    if(d>4)zen.dir(componsToDestroy);
    if(d>4)zen.groupEnd();
    if(d>4)zen.group("zen.clearTheCanvas: componsToSave");
    if(d>4)zen.dir(componsToSave);
    if(d>4)zen.groupEnd();
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
		  if(d>4)zen.debug("* zen.boxCompon: component => " + component+
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
	if(d>4)zen.group("* zen.boxTable: componList");
	if(d>4)zen.dir(componList);
	if(d>4)zen.groupEnd();
	compon = componList[index];
	row = zen.boxCompon(compon, tbl);
	children = compon.getChildCompons();
	if(d>4)zen.group("* zen.boxTable: component children");
	if(d>4)zen.dir(children);
	if(d>4)zen.groupEnd();
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
