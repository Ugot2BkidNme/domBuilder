/*! domBuilder v1.0.0 Copyright (c) 2013 Ugot2BkidNme(Barry A. Rader)
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function (window, undefined) {
	this.domBuilder = function() {
	var
		//check for overwrite
		//aliases for better compression
		document = window.document
		,location = window.location
		,whocalled = arguments.callee
		//for debugging we use console for older browsers this is not an otption so supress it.
		,console = (typeof window.console !== undefined) ? window.console : { log: function(){}, warn: function(){}, error: function(){} }
		//current version
		,version = "1.0.0"
		//attachable events
		,events = ["abort","attrmodified","blur","broadcast","change","characterdatamodified","click","command","commandupdate","contextmenu","copy","close","cut","dblclick","dragdrop","dragenter","dragexit","draggesture","dragover","error","focus","focusin","focusout","hashchange","input","keydown","keypress","keyup","load","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","mousewheel","nodeinserted","nodeinsertedintodocument","noderemoved","noderemovedfromdocument","overflowchanged","paint","paste","popupHidden","popupHiding","popupShowing","popupShown","reset","resize","scroll","scrolloverflow","select","submit","subtreemodified","text","textinput","textmenu","underflow","unload","wheel"]
		,writeToConsole = function (type, string) {
			console[type](string);
		}
		,checkForPresence = function(toCheck) {
			if (toCheck === undefined) { return false; }
			return true;
		}
		,buildJSON = function (obj) {
			if (checkForPresence(obj)) {
				writeToConsole("error", "object not defined in " + whocalled.toString());
				return false;
			}
			if (checkForPresence(obj.target)) {
				writeToConsole("error", "target object not defined in " + whocalled.toString());
				return false;
			}
			if (checkForPresence(obj.elements)) {
				writeToConsole("error", "object elements not defined in " + whocalled.toString());
				return false;
			}
			if (!(obj.elements instanceof Array)) {
				writeToConsole("error", "object elements must be an array in " + whocalled.toString());
				return false;
			}
			var target = document.getElementById(obj.target);
			if (!target) {
				writeToConsole("error", "target not found on page in " + whocalled.toString());
				return false;
			}
			for (var element in obj.elements) {
				target.appendChild(createElement(obj.elements[element]));
			}
		}
		,createElement = function (obj) {
			if (typeof obj === undefined) {
				console.error("object not defined in " + whocalled.toString());
				return;
			}
			if (typeof obj.element === undefined) {
				console.error("object type not defined in " + whocalled.toString());
				return;
			}
			var element;
			//old IE hacks since modifying a name in IE after the item is created is not allowed
			if (obj.element === "input") {
				try {
						element = document.createElement('<input name="'+ obj.name +'" />');
					} catch (err) { element = document.createElement('input'); element.setAttribute('name', obj.name); }
			} else if (obj.element === "select") {
				try {
					i = document.createElement('<select name="'+ obj.name +'" />');
				} catch (err) { element = document.createElement('select'); element.setAttribute('name', obj.name); }
			} else if (obj.element === "textarea") {
				try {
					e = document.createElement('<textarea name="'+ obj.name +'" />');
				} catch (err) { element = document.createElement('textarea'); element.setAttribute('name', obj.name); }
			}
			else {element = document.createElement(obj.element);}
			for (var propertyName in obj) {
				//ignore the element as that was used to create the object
				if (propertyName === "element") {continue;}
				//ignore the contains element as this would be items found inside of itself.
				if (propertyName === "contains") {continue;}
				//ignore the name element for inputs as this is already taken care of
				if (propertyName === "name" && obj.element === "input") {continue;}
				if (propertyName === "class") {element.setAttribute('className', obj[propertyName]);} // old IE hack
				element = addAttribute(element, propertyName, obj[propertyName]);
			}
			if (typeof obj.contains !== undefined) {
				element = addContent(element, obj.contains)
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
					if (typeof content[i] === "string") {element.appendChild(document.createTextNode(content[i]));}
					else if (contents[i] instanceof Element) {element.appendChild(content[i]);}
					else {element.appendChild(createElement(content[i]));}
				}
			}
			else if (typeof content === "string") {element.appendChild(document.createTextNode(content));}
			return element;
		}
	;
	return {
		//expose want we want public to the public
		version:version
		,createElement:createElement
		,buildJSON:buildJSON
		//add shortcut functions
		,html: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "html";
			return this.createElement(obj);
		}
		,head: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "head";
			return this.createElement(obj);
		}
		,title: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "head";
			return this.createElement(obj);
		}
		,base: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "head";
			return this.createElement(obj);
		}
		,link: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "link";
			return this.createElement(obj);
		}
		,meta: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "meta";
			return this.createElement(obj);
		}
		,style: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "style";
			return this.createElement(obj);
		}
		,script: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "script";
			return this.createElement(obj);
		}
		,body: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "body";
			return this.createElement(obj);
		}
		,section: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "section";
			return this.createElement(obj);
		}
		,nav: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "nav";
			return this.createElement(obj);
		}
		,article: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "article";
			return this.createElement(obj);
		}
		,aside: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "aside";
			return this.createElement(obj);
		}
		,heading: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "heading";
			return this.createElement(obj);
		}
		,hgroup: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "hgroup";
			return this.createElement(obj);
		}
		,header: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "header";
			return this.createElement(obj);
		}
		,footer: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "footer";
			return this.createElement(obj);
		}
		,address: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "address";
			return this.createElement(obj);
		}
		,main: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "main";
			return this.createElement(obj);
		}
		,p: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "p";
			return this.createElement(obj);
		}
		,hr: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "hr";
			return this.createElement(obj);
		}
		,pre: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "pre";
			return this.createElement(obj);
		}
		,blockquote: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "blockquote";
			return this.createElement(obj);
		}
		,ol: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "ol";
			return this.createElement(obj);
		}
		,ul: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "ul";
			return this.createElement(obj);
		}
		,li: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "li";
			return this.createElement(obj);
		}
		,dl: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "dl";
			return this.createElement(obj);
		}
		,dt: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "dt";
			return this.createElement(obj);
		}
		,figure: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "figure";
			return this.createElement(obj);
		}
		,figcaption: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "figcaption";
			return this.createElement(obj);
		}
		,div: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "div";
			return this.createElement(obj);
		}
		,a: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "a";
			return this.createElement(obj);
		}
		,em: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "em";
			return this.createElement(obj);
		}
		,strong: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "strong";
			return this.createElement(obj);
		}
		,small: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "small";
			return this.createElement(obj);
		}
		,s: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "s";
			return this.createElement(obj);
		}
		,cite: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "cite";
			return this.createElement(obj);
		}
		,q: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "q";
			return this.createElement(obj);
		}
		,dfn: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "dfn";
			return this.createElement(obj);
		}
		,abbr: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "abbr";
			return this.createElement(obj);
		}
		,data: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "data";
			return this.createElement(obj);
		}
		,time: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "time";
			return this.createElement(obj);
		}
		,code: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "code";
			return this.createElement(obj);
		}
		,var: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "var";
			return this.createElement(obj);
		}
		,samp: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "samp";
			return this.createElement(obj);
		}
		,kbd: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "kbd";
			return this.createElement(obj);
		}
		,sub: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "sub";
			return this.createElement(obj);
		}
		,sup: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "sup";
			return this.createElement(obj);
		}
		,i: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "i";
			return this.createElement(obj);
		}
		,b: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "b";
			return this.createElement(obj);
		}
		,u: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "u";
			return this.createElement(obj);
		}
		,mark: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "mark";
			return this.createElement(obj);
		}
		,ruby: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "ruby";
			return this.createElement(obj);
		}
		,rt: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "rt";
			return this.createElement(obj);
		}
		,rp: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "rp";
			return this.createElement(obj);
		}
		,bdi: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "bdi";
			return this.createElement(obj);
		}
		,bdo: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "bdo";
			return this.createElement(obj);
		}
		,span: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "span";
			return this.createElement(obj);
		}
		,br: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "br";
			return this.createElement(obj);
		}
		,wbr: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "wbr";
			return this.createElement(obj);
		}
		,ins: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "ins";
			return this.createElement(obj);
		}
		,del: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "del";
			return this.createElement(obj);
		}
		,img: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "img";
			return this.createElement(obj);
		}
		,iframe: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "iframe";
			return this.createElement(obj);
		}
		,embed: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "embed";
			return this.createElement(obj);
		}
		,object: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "object";
			return this.createElement(obj);
		}
		,param: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "param";
			return this.createElement(obj);
		}
		,video: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "video";
			return this.createElement(obj);
		}
		,audio: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "audio";
			return this.createElement(obj);
		}
		,source: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "source";
			return this.createElement(obj);
		}
		,track: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "track";
			return this.createElement(obj);
		}
		,canvas: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "canvas";
			return this.createElement(obj);
		}
		,map: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "map";
			return this.createElement(obj);
		}
		,area: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "area";
			return this.createElement(obj);
		}
		,svg: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "svg";
			return this.createElement(obj);
		}
		,math: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "math";
			return this.createElement(obj);
		}
		,table: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "table";
			return this.createElement(obj);
		}
		,caption: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "caption";
			return this.createElement(obj);
		}
		,colgroup: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "colgroup";
			return this.createElement(obj);
		}
		,col: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "col";
			return this.createElement(obj);
		}
		,tbody: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "tbody";
			return this.createElement(obj);
		}
		,thead: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "thead";
			return this.createElement(obj);
		}
		,tfoot: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "tfoot";
			return this.createElement(obj);
		}
		,tr: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "tr";
			return this.createElement(obj);
		}
		,td: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "td";
			return this.createElement(obj);
		}
		,th: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "th";
			return this.createElement(obj);
		}
		,form: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "form";
			return this.createElement(obj);
		}
		,fieldset: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "fieldset";
			return this.createElement(obj);
		}
		,legend: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "legend";
			return this.createElement(obj);
		}
		,label: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "label";
			return this.createElement(obj);
		}
		,input: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "input";
			return this.createElement(obj);
		}
		,button: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "button";
			return this.createElement(obj);
		}
		,select: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "select";
			return this.createElement(obj);
		}
		,datalist: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "datalist";
			return this.createElement(obj);
		}
		,optgroup: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "optgroup";
			return this.createElement(obj);
		}
		,option: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "option";
			return this.createElement(obj);
		}
		,textarea: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "textarea";
			return this.createElement(obj);
		}
		,keygen: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "keygen";
			return this.createElement(obj);
		}
		,output: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "output";
			return this.createElement(obj);
		}
		,progress: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "progress";
			return this.createElement(obj);
		}
		,meter: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "meter";
			return this.createElement(obj);
		}
		,details: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "details";
			return this.createElement(obj);
		}
		,summary: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "summary";
			return this.createElement(obj);
		}
		,command: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "command";
			return this.createElement(obj);
		}
		,menu: function (obj, undefined) {
			obj = (typeof obj !== undefined) ? obj : {};
			obj.element = "menu";
			return this.createElement(obj);
		}
	};
};
	window.domBuilder = this.domBuilder();
})( window);
