dojo.provide("zen.tests.createCompon");


// Test Zen element creation.

tests.register("zen.tests.createCompon", [
    {
	name: "Create a DIV HTML element with width, height, & colour",
	setUp: function() {
	    console.debug("Requiring zen.createCompon");
	    dojo.require("zen.compon");
	},
	runTest: function(){
	    var compon = zen.createElement(
		"div",
		{style:{width:"100px",height:"50px",backgroundColor:"red"}});
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
	    console.debug("Requiring zen.createCompon");
	    dojo.require("zen.compon");
	    d=5;
	},
	runTest: function(){
	    var compon = zen.createElement(
		"div",
		{style:{width:"100px",height:"50px",backgroundColor:"red"},
		 id:"red DIV 100 pixels wide and 50 pixels tall"});
	    doh.assertNotEqual(compon, "undefined");
	    doh.assertNotEqual(compon.domNode, "[object HTMLUnknownElement]");
	    doh.assertEqual(dojo.style(compon.domNode,"width"), 100);
	    doh.assertEqual(dojo.style(compon.domNode,"height"), 50);
	    doh.assertEqual(dojo.style(compon.domNode,"backgroundColor"),
			    "rgb(255, 0, 0)");
	    doh.assertEqual(dojo.style(compon.domNode,"backgroundColor"),
			    "rgb(255, 0, 0)");
	}
    }
]);