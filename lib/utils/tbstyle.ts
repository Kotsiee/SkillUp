export type style = {
  color?: string;
  size?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;

  [key: string]: string | boolean | undefined;
};

// Utility function to convert CSS style to a style object
export const toStyle = (style?: CSSStyleDeclaration): style | null => {
  if (!style) return null;

  return {
    color: style.color || undefined,
    size: style.fontSize || undefined,
    bold: style.fontWeight === "bold" || false,
    italic: style.fontStyle === "italic" || false,
    underline: style.textDecoration.includes("underline"),
    strike: style.textDecoration.includes("line-through"),
  };
};

export const styleToString = (style: style | null): string => {
  if (!style) return '';

  let styleString = ''

  styleString +=  `${style.color ? `color: ${style.color};` : ""}`
  styleString +=  `${style.size ? `font-size: ${style.size};` : ""}`
  styleString +=  `${style.bold ? `font-weight: bold;` : ""}`
  styleString +=  `${style.italic ? `font-style: italic;` : ""}`
  styleString +=  `${style.underline || style.strike? `text-decoration: ${style.underline ? "underline" : ""} ${style.strike ? "line-through" : ""};`: ""}`

  return styleString
};

export function detectStyleChange(current: style, newStyle: style, attr?: string): boolean {
    const arr = ["color", "size", "bold", "italic", "underline", "strike"]
    
    if(attr)
      arr.splice(arr.indexOf(attr), 1)

    const styleKeys: (keyof style)[] = arr;
    return styleKeys.some((key) => current[key] !== newStyle[key]);
}

export const styleToTag = (style: style | null): string | null => {
  if (!style) return null;

  let styleString = ''
  
  styleString +=  `${style.color ? `color: ${style.color};` : ""}`
  styleString +=  `${style.size ? `font-size: ${style.size};` : ""}`
  styleString +=  `${style.bold ? `font-weight: bold;` : ""}`
  styleString +=  `${style.italic ? `font-style: italic;` : ""}`
  styleString +=  `${style.underline || style.strike? `text-decoration: ${style.underline ? "underline" : ""} ${style.strike ? "line-through" : ""};`: ""}`

  return `<span style="${styleString}">`;
};


type HtmlNode = {
  tag: string; // Tag name
  attributes: { [key: string]: string }; // Attributes as key-value pairs
  children: HtmlNode[]; // Child nodes
  content?: string; // Optional text content
};

function htmlToJson(element: Element): HtmlNode {
  const node: HtmlNode = {
      tag: element.tagName.toLowerCase(),
      attributes: {},
      children: []
  };

  // Add attributes
  for (const attr of element.attributes) {
      node.attributes[attr.name] = attr.value;
  }

  // Add text content if it's a text-only node
  if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
      node.content = element.textContent?.trim();
  }

  // Recursively process child elements
  for (const child of Array.from(element.children)) {
      node.children.push(htmlToJson(child));
  }

  return node;
}

function jsonToHtml(node: HtmlNode): string {
  // Start with the opening tag and its attributes
  const attributes = node.attributes
      ? Object.entries(node.attributes)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join("")
      : "";

  // Handle content or children
  let content = "";

  if (node.children && node.children.length > 0) {
      // Recursively process children
      content = node.children.map(jsonToHtml).join("");
  } else if (node.content) {
      // Add text content if no children exist
      content = node.content;
  }

  // Self-closing tag if no children or content
  if (!content) {
      return `<${node.tag}${attributes} />`;
  }

  // Return full tag with content
  return `<${node.tag}${attributes}>${content}</${node.tag}>`;
}


interface jsonTag {
  Tag?: string;
  Style?: style;
  Content?: string;
  Children?: jsonTag[]
}

function toJSON(parent: HTMLElement, tag: string): jsonTag {
  const newTag: jsonTag = { }
  
  if(tag == 'SPAN') {
    newTag.Content = parent.textContent!
    newTag.Style = toStyle(parent.style)!
  }
  else {
    newTag.Tag = parent.tagName
    newTag.Children = []
  }

  if(parent.hasChildNodes()){
    (Array.from(parent.children) as HTMLElement[]).forEach(item => {
      newTag.Children?.push(toJSON(item, item.tagName))
    })
  }

  return newTag
}

function fromJSON(parent: jsonTag): HTMLElement {
  const newTag: HTMLElement = document.createElement(parent.Tag ? parent.Tag.toLowerCase() : 'span')

  newTag.textContent = parent.Content || ''

  const style = parent.Style || {}
  if(!style.color && !parent.Tag)
    style.color = 'default'

  newTag.setAttribute('style', styleToString(style || {}))

  if (parent.Children && parent.Children.length > 0) {
    parent.Children.forEach(item => {
      newTag.appendChild(fromJSON(item))
    })
  }

  console.log(newTag)
  return newTag
}

function cleanup(childrenArray: HTMLElement[]) {
  childrenArray.forEach((child) => {

    const childArray = Array.from(child.children || []) as HTMLElement[];
    let currentChild = childArray[0];

    childArray.forEach((span) => {
      let newNode = span;

      if(!detectStyleChange(toStyle(currentChild.style)!, toStyle(span.style)!) && span != childArray[0]) {
        newNode = document.createElement('span')
        newNode.innerText = (currentChild.textContent || '') + (span.textContent || '') 
        newNode.setAttribute('style', styleToString(toStyle(currentChild.style))!)

        child.replaceChild(newNode, currentChild)
        child.removeChild(span)
      }

      currentChild = newNode
    })
  })
}