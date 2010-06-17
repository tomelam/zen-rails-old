console.debug("Providing zen.createTree");
dojo.provide("zen.createTree");
dojo.registerModulePath("zen", "../../../zen");
dojo.require("zen.component");



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
    zenTree = zen.createTree(treeSpec);
    zenTree.rootCompon.appendMyselfToParent(parent);
    zen.startup(zenTree.treeCompons.widgets);
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
    zen.createChildren(rootCompon, treeSpec[2]);
    zenTree.rootCompon = rootCompon;
    treeCompons.pushCompon(rootCompon);
    //transitoryTrees.push(zenTree);
    zenTree.treeCompons = treeCompons;
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
    dojo.forEach(componsToDestroy,
		 function(compon) {
		     if (!componsToSave ||
			 (componsToSave.indexOf(compon) < 0)) {
			 compon.destroyCompon();
		     };
		 });
};


////
//// TREE DIAGRAMS
////
zen.diagramTree = function(newComponent) {
    var tblCompon, contentBox, floatingPaneContent;
    var diagramPaneCompon, floatingPane;
    zen.clearTheHierarchyDiagram();
    tblCompon = zen.createElement("table",
				  {id:"componTbl",class:"boxTable"});
    diagramPaneCompon = createNew(zen.DomNodeCompon,
				  dojo.byId("diagramPane"));
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
    tblCompon.appendMyselfToParent(floatingPane);
    zen.boxTable([newComponent], tblCompon);
    contentBox = dojo.contentBox("componTbl");
    floatingPane.startup();
    floatingPane.resize({t:30, l:30, w:contentBox.w+5, h:contentBox.h+31});
    floatingPaneContent = dojo.query(
	"#diagramPane.dojoxFloatingPane > .dojoxFloatingPaneCanvas > .dojoxFloatingPaneContent")[0];
    dojo.addClass(floatingPaneContent,"zenDiagramFloatingPaneContent");
    return floatingPane;
};

//FIXME: Use dojo.create.
zen.boxCompon = function(component, tbl) {
    var row = zen.createElement("tr");
    var cell = zen.createElement("td", {class:"boxTD1"});
    var div = zen.createElement("div", {class:"visualRep"});
    var text = zen.createTextNode("" + component);
    dojo.attr(cell.domNode, "mouseover",
	      function() {
		  var domNode = component.getDomNode();
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
    tbl.appendChild(row);
    row.appendChild(cell);
    cell.appendChild(div);
    div.appendChild(text);
    return row;
};

// FIXME: Use dojo.create.
zen.boxTable = function(componList, tbl) {
    var tbl1, index, compon, children, row, cell, div,
	len = componList.length;
    for (index=0; index<len; index++) {
	compon = componList[index];
	row = zen.boxCompon(compon, tbl);
	children = compon.getChildCompons();
	if (children.length > 0) {
	    cell = zen.createElement("td", {class:"boxTD2"});
	    row.appendChild(cell);
	    tbl1 = zen.createElement("table", {class:"boxTable"});
	    cell.appendChild(tbl1);
	    zen.boxTable(children, tbl1);
	};
    };
};

zen.clearTheHierarchyDiagram = function () {
    var diagramPaneElementx, diagramPaneCompon;
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
    dojo.forEach(diagramPaneCompon.getChildCompons(),
		 function(child) {
		     child.destroyCompon();
		 });
};
