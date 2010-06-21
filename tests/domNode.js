dojo.provide("zen.tests.domNode");


// Test basic Zen element creation.

tests.register("zen.tests.domNode", [
    {
	name: "1. Define zen.DomNodeCompon",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    doh.assertEqual("function", (typeof zen.DomNodeCompon));
	}
    },
    {
	name: "2. Define zen.DomNodeCompon.fromDomNode",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    doh.assertEqual("function", (typeof zen.DomNodeCompon.fromDomNode));
	}
    },
    {
	name: "3. Define zen.createTextNode",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    doh.assertEqual("function", (typeof zen.createTextNode));
	}
    },
    {
	name: "4. Define zen.createElement",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    doh.assertEqual("function", (typeof zen.createElement));
	}
    },
    {
	name: "5. Create a DIV HTML element with width, height, & colour",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
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
	name: "6. Create a DIV HTML element with width, height, colour, & id",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var compon = zen.createElement(
		"div",
		{style:{width:"100px",height:"50px",backgroundColor:"green"},
		 id:"green DIV 100 pixels wide and 50 pixels tall"});
	    doh.assertNotEqual("undefined", compon);
	    doh.assertNotEqual("[object HTMLUnknownElement]", compon.domNode);
	    doh.assertEqual(100, dojo.style(compon.domNode,"width"));
	    doh.assertEqual(50, dojo.style(compon.domNode,"height"));
	    var color = new dojo.Color(
		dojo.style(compon.domNode,"backgroundColor"));
	    doh.assertEqual("#008000", color.toHex());
	}
    },
    {
	name: "7. Create a TextNode",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var compon = zen.createTextNode("This is a text node!");
	    doh.assertNotEqual("undefined", compon);
	    doh.assertEqual("[object Text]", compon.domNode);
	    doh.assertEqual("This is a text node!", compon.domNode.nodeValue);
	}
    }
]);