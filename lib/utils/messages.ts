import { Chat, ChatRoles, jsonTag, style, Messages } from "../types/index.ts";

export const toMessage = (msg: any, chat: Chat): Messages => {
  const c = chat;

  return ({
    id: msg.id,
    user:
      c?.users?.find((u) => u.user?.id == msg.user_id) as ChatRoles | null ||
      msg.user ||
      c?.users?.find((u) => u.user?.id == msg.user?.id) as ChatRoles | null,
    chat: c as Chat | null,
    content: msg.content,
    textContent: msg.textContent,
    attachments: msg.attachments,
    sentAt: msg.sent_at || msg.sentAt,
  });
};

const toStyle = (style?: CSSStyleDeclaration): style | null => {
  if (!style) return null;
  if (!style.color) return null;

  return {
    color: style.color,
  };
};

export function toJSON(node: HTMLElement, tag: string, lineCount: number, parent?: HTMLElement,): jsonTag {
  const newTag: jsonTag = {
    Tag: tag,
  };

  if (tag === "LI") {
    const listType = node.getAttribute("data-list");
    newTag.Tag = listType?.toUpperCase();

    newTag.indent = node.className.replace('ql-indent-', '') as any as number || 0
  }

  if (tag !== "ROOT" && "OL" && "UL") {
    newTag.Content = node.textContent;

    if (toStyle(node.style)) newTag.Style = toStyle(node.style);
  }

  if (parent && newTag.Content) {
    const ind = getNodeIndex(node, parent);
    if (ind !== null) {
      newTag.index = ind;
      newTag.range = newTag.Content.length;
    }
  }

  if (node.hasChildNodes() && node.textContent && node.children.length > 0) {

    newTag.Children = [];
    const cArray = Array.from(node.children) as HTMLElement[];

    cArray.forEach((item) => {
        if (item.tagName === "OL")
          lineCount += item.children.length
        else
          lineCount += 1

        newTag.Children?.push(toJSON(item, item.tagName, lineCount, node));
    });
  }

  if (tag == "ROOT")
    newTag.range === lineCount
  
  return newTag;
}

function getNodeIndex(child: Node, parent: Node): number | null {
  let index = 0;
  let found = false;

  // Iterate through all children of the parent
  for (const node of Array.from(parent.childNodes)) {
    if (node === child) {
      found = true;
      break;
    }
    index += node.textContent?.length || 0;
  }

  return found ? index : null;
}

export function toHTML(tagObj: jsonTag): HTMLElement {
  // Create the parent element
  let tag = tagObj.Tag || "p"
  if ((tagObj.Tag === "BULLET") || (tagObj.Tag === "ORDERED")) tag = "li"
  const element = document.createElement(tag);
  if (tag === "li")
  {
    element.setAttribute('data-list', tagObj.Tag!.toLowerCase())
    element.setAttribute('style', `padding-left: ${(tagObj.indent || 0) * 2}em`)
    element.className = `indent-${tagObj.indent}`
  }

  const fragment = document.createDocumentFragment();

  if (!tagObj.Content){
    fragment.appendChild(document.createElement('br'))
    element.appendChild(fragment);
    return element;
  }

  if (tag === "li")
  {
    const marker = document.createElement('span')
    marker.className = 'list-marker'
    fragment.appendChild(marker)
  }

  let content = tagObj.Content;
  let lastIndex = 0;

  if (tagObj.Children && tagObj.Children.length > 0) {
      // Sort children by index to process them sequentially
      const sortedChildren = [...tagObj.Children].sort((a, b) => a.index! - b.index!);

      sortedChildren.forEach(child => {
          // Extract the text before this child
          if (child.index !== undefined)
          {
            const textBefore = content.substring(lastIndex, child.index);
            if (textBefore) {
                fragment.appendChild(document.createTextNode(textBefore));
            }
  
            // Recursively create child elements
            const childElement = toHTML(child);
            fragment.appendChild(childElement);
  
            lastIndex = child.index! + child.range!;
          }
      });

      // Append remaining text after the last child
      const textAfter = content.substring(lastIndex);
      if (textAfter) {
          fragment.appendChild(document.createTextNode(textAfter));
      }
  } else {
      // If no children, just insert the full content
      fragment.appendChild(document.createTextNode(content));
  }

  element.appendChild(fragment);
  return element;
}


export function jsonToString(json: jsonTag): string {
  let content = "";

  // Check if the root has children
  if (json.Children && json.Children.length > 0) {
    for (const child of json.Children) {
      if (child.Content) {
        content += child.Content + " ";
      }
    }
  }

  return content.trim();
}