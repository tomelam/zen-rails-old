dojo.provide("zen.tests.dojoWidget");


// Test basic Dojo widget handling.

tests.register("zen.tests.dojoWidget", [
    {
	name: "1. Define zen.dojoWidget.startup",
	setUp: function() {
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    doh.assertEqual("function", (typeof zen.dojoWidget.startup));
	}
    },
    {
	name: "2. Define zen.createDojoWidget",
	setUp: function() {
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    doh.assertEqual("function", (typeof zen.createDojoWidget));
	}
    },
    {
	name: "3. Create a dijit.layout.ContentPane",
	setUp: function() {
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var compon = zen.createDojoWidget(
		"dijit.layout.ContentPane",
		{style:{width:"40px", height:"50px", backgroundColor:"green"},
		 id:"green ContentPane 40 pixels wide and 50 pixels tall"});
	    doh.assertNotEqual("undefined", compon);
	    doh.assertEqual("[object HTMLDivElement]", compon.getDomNode());
	    doh.assertEqual(40, dojo.style(compon.domNode,"width"));
	    doh.assertEqual(50, dojo.style(compon.domNode,"height"));
	}
    },
    {
	name: "4. Create a dijit.layout.BorderContainer",
	setUp: function() {
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var compon = zen.createDojoWidget(
		"dijit.layout.BorderContainer",
		{style:{width:"50px", height:"60px", backgroundColor:"blue"},
		 id:"blue BorderContainer 50 x 60 pixels"});
	    doh.assertEqual("[object HTMLDivElement]", compon.getDomNode());
	    doh.assertEqual(50, dojo.style(compon.domNode,"width"));
	    doh.assertEqual(60, dojo.style(compon.domNode,"height"));
	}
    },
    {
	name: "5. Create a dijit.layout.AccordionContainer",
	setUp: function() {
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var compon = zen.createDojoWidget(
		"dijit.layout.AccordionContainer",
		{style:{width:"200px", height:"70px", backgroundColor:"yellow"},
		 id:"yellow AccordionContainer 200 x 70 pixels"});
	    doh.assertEqual("[object HTMLDivElement]", compon.getDomNode());
	    doh.assertEqual(200, dojo.style(compon.domNode,"width"));
	    doh.assertEqual(70, dojo.style(compon.domNode,"height"));
	}
    },
    {
	name: "6. Create an orange dijit.DialogUnderlay",
	setUp: function() {
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var compon = zen.createDojoWidget(
	      "dijit.DialogUnderlay",
	      {style:{width:"500px", height:"20px", backgroundColor:"orange"},
	       id:"orange DialogUnderlay 500 pixels wide and 20 pixels tall"});
	    doh.assertEqual("[object HTMLDivElement]", compon.getDomNode());
	    doh.assertEqual(500, dojo.style(compon.domNode,"width"));
	    doh.assertEqual(20, dojo.style(compon.domNode,"height"));
	}
    },
    {
	name: "7. Create a red dijit.layout.AccordionContainer",
	setUp: function() {
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var compon = zen.createDojoWidget(
		"dijit.layout.AccordionContainer",
		{style:{width:"500px", height:"90px", backgroundColor:"red"},
		 id:"red AccordionContainer 500 x 90 pixels"});
	    doh.assertEqual("[object HTMLDivElement]", compon.getDomNode());
	    doh.assertEqual(500, dojo.style(compon.domNode,"width"));
	    doh.assertEqual(90, dojo.style(compon.domNode,"height"));
	}
    },
    {
	name: "8. Create a blue dojox.layout.FloatingPane",
	setUp: function() {
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var compon = zen.createDojoWidget(
		"dojox.layout.FloatingPane",
		{style:{width:"500px", height:"100px", backgroundColor:"blue"},
		 id:"blue FloatingPane 500 pixels wide and 100 pixels tall"});
	    doh.assertEqual("[object HTMLDivElement]", compon.getDomNode());
	    doh.assertEqual(500, dojo.style(compon.domNode,"width"));
	    doh.assertEqual(100, dojo.style(compon.domNode,"height"));
	}
    },
    {
	name: "9. Find a gray Dojox ContentPane in the registry",
	setUp: function() {
	    dojo.require("zen.domNode");
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var found,
		compon = zen.createDojoWidget(
		    "dojox.layout.ContentPane",
		    {style:{width:"500px",
			    height:"20px", backgroundColor:"gray"},
		     id:"Dojo widget 1"});
	    compon.appendMyselfToParent(zen.body);
	    doh.assertEqual("[object HTMLDivElement]", compon.getDomNode());
	    doh.assertEqual(500, dojo.style(compon.domNode,"width"));
	    doh.assertEqual(20, dojo.style(compon.domNode,"height"));
	    found = zen.dojoWidget.byId("Dojo widget 1");
	    doh.assertEqual("[object HTMLDivElement]", found.getDomNode());
	    doh.assertEqual(500, dojo.style(found.getDomNode(), "width"));
	    doh.assertEqual(20, dojo.style(found.getDomNode(), "height"));
	    color = new dojo.Color(
		dojo.style(found.getDomNode(), "backgroundColor"));
	    doh.assertEqual("#808080", color.toHex());
	}
    },
    {
	name: "10. Do not create 2 Dojo widgets with the same 'id' string",
	setUp: function() {
	    dojo.require("zen.domNode");
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var found, compon;
	    try {
		compon = zen.createDojoWidget(
		    "dojox.layout.ContentPane",
		    {style:{width:"500px",
			    height:"20px", backgroundColor:"darkgray"},
		     id:"Dojo widget 1"});
	    } catch(e) {
	    };
	    doh.assertEqual(null, compon);
	}
    },
    {
	name: "11. Find a Dojo widget in the registry by 'id' string",
	setUp: function() {
	    dojo.require("zen.domNode");
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var found,
		compon = zen.createDojoWidget(
		    "dojox.layout.ContentPane",
		    {style:{width:"500px",
			    height:"20px", backgroundColor:"antiquewhite"},
		     id:"Dojo widget 2"});
	    compon.appendMyselfToParent(zen.body);
	    doh.assertEqual("[object HTMLDivElement]", compon.getDomNode());
	    doh.assertEqual(500, dojo.style(compon.domNode,"width"));
	    doh.assertEqual(20, dojo.style(compon.domNode,"height"));
	    found = zen.dojoWidget.byId("Dojo widget 2");
	    doh.assertEqual("[object HTMLDivElement]", found.getDomNode());
	    doh.assertEqual(500, dojo.style(found.getDomNode(), "width"));
	    doh.assertEqual(20, dojo.style(found.getDomNode(), "height"));
	    color = new dojo.Color(
		dojo.style(found.getDomNode(), "backgroundColor"));
	    doh.assertEqual("#faebd7", color.toHex());
	}
    },
    {
	name: "12. Destroy a Dojo widget",
	setUp: function() {
	    dojo.require("zen.domNode");
	    dojo.require("zen.dojoWidget");
	},
	runTest: function() {
	    var found1, found2,
		compon = zen.createDojoWidget(
		    "dojox.layout.ContentPane",
		    {style:{width:"500px",
			    height:"20px", backgroundColor:"purple"},
		     id:"Dojo widget 3"});
	    compon.appendMyselfToParent(zen.body);
	    doh.assertEqual("[object HTMLDivElement]", compon.getDomNode());
	    doh.assertEqual(500, dojo.style(compon.domNode,"width"));
	    doh.assertEqual(20, dojo.style(compon.domNode,"height"));
	    found = zen.dojoWidget.byId("Dojo widget 3");
	    doh.assertEqual("[object HTMLDivElement]", found.getDomNode());
	    doh.assertEqual(500, dojo.style(found.getDomNode(), "width"));
	    doh.assertEqual(20, dojo.style(found.getDomNode(), "height"));
	    color = new dojo.Color(
		dojo.style(found.getDomNode(), "backgroundColor"));
	    doh.assertEqual("#800080", color.toHex());
	}
    },
    {
	name: "13. Destroy Dojo widgets in a tree, one by one",
	setUp: function() {
	    dojo.require("zen.domNode");
	},
	runTest: function() {
	    var outer, inner;
	    outer = zen.createDojoWidget(
		"dijit.layout.AccordionContainer",
		{style:{width:"500px", height:"80px", backgroundColor:"blue"},
		 id:"outer-widget",
		 region:"center"});
	    inner = zen.createDojoWidget(
		"dijit.layout.AccordionPane",
		{style:{width:"100%", height:"50px", backgroundColor:"pink"},
		 id:"inner-widget",
		 title:"Tab 1"});
	    inner2 = zen.createDojoWidget(
		"dijit.layout.AccordionPane",
		{style:{width:"100%", height:"50px", backgroundColor:"yellow"},
		 id:"inner-widget-2",
		 title:"Tab 2"});
	    inner.appendMyselfToParent(outer);
	    inner2.appendMyselfToParent(outer);
	    outer.appendMyselfToParent(zen.body);
	    inner = zen.dojoWidget.byId("inner widget");
	    outer = zen.dojoWidget.byId("outer widget");
	    doh.assertEqual(50, dojo.style(inner.getDomNode(), "height"));
	    doh.assertEqual(80, dojo.style(outer.getDomNode(), "height"));
	    //inner.destroyCompon();
	    inner = zen.dojoWidget.byId("inner widget");
	    console.group("Test 13: inner");
	    console.dir(inner);
	    console.groupEnd();
	    console.group("fullSet");
	    console.dir(zen.dojoWidget.fullSet);
	    console.groupEnd();
	    doh.assertEqual(null, zen.dojoWidget.byId("inner widget"));
	    doh.assertNotEqual(null, zen.dojoWidget.byId("outer widget"));
	    doh.assertEqual(80, dojo.style(outer.getDomNode(), "height"));
	    //console.dir(zen.dojoWidget.registry);
	    outer = zen.dojoWidget.byId("outer widget");
	    //console.dir(outer);
	    outer.destroyCompon();
	    doh.assertEqual(null, zen.dojoWidget.byId("outer widget"));
	}
    }
]);