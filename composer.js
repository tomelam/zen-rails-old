    zen.installCopiedComponentModeClickHandler = function () {
        var events = ['click', 'mousedown', 'mouseup', 'submit', 'onchange', 'DOMActivate'];
	zen.debug.debug('In installCopiedComponentModeClickHandler');
	for (var i = 0; i < events.length; i++) {
	    //document.addEventListener(events[i], zen1.copiedComponentModeClickHandler, true);
	    this.globalEventHandlers[i] = dojo.connect(document, events[i], zen1.copiedComponentModeClickHandler);
	    //zen.debug.debug('added handler');
	    //firstLinkConnections[0] = dojo.connect(firstLinkNode, 'onclick', foo);
	}
    };

    zen.deinstallCopiedComponentModeClickHandler = function () {
	zen.debug.debug('In deinstallCopiedComponentModeClickHandler');
	for (var i = 0; i < this.globalEventHandlers.length; i++) {
	    dojo.disconnect(this.globalEventHandlers[i]);
	}
    };

    zen.globalMouseoverHandler = function (event) {
	//var node = event.originalTarget;
	var node = event.target; // FIXME: get code that will work in our supported browsers.
	var mode = zen1.mode;
	//zen.debug.debug('In globalMouseoverHandler');
	//zen.debug.debug('globalMouseoverHandler: event = ' + event + ', mode = ' + mode);
	//zen.debug.debug('mouseover event, mouseWasLastOverToolbox = ' + zen1.mouseWasLastOverToolbox);
	if (zen1.mouseCrossedIntoToolbox(node)
	    && (mode == 'Running' || mode == 'CopiedComponent')) {
	    //zen.debug.debug('transition to SelectingComponent mode');
	    zen1.mode = 'SelectingComponent';
	    if (mode == 'CopiedComponent') {
		zen.debug.debug('deinstalling ...');
		zen1.deinstallCopiedComponentModeClickHandler();
		zen.debug.debug("### Crossing of mouse back into toolbox caused deinstallation ...");
	    }
	    //zen.debug.debug('changing cursor style');
	    //document.body.style.cursor = 'copy'; //FIXME: try a url-type cursor & set it according to thing copied
	    document.body.style.cursor = 'pointer';
	    //document.body.style.cursor = url(dojo.baseUrl + 'images/table.png');

	    zen.debug.debug("### Mouseover event caused switch to 'SelectingComponent' mode.");
	} else if (zen1.mouseCrossedOutOfToolbox(node)) {
	    if (mode == 'SelectingComponent') {
		zen1.mode = 'Running';
		document.body.style.cursor = 'default';
		zen.debug.debug("### Mouseover event caused switch to 'Running' mode.");
	    } else if (mode == 'CopiedComponent') {
	        //zen.debug.debug('installing CopiedComponent mode click handler');
		zen1.installCopiedComponentModeClickHandler();
		zen.debug.debug("### Mouseover event caused installation ...");
	    }
	}
    };

    // FIXME: In the following function, dojo.stopEvent() is called, although perhaps it is superfluous.
    zen.copiedComponentModeClickHandler = function (event) {
	//console.group('copiedComponentModeClickHandler: mode = ', zen1.mode);
	//console.dir(event);
	//console.groupEnd();
	zen1.disambiguateTargetAndInsertThere(event);
	dojo.stopEvent(event);  // `prevents propagation and clobbers the default action of the passed event'
	zen1.mode = 'Running';
	zen1.deinstallCopiedComponentModeClickHandler();
	document.body.style.cursor = 'default';
	zen.debug.debug("### Click event caused deinstallation ..., switch to 'Running' mode, & default cursor");
    };

    zen.disambiguateTargetAndInsertThere = function (event) {
	//var node = event.originalTarget;
	var node = event.target; // FIXME: get code that will work in our supported browsers.
	var userConfirmed = false;
	if (event.type != 'mousedown') {
	    zen.debug.debug("Throwing away non-mousedown event");
	    dojo.stopEvent(event);
	    return false;
	}
	while (node.tagName != 'BODY') {
	    zen.debug.debug('disambiguating, node = ' + node);
	    if (zen1.isValidInsertionPoint(node, dojo.byId('insertionRule').value)) {
	        console.debug("valid");
	        if (confirm('Do you want to target this object? tagName: ' + node.tagName + ', className: ' + node.className)) {
		    userConfirmed = true;
		    if (this.nodeIsInsideGivenNode(node, this.canvasNode)) {
		        zen1.lastSelectedNode = node;
		        zen.debug.debug("Evaluating Lisp form " + dojo.byId('txt').value);
		        evalScheme(dojo.byId('txt').value); // lastSelectedNode is used by the Scheme code here.
		        if (!node.zenId) {
		            node.zenId = dojo.dnd.getUniqueId();
		        }
		        zen.debug.debug("### Disambiguation caused evaluation of Lisp form");
		        return true;
		    } else {
		        alert('You chose a target node outside my working area.  Please choose one inside it.');
		        return false;
		    }
		}
	    }
	    console.debug("getting parentNode");
	    node = node.parentNode;
	}
	zen.debug.debug("### Cancellation of disambiguation");
	if (userConfirmed) {
	    alert('Cancelled.');
	} else {
	    alert('The component you chose to add cannot be inserted in the target node.');
	}
	return false;
    };

    zen.isValidInsertionPoint = function (node, insertionRule) {
        console.debug('In isValidInsertionPoint: insertionRule = ' + insertionRule);
        if (dojo.query(insertionRule).indexOf(node) >= 0) {
	    return true;
        } else {
	    return false;
        }
    };

    zen.testJsSchemeFFI = function (foo1, foo2, foo3, foo4) {
        console.debug("foo1, foo2, foo3, foo4: ", foo1, foo2, foo3, foo4);
    };

    zen.makeArray = function(arg1, arg2, arg3) {
        // FIXME: Check that this doesn't produce memory leaks.
        return [ arg1, arg2, arg3 ];
    };

    zen.setWidgetSubpart = function (insertionPoint, insertionCmd) {
        console.debug('insertionCmd = ' + insertionCmd);
	var subpart = insertionCmd[0];
        var insertionPointLocater = insertionCmd[1];
        var insertionRule = insertionCmd[2];
        var node = insertionPoint;
	var isDone = false;
	console.debug('In setWidgetSubpart: subpart = ' + subpart + ', insertionPoint = ' + insertionPoint + ', insertionPointLocater = '
		      + insertionPointLocater + ', insertionRule = ' + insertionRule);
        for (var i=0; i<6; i++) { // Set a limit how far upwards to search.
	    console.debug("examining node " + node);
	    if (zen1.isValidInsertionPoint(node, insertionPointLocater)) {
		console.debug("found valid insertion point = " + node);
		console.debug("dojo.query(insertionRule, node) = " + dojo.query(insertionRule, node));
		dojo.query(insertionRule, node.parentNode).forEach(function(matchingNode, index, arr) {
		    console.debug("matchingNode = " + matchingNode);
		    matchingNode.innerHTML = subpart;
		    isDone = true;
		});
		break;
	    } else {
		node = node.parentNode;
	    }
	}
	if (!isDone) {
            alert('The component you chose to add cannot be inserted in the target node.');
	}
	return isDone;
    };

    zen.nodeIsInsideGivenNode = function (node, givenNode) {
        //return true;
	while (node != document) {
	    //zen.debug.debug('node = ' + node);
	    if (node == givenNode) {
	        return true;
	    }
	    node = node.parentNode;
	}
	return false;
    };

    zen.startupContainer = function (node) {
        var widget, parentWidget;
	//zen.debug.debug('entering startupContainer');
	widget = dijit.byNode(node);
	if (widget) {
	    //zen.debug.debug('starting up parent (if any) of widget ' + widget);
	    try {
	        parentWidget = widget.getParent();
		//zen.debug.debug('parentWidget = ' + parentWidget);
		if (parentWidget) {
		    parentWidget.startup();
		}
	    }
	    catch (e) {
	    }
	}
    };

    zen.mouseIsOverToolbox = function (node) {
	//var toolboxList = dojo.query(".zenToolbox").concat(dojo.query(".zenHTMLToolbox"));
	var toolboxList = dojo.query("#zenNode");
	//zen.debug.debug("Entering mouseIsOverToolbox, toolboxList.length = " + toolboxList.length);
	zen1.mouseWasLastOverToolbox = false;
	while (node != document) {
	  //console.debug("node['id'] = " + node['id']);
	    if (dojo.some(toolboxList, function(toolboxNode) {
		        //zen.debug.debug("In over-toolbox filter, toolboxNode = " + toolboxNode);
			return node == toolboxNode;
	    })) {
	        //zen.debug.debug("Returning true from mouseIsOverToolbox");
		zen1.mouseWasLastOverToolbox = true;
		return true;
	    }
	    node = node.parentNode;
	}
	//zen.debug.debug("Returning false from mouseIsOverToolbox");
	return false;
    };

    zen.mouseCrossedIntoToolbox = function (node) {
	//zen.debug.debug("Entering mouseCrossedIntoToolbox");
	if (!zen1.mouseWasLastOverToolbox && zen1.mouseIsOverToolbox(node)) {
	    zen.debug.debug('### mouse crossed into toolbox');
	    return true;
	}
	//zen.debug.debug('mouse did not cross into toolbox');
	return false;
    };

    zen.mouseCrossedOutOfToolbox = function (node) {
	//zen.debug.debug("Entering mouseCrossedOutOfToolbox");
	if (zen1.mouseWasLastOverToolbox && !zen1.mouseIsOverToolbox(node)) {
	    zen.debug.debug('### mouse crossed out of toolbox');
	    return true;
	}
	//zen.debug.debug('mouse did not cross out of toolbox');
	return false;
    };

    zen.storeSexp = function (dojoEvent) {
	//zen.debug.debug('storeSexp');
	var lispForm = dojoEvent.currentTarget.lispForm;
	var insertionRule = dojoEvent.currentTarget.insertionRule;
	//zen.debug.debug(lispForm);
	console.debug('In storeSexp: insertionRule = ' + insertionRule);
	dojo.byId('txt').value = lispForm;
	dojo.byId('insertionRule').value = insertionRule;
	//clickEval(); // FIXME: call clickEval or evalScheme only from disambiguateTargetAndInsertHere
	zen1.mode = 'CopiedComponent';
	//zen.debug.debug('storeSexp: change cursor style');
	document.body.style.cursor = 'crosshair';
	zen.debug.debug("### Click caused storing of sexp and switch to 'CopiedComponent' mode; changed cursor to crosshair");
    };

    zen.storeAndEvalSexp = function (dojoEvent) {
	//zen.debug.debug('storeAndEvalSexp');
	var lispForm = dojoEvent.currentTarget.lispForm;
	//zen.debug.debug(lispForm);
	evalScheme(lispForm);
    };

    zen.testGreeting = function () {
	alert('Ready');
    };

    zen.toggleReplEvent = function (event) {
	var replNode = dojo.byId("repl");
	if (zen1.replShowing) {
	    dojo.style(replNode, "display", "none");
	    dojo.byId('toggleInfo').innerHTML="Zen uses jsScheme. To use jsScheme, read its license or download it, click here.";
	    dojo.style("toggleInfo", "position", "absolute");
	    dojo.style("toggleInfo", "top", "" + (dijit.getViewport().h-60) + "px");
	    dojo.style("zenNode", "border", "");
	}
	else {
	    dojo.style(replNode, "display", "inline");
	    dojo.style(replNode, "border", "5");
	    dojo.byId("txt").focus();
	    dojo.byId('toggleInfo').innerHTML="To hide jsScheme and information about it, click here.";
	    dojo.style("toggleInfo", "position", "relative");
	    dojo.style("toggleInfo", "top", "0px");
	    dojo.style("zenNode", "border", "solid yellow 2px");
	}
	zen1.replShowing = !zen1.replShowing;
	dojo.stopEvent(event); // Prevents '#' from getting appended in the browser address bar.
    };

    zen.loadToolEditor = function (event) {
        evalSchemeFile("conf/tool-editor.txt");
	if (typeof event != 'undefined') {
	  dojo.stopEvent(event);
	}
    };

    zen.loadDevTools = function () {
        evalSchemeFile("conf/dev-tools.txt");
	if (typeof event != 'undefined') {
	  dojo.stopEvent(event);
	}
    };

    zen.loadHTMLTagTools = function (event) {
	evalSchemeFile("conf/html.txt");
	if (typeof event != 'undefined') {
	  dojo.stopEvent(event);
	}
    };

    zen.loadDojoTools = function (event) {
        evalSchemeFile("conf/dojo.txt");
	if (typeof event != 'undefined') {
	  dojo.stopEvent(event);
	}
    };

    zen.loadGGTools = function (event) {
        evalSchemeFile("conf/gg.txt");
	if (typeof event != 'undefined') {
	  dojo.stopEvent(event);
	}
    };

    zen.loadUserConfig = function (event) {
	evalSchemeFile("zen-user-config/user-config.txt");
	if (typeof event != 'undefined') {
	  dojo.stopEvent(event);
	}
    };

    zen.saveUserConfig = function (event) {
	//zen.debug.debug("saving file");
	dojo.xhrPost({
	    url:dojo.baseUrl + 'php/save_file.php',
	    content:{filename:'../zen-user-config/user-config.txt',filecontent:zen1.getCurrentConfig()},
	    error:function(data, ioArgs) {
		alert('Network error while sending of page data, please try again ...');
	    }
	});
	if (typeof event != 'undefined') {
	  dojo.stopEvent(event);
	}
    };

    zen.getCurrentConfig = function () {
	//zen.debug.debug('in getCurrentConfig');
	//zen.debug.debug('dojo.byId("txt") => ' + dojo.byId('txt')); //FIXME: Doesn't this work?
	//zen.debug.debug('dojo.byId("txt") => ' + dojo.byId('txt'));
	//zen.debug.debug('dojo.byId("txt").value => ' + dojo.byId('txt').value);
	dojo.byId('txt').value = '(save-user-config)'; //FIXME: Do we need this?
	evalScheme('(save-user-config)');
	//zen.debug.debug("" + dojo.byId('txt').value);
	return dojo.byId('txt').lispForm; //.replace(/\|#/g,'"');
    };

    zen.listPosition = function (node, nodeList) {
	//zen.debug.debug('in listPosition: node = ' + node + ', nodeList = ' + nodeList);
	for (var i=0; i < nodeList.length; i++) {
	    if (node === nodeList[i]) {
		//zen.debug.debug("returning " + i);
		// The offset is changed because using an undefined value can only be
		// tested with IF, but 0 (zero) is not distinguished from undefined
		// so far as IF is concerned.
		return i + 1;
	    }
	}
	//zen.debug.debug("couldn't find node"); // Return value is undefined -- on purpose
    };

    zen.nodeListLength = function (nodeList) {
	//zen.debug.debug('nodeListLength: ', nodeList.length);
	return nodeList.length;
    };

    zen.arefNodeList = function (idx, nodeList) {
	return nodeList[idx];
    };

    zen.boot = function(workingNodeId) { //FIXME: Put startupAC just above this?
	var node;
	this.workingNode = dojo.byId(workingNodeId);
	this.canvasNode = this.workingNode;
	node = dojo.byId('zenNode');
	var zenContentPane = new dijit.layout.ContentPane({style:"width:1000px;"}, node);
	//zenContentPane.setHref(dojo.baseUrl + 'zenHTML.html'); //FIXME: Let Zen exist anywhere relative to the web server's document root.
	zenContentPane.attr('href', dojo.baseUrl + 'zenHTML.html'); //FIXME: Let Zen exist anywhere relative to the web server's document root.
	dojo.connect(zenContentPane, 'onLoad', initZen);

	//zen1.installCopiedComponentModeClickHandler();

	this.booted = true;
    }
