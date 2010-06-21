dojo.provide("zen.tree");


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
    zen.dojoWidget.startup(zenTree.treeCompons.widgets);
    return zenTree;
};

var recursion = 0;
//var transitoryTrees = createNew(zen.Tree);
zen.createTree = function(treeSpec) {
    console.debug("zen.createCompon([" + dojo.toJson(treeSpec[0]) + ", " +
		  dojo.toJson(treeSpec[1]) + "])");
    var index, newCompon, newSubtree,
        rootCompon = zen.createCompon([treeSpec[0], treeSpec[1]]),
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
