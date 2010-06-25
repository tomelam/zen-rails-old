dojo.provide("zen.tests.component");


// Test Zen generic-component creation.

tests.register("zen.tests.component", [
    {
	name:
	"1. Get a reference to an element constructor, given a shortcut name",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var ref = zen.rule2ref("createElement");
	    doh.assertEqual(ref.toString(), zen.createElement.toString());
	}
    },
    {
	name:
	"2. Get a reference to a TextNode constructor, given a shortcut name",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var ref = zen.rule2ref("createTextNode");
	    doh.assertEqual(ref.toString(), zen.createTextNode.toString());
	}
    },
    {
	name:
	"3. Get a ref to an DOM node component constructor, given a full name",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var ref = zen.rule2ref("createElement");
	    doh.assertEqual(ref.toString(), zen.createElement.toString());
	}
    },
    {
	name: "4. Create a DIV HTML element with width, height, colour, & id",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var compon = zen.createCompon(
		["div",
		 {style:{width:"100px",height:"50px",backgroundColor:"red"},
		  id:"red DIV 100 pixels wide and 50 pixels tall"}]);
	    doh.assertNotEqual("undefined", compon);
	    doh.assertNotEqual("[object HTMLUnknownElement]", compon.domNode);
	    doh.assertEqual(100, dojo.style(compon.domNode,"width"));
	    doh.assertEqual(50, dojo.style(compon.domNode,"height"));
	}
    }
]);