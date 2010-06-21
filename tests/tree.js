dojo.provide("zen.tests.tree");
dojo.require("zen.component");
dojo.require("zen.dojoWidget");
dojo.require("zen.tree");


if (typeof zen == "undefined") {
    var zen = {};
};


// Test Zen object creation.

tests.register("zen.tests.tree", [
    {
	name: "1. Create a DIV HTML element with width, height, colour, & id",
	setUp: function() {
	    dojo.require("zen.component");
	    dojo.require("zen.tree");   
	},
	runTest: function() {
	    var treeSpec =
	    ["div", {style:{width:"180px",height:"180px",backgroundColor:"red"},
		     id:"workingNode1",title:"Title"}, []];
	    dojo.require("zen.component");
	    var tree = zen.createTree(treeSpec);
	    doh.assertNotEqual(tree, "undefined");
	}
    },
    {
	name:
	"2. Create a DIV with id, style, & title within a DIV with id & style",
	setUp: function() {
	    dojo.require("zen.component");
	    dojo.require("zen.tree");   
	},
	runTest: function() {
	    var treeSpec =
		["div", {id:"workingNode2",
			 style:{width:"200px",height:"200px",
				backgroundColor:"red"}},
		 [["div", {id:"workingNode2b",
			   style:{width:"180px",height:"180px",
				  backgroundColor:"orange"},
			   title:"Title 1"}, []]]];
	    dojo.require("zen.component");
	    var tree = zen.createTree(treeSpec);
	    doh.assertNotEqual(tree, "undefined");
	}
    },
    {
	name:
	"3. Create a DIV containing a DIV with a TABLE and P (containing ...)",
	setUp: function() {
	    dojo.require("zen.component");
	    dojo.require("zen.tree");   
	},
	runTest: function() {
	    var treeSpec =
		["div", {id:"workingNode3",
			 style:{width:"200px",height:"250px",
				backgroundColor:"red"}},
		 [["div",
		   {}, []],
		  ["table",
		   {style:{backgroundColor:"yellow"}, title:"Title 3"},
		   [["tr",
		     {style:{height:"50px"}},
		     [["td", {style:{width:"50px"}}, []],
		      ["td", {style:{width:"50px"}}, []]]],
		    ["tr",
		     {style:{height:"60px"}},
		     [["td", {style:{width:"50px"}}, []],
		      ["td", {style:{width:"50px"}}, []]]],
		    ["tr",
		     {style:{height:"50px"}},
		     [["td", {style:{width:"50px"}}, []],
		      ["td", {style:{width:"50px"}}, []]]]]],
		  ["p", {}, [["span", {}, [["div", {}, []], ["div", {}, []]]],
			     ["div", {}, []]]]]];
	    dojo.require("zen.component");
	    var tree = zen.createTree(treeSpec);
	    doh.assertNotEqual(tree, "undefined");
	}
    },
    {
	name:
	"4. Create a DIV containing a P and an orange ContentPane",
	setUp: function() {
	    dojo.require("zen.component");
	    dojo.require("zen.dojoWidget");   
	    dojo.require("zen.tree");
	},
	runTest: function() {
	    var treeSpec =
		["dijit.layout.ContentPane",
		 {},
		 []];
	    dojo.require("zen.component");
	    dojo.require("zen.dojoWidget");
	    dojo.require("zen.tree");
	    var tree = zen.createTree(treeSpec);
	    zen.body.appendChild(tree);
	    doh.assertNotEqual(tree, "undefined");
	    var innerDiv = dojo.query("#workingNode4");
	    console.dir(innerDiv);
	    doh.assertNotEqual(innerDiv, "undefined");
	}
    }
]);