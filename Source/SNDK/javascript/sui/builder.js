construct : function (attributes)
{
	

	var xmldoc;

	if (attributes.URL)
	{
		var xmlhttp = SNDK.tools.getXmlHttpObject ();
		var url;
		
		if (attributes.noCache || SNDK.debugMode)
		{
			url = attributes.URL + "?"+ Math.random ();
		}
		else
		{
			url = attributes.URL;
		}
			
		xmlhttp.open ("GET", url, false);
		
		xmlhttp.send (null);		
		xmldoc = xmlhttp.responseXML;
	}
	else if (attributes.XML)
	{
		xmldoc = SNDK.tools.getXmlDocFromString (attributes.XML)
	
//		if (window.DOMParser)
//  		{
  			//var parser = new DOMParser ();
  			//xmldoc = parser.parseFromString (attributes.xml, "text/xml");
  		//}
		//else // Internet Explorer
  		//{
//  			xmldoc = new ActiveXObject ("Microsoft.XMLDOM");
  			//xmldoc.async = "false";
  			//xmldoc.loadXML (attributes.xml);
  		//} 		
	}
	else
	{
		throw "Neither URL or xml was given.";
	}
	
	

	
	var root = xmldoc.getElementsByTagName ('sui').item(0);	
	
	if (root == null)
	{
		throw "No SUI definition was found in the xml.";
	}	
			
	var elements = new Array ();

	var bla = new Array ();
				
	var parseAttributes =	function (attributes)
				{
					var result = {};
					for (var i = 0; i < attributes.length; i++)
					{		
						var value = attributes[i].value;
						var attribute = attributes[i].name;
												
						if (value.toLowerCase () == "true")
						{
							value = true;
						}
						else if (value.toLowerCase () == "false")
						{
							value = false;
						}
						
						for (index in bla)
						{
							try
							{
								value = value.replace ("%"+ index +"%", bla[index])								
							}
							catch (e)
							{}
						}						
					
						result[attribute] = value; 
					}
					
					if (!result.tag)
					{
						result.tag = SNDK.tools.newGuid ();
					}
					
					return result;
				};
		
	var suiattributes = parseAttributes (root.attributes);					
	
	if (attributes.appendTo)
	{
		suiattributes.appendTo = attributes.appendTo;
	}
	
	for (index in suiattributes)
	{
		bla[index] =  suiattributes[index];
	}
	
	if (!suiattributes.appendTo)
	{
		suiattributes.appendTo = document.documentElement;
		//suiattributes.appendTo = document.body;
	}
					
	var parser =	function (Nodes, Parent, Expect)
			{			
				for (var index = 0, len = Nodes.length; index < len; index++)
				{

					var node = Nodes.item (index);
					if (node == null)
					{
						continue;
					}
					
					if (node.attributes != null)
					{
						var attributes = parseAttributes (node.attributes);
						if (!attributes.appendTo)
						{
							attributes.appendTo = Parent;
						}						
					}
					else
					{
						continue;
					}

									
					switch (node.tagName)
					{
						case "canvas":
						{						
							elements[attributes.tag] = new SNDK.SUI.canvas (attributes);
							parser (node.childNodes, elements[attributes.tag]);
							continue;
							break;
						}

						case "container":
						{
							elements[attributes.tag] = new SNDK.SUI.container (attributes);
							Parent.addUIElement (elements[attributes.tag]);
							parser (node.childNodes, elements[attributes.tag]);
							continue;
							break;						
						}
						
						case "layoutbox":
						{						
							elements[attributes.tag] = new SNDK.SUI.layoutbox (attributes);	
							Parent.addUIElement (elements[attributes.tag]);
							
							if (node.childNodes.length > 0)
							{
								var panels = new Array ();

								for (var index2 = 0; index2 < node.childNodes.length; index2++)
								{
									var child = node.childNodes.item (index2);

									if (child.tagName == "panel")
									{
										var childattributes = parseAttributes (child.attributes);
										elements[attributes.tag].addPanel (childattributes);
										parser (child.childNodes, elements[attributes.tag].getPanel (childattributes.tag))									
									}						
								}																
							}
							continue;
							break;
						}
												
						case "tabview":
						{						
							elements[attributes.tag] = new SNDK.SUI.tabview (attributes);													
							Parent.addUIElement (elements[attributes.tag]);
							
							if (node.childNodes.length > 0)
							{
								var tabs = new Array ();

								for (var index2 = 0; index2 < node.childNodes.length; index2++)
								{
									var child = node.childNodes.item (index2);

									if (child.tagName == "tab")
									{
										var childattributes = parseAttributes (child.attributes);
										elements[attributes.tag].addTab (childattributes);
										parser (child.childNodes, elements[attributes.tag].getTab (childattributes.tag))									
									}						
								}																
							}							
							continue;
							break;
						}
						
						case "button":
						{
							elements[attributes.tag] = new SNDK.SUI.button (attributes);
							Parent.addUIElement (elements[attributes.tag]);							
							continue;
							break;
						}
						
						case "textbox":
						{
							elements[attributes.tag] = new SNDK.SUI.textbox (attributes);
							Parent.addUIElement (elements[attributes.tag]);			
							continue;			
							break;
						}						
						
						case "credentials":
						{
							elements[attributes.tag] = new SNDK.SUI.credentials (attributes);
							Parent.addUIElement (elements[attributes.tag]);			
							continue;			
							break;
						}

						case "label":
						{
							elements[attributes.tag] = new SNDK.SUI.label (attributes);
							Parent.addUIElement (elements[attributes.tag]);			
							continue;
							break;
						}						
						
						case "listview":
						{
							if (node.childNodes.length > 0)
							{							
								var columns = new Array ();
								var items = new Array ();

								for (var index2 = 0; index2 < node.childNodes.length; index2++)
								{
									var child = node.childNodes.item (index2);
									if (child.tagName == "item")
									{
										items[items.length] = parseAttributes (child.attributes);
									}										
									
									if (child.tagName == "column")
									{
										columns[columns.length] = parseAttributes (child.attributes);
									}						
								}																				
								
								attributes.columns = columns;
								attributes.items = items;
							}							

							elements[attributes.tag] = new SNDK.SUI.listview (attributes);
							Parent.addUIElement (elements[attributes.tag]);									
								continue;					
							break;
						}																	

						case "checkbox":
						{
							elements[attributes.tag] = new SNDK.SUI.checkbox (attributes);
							Parent.addUIElement (elements[attributes.tag]);									
continue;
							break;
						}																	

						case "dropbox":
						{
							if (node.childNodes.length > 0)
							{							
								var items = new Array ();
								for (var item = 0, len = node.childNodes.length; item < len; item++)
								{
								}

								for (var index2 = 0; index2 < node.childNodes.length; index2++)
								{
									var child = node.childNodes.item (index2);
									if (child.tagName == "item")
									{
										items[items.length] = parseAttributes (child.attributes);
									}						
								}																				
								
								attributes.items = items;
							}						

							elements[attributes.tag] = new SNDK.SUI.dropbox (attributes);
							Parent.addUIElement (elements[attributes.tag]);									
								continue;						
							break;
						}																	

						case "upload":
						{
							elements[attributes.tag] = new SNDK.SUI.upload (attributes);
							Parent.addUIElement (elements[attributes.tag]);
							continue;
							break;
						}																	

//						case "textarea":
//						{							
//							if (node.childNodes.length > 0)
//							{
//								attributes.provider = node.childNodes[1].tagName;
//								attributes.providerConfig = parseAttributes (node.childNodes[1].attributes);
//							}
//	
//							elements[attributes.tag] = new SNDK.SUI.textarea (attributes);
//							break;
//						}	
						
						case "iconview":
						{
							if (node.childNodes.length > 0)
							{							
								var items = new Array ();

								for (var index2 = 0; index2 < node.childNodes.length; index2++)
								{
									var child = node.childNodes.item (index2);
									if (child.tagName == "item")
									{
										items[items.length] = parseAttributes (child.attributes);
									}																			
								}																				
								
								attributes.items = items;
							}						
						
							elements[attributes.tag] = new SNDK.SUI.iconview (attributes);
							Parent.addUIElement (elements[attributes.tag]);
							continue;
							break;
						}	
						
						case "htmlview":
						{													
							elements[attributes.tag] = new SNDK.SUI.htmlview (attributes);
							Parent.addUIElement (elements[attributes.tag]);
							continue;
							break;
						}	
						
						case "image":
						{													
							elements[attributes.tag] = new SNDK.SUI.image (attributes);
							Parent.addUIElement (elements[attributes.tag]);
							continue;
							break;
						}							
												
						
						case "text":
						{						
							elements[attributes.tag] = new SNDK.SUI.text (attributes);
							Parent.addUIElement (elements[attributes.tag]);		
							continue;	
							break;
						}											

						case "textarea":
						{
							//console.log ("textarea")
							//if (node.childNodes.length > 0)
							//{
								//for (var index2 = 1; index2 < node.childNodes.length; index2++)
								//{
							//		var child = node.firstChild;
									//console.log (child)
									//if ((child.tagName.toLowerCase () == "codemirror") || (child.tagName.toLowerCase () == "tinymce"))
									//{
							//			attributes.provider = child.tagName;
										
							//			console.log (child)
										//attributes.provider = "codemirror";
							//			attributes.providerConfig = parseAttributes (child.attributes);
									//}																			
								//}		
							//}
							
							if (node.childNodes.length > 0)
							{							
								var items = new Array ();

								for (var index2 = 0; index2 < node.childNodes.length; index2++)
								{
									var child = node.childNodes.item (index2);
									if (child.tagName == "codemirror")
									{
										attributes.provider = "codemirror";									
										attributes.providerConfig = parseAttributes (child.attributes);
									}
									else if (child.tagName == "tinymce")
									{
										attributes.provider = "tinymce";
										attributes.providerConfig = parseAttributes (child.attributes);	
									}																																					
								}																				
								
								attributes.items = items;
							}							
							

							elements[attributes.tag] = new SNDK.SUI.textarea (attributes);
							Parent.addUIElement (elements[attributes.tag]);
							continue;
							break;
						}											
					}
				}
			};	
			
	if (attributes.parent)
	{
	
	
		parser (root.childNodes, attributes.parent);
	}
	else
	{
		parser (root.childNodes, suiattributes.appendTo);
	}
	
		

	
	return elements;
}


