////
//// UNIT TESTS
////
//// See http://www.sitepen.com/blog/2008/04/15/unit-testing-custom-code-with-the-dojo-objective-harness/
//// and http://www.dojotoolkit.org/reference-guide/quickstart/doh.html


sayHello = function() { alert("Hi!"); }


////
//// RENDERING-TEST CONFIGURATIONS
////
var tree1 =
["div", {style:{width:"180px",height:"180px",backgroundColor:"red"},
	 id:"workingNode1",title:"Title"}, []];
var tree2 =
["div", {id:"workingNode2",
	 style:{width:"200px",height:"200px",backgroundColor:"red"}},
 [["div", {id:"workingNode2b",
	   style:{width:"180px",height:"180px",backgroundColor:"orange"},
	   title:"Title 1"}, []]]];
var tree3 =
["div", {id:"workingNode3",
	 style:{width:"200px",height:"250px",backgroundColor:"red"}},
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
var tree4 =
["div", {id:"workingNode4"},
 [["p", {}, []],
  ["dijit.layout.ContentPane",
   {style:{width:"300px",height:"300px",backgroundColor:"red"}},
   []]]];
var tree5 =
["div", {id:"workingNode5"},
 [["p", {}, []],
  ["dijit.layout.ContentPane",
   {"class":"box"},
   []]]];
var tree6 =
["div", {id:"workingNode6"},
 [["p", {}, []],
  ["dijit.layout.ContentPane",
   {style:{width:"300px",height:"140px",backgroundColor:"red"}},
   [["div", {},
     [["dijit.layout.ContentPane",
       {"class":"box"},
       [["div", {}, []]]]]]]]]];
// tree6b does not work: ContentPane has no 'addChild' method.
var tree6b =
["div", {id:"workingNode6b"},
 [["p", {}, []],
  ["dijit.layout.ContentPane",
   {style:{width:"300px",height:"140px",backgroundColor:"red"}},
   [["dijit.layout.ContentPane",
     {"class":"box"},
     [["div", {}, []]]]]]]];
var tree7 =
["dijit.layout.AccordionContainer",
 {id:"workingNode7",
  style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
 [["dijit.layout.AccordionPane",
   {id:"insideWorkingNode",title:"pane 1"},
   []],
  ["dijit.layout.AccordionPane",
   {id:"cp1",title:"pane 2"},
   []]]];
var tree8 =
["dijit.layout.AccordionContainer",
 {id:"workingNode8",
  style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
 [["dijit.layout.ContentPane",
   {title:"pane 1"},
   []]]];
var tree9 =
["div", {id:"workingNode9"},
 [["dijit.layout.AccordionContainer",
   {style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
   [["dijit.layout.AccordionPane",
     {title:"pane 1"},
     [["div", {style:{width:"100%",height:"140px",
		      backgroundColor:"orange"}}, []]]],
    ["dijit.layout.AccordionPane",
     {title:"pane 2"},
     [["div", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
       []]]]]]]];
var tree10 =
["div", {id:"workingNode10"},
 [["dijit.layout.AccordionContainer",
   {style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
   [["dijit.layout.ContentPane",
     {title:"pane 1"},
     [["div", {style:{width:"100%",height:"140px",
		      backgroundColor:"orange"}}, []]]],
    ["dijit.layout.ContentPane",
     {title:"pane 2"},
     [["div", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
       []]]]]]]];
var tree11 =
["div", {id:"workingNode11"},
 [["dijit.layout.AccordionContainer",
   {id:"ac0",style:{width:"100%",height:"400px",backgroundColor:"yellow"}},
   [["dijit.layout.ContentPane",
     {id:"cp00",title:"pane 1"},
     [["div", {id:"d000",style:{width:"100%",height:"140px",
				backgroundColor:"orange"}},
       [["dijit.layout.AccordionContainer",
	 {id:"ac0000",
	  style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
	 [["dijit.layout.ContentPane",
	   {id:"cp00000",title:"pane 1"},
	   [["div", {id:"cp000000",style:{width:"100%",height:"140px",
					  backgroundColor:"orange"}}, []]]],
	  ["dijit.layout.ContentPane",
	   {id:"cp00001",title:"pane 2"},
	   [["div", {id:"d000000",style:{width:"100%",height:"140px",
					 backgroundColor:"red"}},
	     []]]]]]]]]],
    ["dijit.layout.ContentPane",
     {id:"cp01",title:"pane 2"},
     [["div", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
       []]]]]]]];
var tree12 =
["dijit.layout.AccordionContainer",
 {id:"workingNode12",
  style:{width:"100%",height:"400px",backgroundColor:"yellow"}},
 [["dijit.layout.ContentPane",
   {id:"cp02",title:"pane 1"},
   [["div", {id:"d001",style:{width:"100%",height:"140px",
			      backgroundColor:"orange"}},
     [["dijit.layout.AccordionContainer",
       {id:"ac0001",
	style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
       [["dijit.layout.ContentPane",
	 {id:"cp00002",title:"pane 1"},
	 [["div", {id:"cp000001",style:{width:"100%",height:"140px",
					backgroundColor:"orange"}}, []]]],
	["dijit.layout.ContentPane",
	 {id:"cp00003",title:"pane 2"},
	 [["div", {id:"d000000",style:{width:"100%",height:"140px",
				       backgroundColor:"red"}},
	   []]]]]]]]]],
  ["dijit.layout.ContentPane",
   {id:"cp01",title:"pane 2"},
   [["div", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
     []]]]]];
var devTools =
["dojox.layout.FloatingPane",
 {id:"workingNodeDT",
  title:"Main Controls",style:{bottom:"30px",right:"30px"},closable:true},
 [["center", {},
   [["dijit.form.Button",
     {label:"Clear the Canvas",onClick:zen.clearTheCanvas}, []],
    ["br", {}, []],
    ["dijit.form.Button",
     {label:"Clear the Canvas",onClick:sayHello}, []],
    ["br", {}, []],
    ["dijit.form.Button",
     {label:"Clear the Canvas",onClick:sayHello}, []],
    ["br", {}, []],
    ["dijit.form.Button",
     {label:"Clear the Canvas",onClick:sayHello}, []],
    ["br", {}, []],
    ["dijit.form.Button",
     {label:"Clear the Canvas",onClick:sayHello}, []],
    ["br", {}, []],
    ["dijit.form.Button",
     {label:"Clear the Canvas",onClick:sayHello}, []]]]]];
var underlay =
["dijit.DialogUnderlay",
 {id:"workingNodeUL",style:{width:"100%",height:"200px",
			    backgroundColor:"lightgreen"}},
 []];
var pane =
["dijit.layout.ContentPane",
 {id:"workingNodeCP",style:{width:"100%",height:"200px",
			    backgroundColor:"lightgreen"}},
 []];

var newCompons = [];
var canvas = createNew(zen.TreeCompons);


//FIXME: Have to think about the use of the same id
 //(e.g. 'workingNode') for many elements. Note that deleting a
 //tree should remove the conflicting element, so trying to delete
 //a tree and add it or another using the same id would be a good
 //test.
test = function(tree) {
    var diagram, newTree;
    newTree = zen.renderTree(tree, zen.body);
    newTree.doNotDelete = false;
    zen.Tree.allTrees.push(newTree);
    diagram = zen.diagramTree(newTree.rootCompon);
};
    
clearTheTestRendering = function() {
    dojo.forEach(zen.Tree.allTrees,
		 function(zenTree) {
		     if (!zenTree.doNotDelete) {
			 zenTree.rootCompon.destroyCompon();
		     };
		 });
};


////
//// INITIALIZE TOOLBOX AND SOME VARIABLES
////
////
testInit = function() {
    //FIXME: This version of toolbox is just for testing. Think of a
    //way it can be kept for regression testing.
    var toolboxTree, componsToSave,
	toolbox =
    ["dojox.layout.FloatingPane",
     {id:"testRendering",
      title:"Rendering Tests",style:{top:"30px",right:"30px"},closable:true},
     [["center", {},
       [["dijit.form.Button",
	 {label:"Clear the Test Rendering",
	  onClick:function() {
	      clearTheTestRendering();
	  }},
	 []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"Clear the Canvas",
	  onClick:function() {
	      clearTheCanvas();
	  }},
	 []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"Clear the Hierarchy Chart",
	  onClick:function(){zen.clearTheHierarchyDiagram()}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 1: red DIV",
	  onClick:function(){test(tree1)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 2: red DIV with orange DIV",
	  onClick:function(){test(tree2)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 3: red DIV with table",
	  onClick:function(){test(tree3)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 4: DIV with P and red ContentPane",
	  onClick:function(){test(tree4)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 5: DIV (id:workingNode) with<br/>ContentPane (class:box)",
	  onClick:function(){test(tree5)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:
	  "test 6: DIV w/ P & red ContentPane<br/>w/ box ContentPane w/ DIV",
	  onClick:function(){test(tree6)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:
	  "test 7: AccordionContainer & AccordionPanes<br/>" +
	  "'workingNode' & 'cp1'",
	  onClick:function(){test(tree7)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:
	  "test 8: AccordionContainer 'workingNode' & AccordionPane with title",
	  onClick:function(){test(tree8)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 9: AccordionContainer w/ AccordionPanes, each w/ DIV",
	  onClick:function(){test(tree9)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 10: AccordionContainer w/ AccordionPanes, each /w DIV",
	  onClick:function(){test(tree10)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 11: nested AccordionPanes & ContentPanes",
	  onClick:function(){test(tree11)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"test 12: nested AccordionPanes & ContentPanes",
	  onClick:function(){test(tree12)}}, []],
	["br", {}, []],
	["dijit.form.Button",
	 {label:"Main Controls",onClick:function(){test(devTools)}}, []]]]]];
    dojo.require("zen.object");
    dojo.require("zen.component");
    dojo.require("zen.domNode");
    dojo.require("zen.dojoWidget");
    zen.body = createNew(zen.DomNodeCompon, dojo.body());
    toolboxTree = zen.renderTree(toolbox, zen.body);
    toolboxTree.doNotDelete = true;
    zen.Tree.allTrees.push(toolboxTree);
    newCompons = null;
};
