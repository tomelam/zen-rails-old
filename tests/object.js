dojo.provide("zen.tests.object");


// Test Zen object creation.

tests.register("zen.tests.object", [
    {
	name: "1. Privacy of a private variable",
	setUp: function() {
	    dojo.require("zen.object");
	    Foo1 = function() {
		var pvtVar = 1;
	    };
	    foo1 = createNew(Foo1);
	},
	runTest: function() {
	    doh.assertEqual(String(foo1.pvtVar), "undefined");
	}
    },
    {
	name: "2. Accessor for a private variable",
	setUp: function() {
	    dojo.require("zen.object");
	    Foo2 = function() {
		var pvtVar = 1;
		return {
		    // This is a closure. It acts like an accessor to
		    // a private variable. When Foo2 is instantiated,
		    // pvt cannot be accessed accept via getPvtVar.
		    getPvtVar : function() {
			return pvtVar;
		    }
		};
	    };
	    foo2 = createNew(Foo2);
	},
	runTest: function() {
	    doh.assertEqual(foo2.getPvtVar(), 1);
	}
    },
    {
	name: "3. Access to a public variable",
	setUp: function() {
	    dojo.require("zen.object");
	    Foo3 = function() {
		this.publicVar = 3;
	    };
	    foo3 = createNew(Foo3);
	},
	runTest: function() {
	    doh.assertEqual(foo3.publicVar, 3);
	}
    },
    {
	name: "4. Zen object constructor with 1 argument",
	setUp: function() {
	    dojo.require("zen.object");
	    Foo4 = function(arg1) {
		this.publicVar = arg1;
	    };
	    foo4 = createNew(Foo4, 4);
	},
	runTest: function() {
	    doh.assertEqual(foo4.publicVar, 4);
	}
    },
    {
	name: "5. Create a Zen Set",
	setUp: function() {
	    dojo.require("zen.object");
	},
	runTest: function() {
	    var mySet = createNew(zen.Set);
	    doh.assertNotEqual(null, mySet);
	    doh.assertEqual("function", (typeof mySet.add));
	    doh.assertEqual("function", (typeof mySet.remove));
	    doh.assertEqual("object", (typeof mySet.registry));
	    doh.assertNotEqual("undefined", mySet.registry.length);
	}
    },
    {
	name: "6. Add an object to a Zen Set",
	setUp: function() {
	    dojo.require("zen.object");
	},
	runTest: function() {
	    var mySet = createNew(zen.Set);
	    mySet.add(1);
	    doh.assertEqual(mySet.registry[0], 1);
	    doh.assertEqual(mySet.registry.length, 1);
	}
    },
    {
	name: "7. Add an object to and remove it from a Zen Set",
	setUp: function() {
	    dojo.require("zen.object");
	},
	runTest: function() {
	    var mySet = createNew(zen.Set);
	    mySet.add(1);
	    mySet.remove(1);
	    doh.assertEqual(0, mySet.registry.length);
	}
    }
]);