dojo.provide("zen.tests.tree");
dojo.require("zen.component");
dojo.require("zen.tree");


// Test Zen object creation.

tests.register("zen.tests.tree", [
    {
	name: "Create a DIV HTML element with width, height, colour, & id",
	setUp: function() {
	    dojo.require("zen.component");
	    dojo.require("zen.tree");   
	},
	runTest: function(){
	    var treeSpec =
	    ["div", {style:{width:"180px",height:"180px",backgroundColor:"red"},
		     id:"workingNode1",title:"Title"}, []];
	    dojo.require("zen.component");
	    var tree = zen.createTree(treeSpec);
	    doh.assertNotEqual(tree, "undefined");
	}
    }
]);