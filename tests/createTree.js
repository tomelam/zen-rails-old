dojo.provide("zen.tests.createTree");


// Test Zen object creation.

tests.register("zen.tests.createTree", [
    {
	name: "Create a DIV HTML element with width, height, colour, & id",
	setUp: function() {
	    console.debug("Requiring zen.createTree");
	    dojo.require("zen.createTree");   
	},
	runTest: function(){
	    var treeSpec =
	    ["div", {style:{width:"180px",height:"180px",backgroundColor:"red"},
		     id:"workingNode1",title:"Title"}, []];
	    var tree = zen.createTree(treeSpec);
	    doh.assertNotEqual(tree, "undefined");
	}
    }
]);