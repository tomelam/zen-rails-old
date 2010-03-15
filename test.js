    // Test createNew.
    Foo = function() {
	var a = 1;
	return {
	    // This is a closure. It acts like an
	    // accessor to a private variable.
	    getA : function() {
		return a;
	    }
	};
	
    };
    console.debug('.');
    f = createNew(Foo);
    console.debug('f.a => ' + f.a); // => undefined
    console.debug('f.getA() => ' + f.getA()); // => 1
    Bar = function() {
	this.a = 1;
	return 1;
    }
    console.debug('.');
    b = createNew(Bar);
    console.debug('b.a => ' + b.a); // => 1
    Baz = function(z) {
	this.a = z;
    }
    console.debug('.');
    c = createNew(Baz, 3, 4);
    console.debug('c.a => ' + c.a);

    var tree1 =
    ["div", {style:{width:'180px',height:'180px',backgroundColor:'red'},
	     title:'Title'}, []];
    var tree2 =
    ["div", {style:{width:'200px',height:'200px',backgroundColor:'red'}},
     [["div",
       {style:{width:'180px',height:'180px',backgroundColor:'orange'},
	title:'Title 1'}, []]]];
    var tree3 =
    ["div", {style:{width:'200px',height:'250px',backgroundColor:'red'}},
     [["div",
       {}, []],
      ["table",
       {style:{backgroundColor:'yellow'}, title:'Title 3'},
       [["tr",
	 {style:{height:'50px'}},
	 [["td", {style:{width:'50px'}}, []],
	  ["td", {style:{width:'50px'}}, []]]],
	["tr",
	 {style:{height:'60px'}},
	 [["td", {style:{width:'50px'}}, []],
	  ["td", {style:{width:'50px'}}, []]]],
	["tr",
	 {style:{height:'50px'}},
	 [["td", {style:{width:'50px'}}, []],
	  ["td", {style:{width:'50px'}}, []]]]]],
      ["p", {}, [["span", {}, [["div", {}, []], ["div", {}, []]]],
		  ["div", {}, []]]]]];
    var tree4 =
    ["div", {},
     [["p", {}, []],
      ["dijit.layout.ContentPane",
       {style:{width:"300px",height:"300px",backgroundColor:"red"}},
       []]]];
    var tree5 =
    ["div", {},
     [["p", {}, []],
      ["dijit.layout.ContentPane",
       {"class":"box"},
       []]]];
    var tree6 =
    ["div", {},
     [["p", {}, []],
      ["dijit.layout.ContentPane",
       {style:{width:"300px",height:"140px",backgroundColor:"red"}},
       [["dijit.layout.ContentPane",
	 {"class":"box"},
	 [["div", {}, []]]]]]]];
    var tree7 =
    ["div", {},
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
    var tree8 =
    ["div", {},
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
    var tree9 =
    ["div", {id:"id1"},
     [["dijit.layout.AccordionContainer",
       {style:{width:"100%",height:"400px",backgroundColor:"yellow"}},
       [["dijit.layout.ContentPane",
	 {title:"pane 1"},
	 [["div", {style:{width:"100%",height:"140px",
			  backgroundColor:"orange"}},
	   [["dijit.layout.AccordionContainer",
	     {style:{width:"100%",height:"160px",backgroundColor:"yellow"}},
	     [["dijit.layout.ContentPane",
	       {title:"pane 1"},
	       [["div", {style:{width:"100%",height:"140px",
				backgroundColor:"orange"}}, []]]],
	      ["dijit.layout.ContentPane",
	       {title:"pane 2"},
	       [["div", {style:{width:"100%",height:"140px",
				backgroundColor:"red"}},
		 []]]]]]]]]],
	["dijit.layout.ContentPane",
	 {title:"pane 2"},
	 [["div", {style:{width:"100%",height:"140px",backgroundColor:"red"}},
	   []]]]]]]];
		
    test = function(tree) {
	console.debug("Testing creation of a tree");
	var newComponent;
	newComponent = zen.createSubtree(tree);
	console.debug('newComponent => ' + newComponent);
	newComponent.appendMyselfToParent(dojo.body());
	zen.startup();
	console.debug("Done");
    };
