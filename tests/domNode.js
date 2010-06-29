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
		{style:{width:"100px", height:"50px", backgroundColor:"blue"}});
	    doh.assertNotEqual("undefined", compon);
	    doh.assertNotEqual("[object HTMLUnknownElement]",
			       compon.getDomNode());
	    doh.assertEqual("[object HTMLDivElement]", compon.getDomNode());
	    doh.assertEqual(100, dojo.style(compon.getDomNode(), "width"));
	    doh.assertEqual(50, dojo.style(compon.getDomNode(), "height"));
	    var color = new dojo.Color(
		dojo.style(compon.getDomNode(), "backgroundColor"));
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
		{style:{width:"100px", height:"50px", backgroundColor:"green"},
		 id:"green DIV 100 pixels wide and 50 pixels tall"});
	    doh.assertNotEqual("undefined", compon);
	    doh.assertNotEqual("[object HTMLUnknownElement]",
			       compon.getDomNode());
	    doh.assertEqual(100, dojo.style(compon.getDomNode(), "width"));
	    doh.assertEqual(50, dojo.style(compon.getDomNode(), "height"));
	    var color = new dojo.Color(
		dojo.style(compon.getDomNode(), "backgroundColor"));
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
	    doh.assertEqual("[object Text]", compon.getDomNode());
	    doh.assertEqual("This is a text node!",
			    compon.getDomNode().nodeValue);
	}
    },
    {
	name: "8. Find a DOM node component in the registry by identity",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var found, color,
		compon = zen.createElement(
		    "div",
		    {style:{width:"10px", height:"10px",
			    backgroundColor:"gray"},
		     id:"find"});
	    compon.appendMyselfToParent(zen.body);
	    found = zen.DomNodeCompon.fromDomNode(dojo.byId("find"));
	    doh.assertEqual("[object HTMLDivElement]", found.getDomNode());
	    doh.assertEqual(10, dojo.style(found.getDomNode(), "width"));
	    doh.assertEqual(10, dojo.style(found.getDomNode(), "height"));
	    color = new dojo.Color(
		dojo.style(found.getDomNode(), "backgroundColor"));
	    doh.assertEqual("#808080", color.toHex());
	}
    },
    {
	name: "9. Find a DOM node component in the registry by 'id' string",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var found, color,
		compon = zen.createElement(
		    "div", {id:"find2", style:{width:"10px", height:"10px",
					       backgroundColor:"pink"}});
	    compon.appendMyselfToParent(zen.body);
	    found = zen.DomNodeCompon.byId("find2");
	    doh.assertEqual("[object HTMLDivElement]", found.getDomNode());
	    doh.assertEqual(10, dojo.style(found.getDomNode(), "width"));
	    doh.assertEqual(10, dojo.style(found.getDomNode(), "height"));
	    color = new dojo.Color(
		dojo.style(found.getDomNode(), "backgroundColor"));
	    doh.assertEqual("#ffc0cb", color.toHex());
	}
    },
    {
	name: "10. Destroy a DOM node component",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var found1, found2,
		compon = zen.createElement("div", {id:"destroy"});
	    compon.appendMyselfToParent(zen.body);
	    found1 = zen.DomNodeCompon.fromDomNode(dojo.byId("destroy"));
	    doh.assertEqual("[object HTMLDivElement]", found1.getDomNode());
	    found1.destroyCompon();
	    found2 = zen.DomNodeCompon.fromDomNode(dojo.byId("destroy"));
	    doh.assertEqual(null, found2);
	}
    },
    {
	name:
	"11. Do not create 2 DOM node components with the same 'id' string",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var found, color, compon;
	    try {
		compon = zen.createElement(
		    "div",
		    {style:{width:"10px", height:"10px",
			    backgroundColor:"gray"},
		     id:"find"});
	    } catch(e) {
	    };
	    doh.assertEqual(null, compon);
	}
    },
    {
	name: "12. Destroy DOM node components in a tree, one by one",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var outer, inner;
	    outer = zen.createElement(
		"div", {id:"outer", style:{width:"35px", height:"35px",
					   backgroundColor:"darkgray"}}),
	    inner = zen.createElement(
		"div", {id:"inner", style:{width:"25px", height:"25px",
					   backgroundColor:"silver"}});
	    outer.appendMyselfToParent(zen.body);
	    inner.appendMyselfToParent(outer);
	    outer = zen.DomNodeCompon.byId("outer");
	    inner = zen.DomNodeCompon.byId("inner");
	    doh.assertEqual(25, dojo.style(inner.getDomNode(), "width"));
	    doh.assertEqual(35, dojo.style(outer.getDomNode(), "width"));
	    inner.destroyCompon();
	    doh.assertEqual(null, zen.DomNodeCompon.byId("inner"));
	    doh.assertNotEqual(null, zen.DomNodeCompon.byId("outer"));
	    doh.assertEqual(35, dojo.style(outer.getDomNode(), "width"));
	    //console.dir(zen.DomNodeCompon.registry);
	    outer = zen.DomNodeCompon.byId("outer");
	    //console.dir(outer);
	    outer.destroyCompon();
	    doh.assertEqual(null, zen.DomNodeCompon.byId("outer"));
	}
    }
]);