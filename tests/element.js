dojo.provide("zen.tests.element");


// Test Zen element creation.

tests.register("zen.tests.element", [
    {
	name: "Provide zen.DomNodeCompon",
	setUp: function() {
	    dojo.require("zen.element");
	},
	runTest: function(){
	    dojo.require("zen.element");
	    console.debug("typeof zen.DomNodeCompon => " +
			  (typeof zen.DomNodeCompon));
	    doh.assertEqual("function", (typeof zen.DomNodeCompon));
	}
    },
    {
	name: "Provide zen.element",
	setUp: function() {
	    dojo.require("zen.element");
	},
	runTest: function(){
	    dojo.require("zen.element");
	    console.debug("typeof zen.createElement => " +
			  (typeof zen.createElement));
	    doh.assertEqual("function", (typeof zen.createElement));
	}
    },
    {
	name: "Create a DIV HTML element with width, height, & colour",
	setUp: function() {
	    dojo.require("zen.element");
	},
	runTest: function(){
	    var compon = zen.createElement(
		"div",
		{style:{width:"100px",height:"50px",backgroundColor:"blue"}});
	    doh.assertNotEqual("undefined", compon);
	    doh.assertNotEqual("[object HTMLUnknownElement]", compon.domNode);
	    doh.assertEqual(100, dojo.style(compon.domNode,"width"), 100);
	    doh.assertEqual(50, dojo.style(compon.domNode,"height"), 50);
	    var color = new dojo.Color(
		dojo.style(compon.domNode,"backgroundColor"));
	    doh.assertEqual("#0000ff", color.toHex());
	}
    },
    {
	name: "Create a DIV HTML element with width, height, colour, & id",
	setUp: function() {
	    dojo.require("zen.element");
	},
	runTest: function(){
	    var compon = zen.createElement(
		"div",
		{style:{width:"100px",height:"50px",backgroundColor:"red"},
		 id:"red DIV 100 pixels wide and 50 pixels tall"});
	    doh.assertNotEqual("undefined", compon);
	    doh.assertNotEqual("[object HTMLUnknownElement]", compon.domNode);
	    doh.assertEqual(100, dojo.style(compon.domNode,"width"));
	    doh.assertEqual(50, dojo.style(compon.domNode,"height"));
	    var color = new dojo.Color(
		dojo.style(compon.domNode,"backgroundColor"));
	    doh.assertEqual("#ff0000", color.toHex());
	}
    }
]);