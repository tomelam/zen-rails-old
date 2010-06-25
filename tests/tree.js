dojo.provide("zen.tests.tree");
dojo.require("zen.tree");


// Test Zen object creation.

tests.register("zen.tests.tree", [
    {
	name: "1. Create a DIV HTML element with width, height, colour, & id",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var treeSpec =
	    ["div", {style:{width:"180px",height:"180px",backgroundColor:"red"},
		     id:"workingNode1",title:"Title"}, []];
	    var tree = zen.createTree(treeSpec);
	    doh.assertNotEqual(tree, "undefined");
	}
    },
    {
	name:
	"2. Create a DIV with id, style, & title within a DIV with id & style",
	setUp: function() {
	    dojo.require("zen.domNode");
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
	    var tree = zen.createTree(treeSpec);
	    doh.assertNotEqual(tree, "undefined");
	}
    },
    {
	name:
	"3. Create a DIV containing a DIV with a TABLE and P (containing ...)",
	setUp: function() {
	    dojo.require("zen.domNode");
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
	    var tree = zen.createTree(treeSpec);
	    doh.assertNotEqual(tree, "undefined");
	}
    },
    {
	name:
	"4. Create a ContentPane",
	setUp: function() {
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var treeSpec =
		["dijit.layout.ContentPane",
		 {},
		 []];
	    var topCompon = zen.createTree(treeSpec).rootCompon;
	    zen.body.appendChild(topCompon);
	    doh.assertNotEqual(topCompon, "undefined");
	    var innerDiv = dojo.query("#workingNode4");
	    //console.dir(innerDiv);
	    doh.assertNotEqual(innerDiv, "undefined");
	}
    },
    {
	name:
	"5. Create a DIV containing a P and an orange ContentPane",
	setUp: function() {
	    dojo.require("zen.domNode");
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var treeSpec =
		["div", {id:"workingNode4"},
		 [["p", {}, []],
		  ["dijit.layout.ContentPane",
		   {style:{width:"300px",height:"300px",
			   backgroundColor:"orange"}},
		   []]]];
	    var topCompon = zen.createTree(treeSpec).rootCompon;
	    zen.body.appendChild(topCompon);
	    doh.assertNotEqual(topCompon, "undefined");
	    var innerDiv = dojo.query("#workingNode4");
	    //console.dir(innerDiv);
	    doh.assertNotEqual(innerDiv, "undefined");
	}
    },
    {
	// TODO: Test the adding of a style (here, "box").
	name:
	"6. Create a 7-level tree with DIVs, ContentPanes, and a P",
	setUp: function() {
	    dojo.require("zen.domNode");
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var treeSpec =
		["div", {id:"workingNode6"},
		 [["p", {}, []],
		  ["dijit.layout.ContentPane",
		   {style:{width:"300px",height:"140px",backgroundColor:"red"}},
		   [["div", {},
		     [["dijit.layout.ContentPane",
		       {"class":"box"},
		       [["div", {}, []]]]]]]]]];
	    var topCompon = zen.createTree(treeSpec).rootCompon;
	    zen.body.appendChild(topCompon);
	    doh.assertNotEqual(topCompon, "undefined");
	    var innerDiv = dojo.query("#workingNode4");
	    //console.dir(innerDiv);
	    doh.assertNotEqual(innerDiv, "undefined");
	}
    }
]);