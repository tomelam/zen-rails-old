dojo.provide("zen.tests.component");


// Test Zen generic-component creation.

tests.register("zen.tests.component", [
    {
	name: "Create a DIV HTML element with width, height, & colour",
	setUp: function() {
	    //dojo.require("zen.element");
	    dojo.require("zen.component");
	},
	runTest: function(){
	    var compon = zen.createCompon(
		["div",
		 {style:{width:"100px",height:"50px",backgroundColor:"red"}}]);
	    doh.assertNotEqual(compon, "undefined");
	    doh.assertNotEqual(compon.domNode, "[object HTMLUnknownElement]");
	    doh.assertEqual(dojo.style(compon.domNode,"width"), 100);
	    doh.assertEqual(dojo.style(compon.domNode,"height"), 50);
	    doh.assertEqual(dojo.style(compon.domNode,"backgroundColor"),
			    "rgb(255, 0, 0)");
	}
    },
    {
	name: "Create a DIV HTML element with width, height, colour, & id",
	setUp: function() {
	    dojo.require("zen.component");
	},
	runTest: function(){
	    var compon = zen.createCompon(
		["div",
		 {style:{width:"100px",height:"50px",backgroundColor:"red"},
		  id:"red DIV 100 pixels wide and 50 pixels tall"}]);
	    doh.assertNotEqual(compon, "undefined");
	    doh.assertNotEqual(compon.domNode, "[object HTMLUnknownElement]");
	    doh.assertEqual(dojo.style(compon.domNode,"width"), 100);
	    doh.assertEqual(dojo.style(compon.domNode,"height"), 50);
	    doh.assertEqual(dojo.style(compon.domNode,"backgroundColor"),
			    "rgb(255, 0, 0)");
	}
    },
    {
	name: "Create a DIV inside a DIV, each DIV having attributes",
	setUp: function() {
	    dojo.require("zen.component");
	},
	runTest: function(){
	    var compon = zen.createCompon(
		["div", {id:"workingNode2",
			 style:{width:"200px",height:"50px",
				backgroundColor:"red"}},
		 [["div", {id:"workingNode2b",
           style:{width:"180px",height:"180px",backgroundColor:"orange"},
           title:"Title 1"}, []]]]);
	    doh.assertNotEqual(compon, "undefined");
	    doh.assertNotEqual(compon.domNode, "[object HTMLUnknownElement]");
	    doh.assertEqual(dojo.style(compon.domNode,"width"), 200);
	    doh.assertEqual(dojo.style(compon.domNode,"height"), 50);
	    doh.assertEqual(dojo.style(compon.domNode,"backgroundColor"),
			    "rgb(255, 0, 0)");
	}
    }
]);