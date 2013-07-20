/*! domBuilder v1.0.1 Copyright (c) 2013 Ugot2BkidNme(Barry A. Rader) license: https://github.com/Ugot2BkidNme/domBuilder/blob/master/license.txt */
var domBuilder = (function (window, document, undefined) {
  var
		//check for overwrite
		_domBuilder = window.domBuilder
		//aliases for better compression
		,location = window.location
		,whocalled = arguments.callee
		//for debugging we use console for older browsers this is not an otption so supress it.
		,console = (typeof window.console !== undefined) ? window.console : { log: function(){}, warn: function(){}, error: function(){} }
		//current version
		,version = "1.0.1"
		//attachable events
		//,events = ["abort","attrmodified","blur","broadcast","change","characterdatamodified","click","command","commandupdate","contextmenu","copy","close","cut","dblclick","dragdrop","dragenter","dragexit","draggesture","dragover","error","focus","focusin","focusout","hashchange","input","keydown","keypress","keyup","load","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","mousewheel","nodeinserted","nodeinsertedintodocument","noderemoved","noderemovedfromdocument","overflowchanged","paint","paste","popupHidden","popupHiding","popupShowing","popupShown","reset","resize","scroll","scrolloverflow","select","submit","subtreemodified","text","textinput","textmenu","underflow","unload","wheel"]
		,wc = function (type, string) {
			console[type](string);
		}
		,cp = function(toCheck) {
			if (toCheck === undefined) { return false; }
			return true;
		}
		,buildJSON = function (object) {
			if (!cp(object)) {
				wc("error", "objectect not defined.");
				return false;
			}
			if (!cp(object.target)) {
				wc("error", "target objectect not defined.");
				return false;
			}
			if (!cp(object.elements)) {
				wc("error", "objectect elements not defined.");
				return false;
			}
			if (!(object.elements instanceof Array)) {
				wc("error", "objectect elements must be an array.");
				return false;
			}
			var target = document.getElementById(object.target);
			if (!target) {
				wc("error", "target not found on page.");
				return false;
			}
			for (var element in object.elements) {
				target.appendChild(createElement(object.elements[element]));
			}
		}
		,createElement = function (object) {
			if (!cp(object)) {
				wc("error", "objectect not defined.");
				return;
			}
			if (!cp(object.element)) {
				wc("error", "objectect type not defined.");
				return;
			}
			var element;
			//old IE hacks since modifying a name in IE after the item is created is not allowed
			if (object.element === "input") {
				try {
						element = document.createElement('<input name="'+ object.name +'" />');
					} catch (err) { element = document.createElement('input'); element.setAttribute('name', object.name); }
			} else if (object.element === "select") {
				try {
					i = document.createElement('<select name="'+ object.name +'" />');
				} catch (err) { element = document.createElement('select'); element.setAttribute('name', object.name); }
			} else if (object.element === "textarea") {
				try {
					e = document.createElement('<textarea name="'+ object.name +'" />');
				} catch (err) { element = document.createElement('textarea'); element.setAttribute('name', object.name); }
			}
			else {element = document.createElement(object.element); }
			for (var propertyName in object) {
				//ignore the element as that was used to create the objectect
				if (propertyName === "element") {continue; }
				//ignore the contains element as this would be items found inside of itself.
				if (propertyName === "contains") {continue; }
				//ignore the name element for inputs as this is already taken care of
				if (propertyName === "name" && object.element === "input") {continue; }
				if (propertyName === "class") {element.setAttribute('className', object[propertyName]); } // old IE hack
				element = addAttribute(element, propertyName, object[propertyName]);
			}
			if (cp(object.contains)) {
				element = addContent(element, object.contains)
			}
			return element;
		}
		,addAttribute = function (element, attribute, value) {
			element.setAttribute(attribute, value);
			return element;
		}
		,addContent = function (element, content) {
			if (content instanceof Array) {
				for (var i = 0; i < content.length; i++) {
					if (typeof content[i] === "string") {element.appendChild(document.createTextNode(content[i])); }
					else if (content[i] instanceof Element) {element.appendChild(content[i]); }
					else {element.appendChild(createElement(content[i])); }
				}
			}
			else if (typeof content === "string") {element.appendChild(document.createTextNode(decodeHTML(content))); }
			return element;
		}
		,decodeHTML = function decodeHTML (string){
			var converter = document.createElement("div");
			converter.innerHTML = string;
			var output = converter.innerHTML;
			converter = null;
			return output;
		}
		,getType = function(type, object) {
			object = (cp(object)) ? object : {};
			object.element = type;
			return createElement(object);
		}
	;
	return {
		//expose want we want public to the public
		version: version
		,createElement: createElement
		,buildJSON: buildJSON
		//add shortcut functions
		,html: function (object) { return getType("html", object); }
		,head: function (object) { return getType("head", object); }
		,title: function (object) { return getType("head", object); }
		,base: function (object) { return getType("head", object); }
		,link: function (object) { return getType("link", object); }
		,meta: function (object) { return getType("meta", object); }
		,style: function (object) { return getType("style", object); }
		,script: function (object) { return getType("script", object); }
		,body: function (object) { return getType("body", object); }
		,section: function (object) { return getType("section", object); }
		,nav: function (object) { return getType("nav", object); }
		,article: function (object) { return getType("article", object); }
		,aside: function (object) { return getType("aside", object); }
		,heading: function (object) { return getType("heading", object); }
		,hgroup: function (object) { return getType("hgroup", object); }
		,header: function (object) { return getType("header", object); }
		,footer: function (object) { return getType("footer", object); }
		,address: function (object) { return getType("address", object); }
		,main: function (object) { return getType("main", object); }
		,p: function (object) { return getType("p", object); }
		,hr: function (object) { return getType("hr", object); }
		,pre: function (object) { return getType("pre", object); }
		,blockquote: function (object) { return getType("blockquote", object); }
		,ol: function (object) { return getType("ol", object); }
		,ul: function (object) { return getType("ul", object); }
		,li: function (object) { return getType("li", object); }
		,dl: function (object) { return getType("dl", object); }
		,dt: function (object) { return getType("dt", object); }
		,figure: function (object) { return getType("figure", object); }
		,figcaption: function (object) { return getType("figcaption", object); }
		,div: function (object) { return getType("div", object); }
		,a: function (object) { return getType("a", object); }
		,em: function (object) { return getType("em", object); }
		,strong: function (object) { return getType("strong", object); }
		,small: function (object) { return getType("small", object); }
		,s: function (object) { return getType("s", object); }
		,cite: function (object) { return getType("cite", object); }
		,q: function (object) { return getType("q", object); }
		,dfn: function (object) { return getType("dfn", object); }
		,abbr: function (object) { return getType("abbr", object); }
		,data: function (object) { return getType("data", object); }
		,time: function (object) { return getType("time", object); }
		,code: function (object) { return getType("code", object); }
		,var: function (object) { return getType("var", object); }
		,samp: function (object) { return getType("samp", object); }
		,kbd: function (object) { return getType("kbd", object); }
		,sub: function (object) { return getType("sub", object); }
		,sup: function (object) { return getType("sup", object); }
		,i: function (object) { return getType("i", object); }
		,b: function (object) { return getType("b", object); }
		,u: function (object) { return getType("u", object); }
		,mark: function (object) { return getType("mark", object); }
		,ruby: function (object) { return getType("ruby", object); }
		,rt: function (object) { return getType("rt", object); }
		,rp: function (object) { return getType("rp", object); }
		,bdi: function (object) { return getType("bdi", object); }
		,bdo: function (object) { return getType("bdo", object); }
		,span: function (object) { return getType("span", object); }
		,br: function (object) { return getType("br", object); }
		,wbr: function (object) { return getType("wbr", object); }
		,ins: function (object) { return getType("ins", object); }
		,del: function (object) { return getType("del", object); }
		,img: function (object) { return getType("img", object); }
		,iframe: function (object) { return getType("iframe", object); }
		,embed: function (object) { return getType("embed", object); }
		,objectect: function (object) { return getType("objectect", object); }
		,param: function (object) { return getType("param", object); }
		,video: function (object) { return getType("video", object); }
		,audio: function (object) { return getType("audio", object); }
		,source: function (object) { return getType("source", object); }
		,track: function (object) { return getType("track", object); }
		,canvas: function (object) { return getType("canvas", object); }
		,map: function (object) { return getType("map", object); }
		,area: function (object) { return getType("area", object); }
		,svg: function (object) { return getType("svg", object); }
		,math: function (object) { return getType("math", object); }
		,table: function (object) { return getType("table", object); }
		,caption: function (object) { return getType("caption", object); }
		,colgroup: function (object) { return getType("colgroup", object); }
		,col: function (object) { return getType("col", object); }
		,tbody: function (object) { return getType("tbody", object); }
		,thead: function (object) { return getType("thead", object); }
		,tfoot: function (object) { return getType("tfoot", object); }
		,tr: function (object) { return getType("tr", object); }
		,td: function (object) { return getType("td", object); }
		,th: function (object) { return getType("th", object); }
		,form: function (object) { return getType("form", object); }
		,fieldset: function (object) { return getType("fieldset", object); }
		,legend: function (object) { return getType("legend", object); }
		,label: function (object) { return getType("label", object); }
		,input: function (object) { return getType("input", object); }
		,button: function (object) { return getType("button", object); }
		,select: function (object) { return getType("select", object); }
		,datalist: function (object) { return getType("datalist", object); }
		,optgroup: function (object) { return getType("optgroup", object); }
		,option: function (object) { return getType("option", object); }
		,textarea: function (object) { return getType("textarea", object); }
		,keygen: function (object) { return getType("keygen", object); }
		,output: function (object) { return getType("output", object); }
		,progress: function (object) { return getType("progress", object); }
		,meter: function (object) { return getType("meter", object); }
		,details: function (object) { return getType("details", object); }
		,summary: function (object) { return getType("summary", object); }
		,command: function (object) { return getType("command", object); }
		,menu: function (object) { return getType("menu", object); }
	};
})(window, document);
