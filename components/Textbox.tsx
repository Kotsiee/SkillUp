import { createElement, JSX } from "https://esm.sh/v128/preact@10.22.0/src/index.js";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useRef, useEffect } from 'preact/hooks';
import { detectStyleChange, style, styleToString, toStyle } from "../lib/utils/tbstyle.ts";
import { isTemplateExpression } from "https://deno.land/x/ts_morph@21.0.1/common/typescript.d.ts";

interface ITextFunctions {
  style: style;
  defaults: style;
  type: 'color' | 'size' | 'bold' | 'italic' | 'underline' | 'strike';
  selection: Selection;
  ref: HTMLDivElement
}

export default function Textbox(props: JSX.HTMLAttributes<HTMLInputElement>) {
  const text = useSignal<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const history = useSignal([]);

  useEffect(() => {
    // ref.current!.innerHTML = text.value;
    // fromJSON(toJSON(ref.current as HTMLElement, 'TOP'))
  }, []);

  const applyTextStyle = (type: ITextFunctions["type"], value: boolean) => {
    const selection = globalThis.getSelection();
    if (!selection || !ref.current) return;

    const range = selection.getRangeAt(0);
    if (range.cloneContents().textContent?.length === 0)
    {
      const newSpan = document.createElement('span')
      const style: style = toStyle(selection.anchorNode?.parentElement?.style)!
      style[type as keyof style] = value
      newSpan.setAttribute('style', styleToString(style))
      newSpan.textContent = '\u200B'

      range.insertNode(newSpan)
    }
    else {
      if (range.collapsed) return;
  
      const style: style = {}
      style[type as keyof style] = value
  
      const styleDef: style = {
        color: 'default',
        size: undefined,
        bold: false,
        italic: false,
        underline: false,
        strike: false,
      }
  
      const props: ITextFunctions = {
        style: style,
        defaults: styleDef,
        type: type,
        selection: selection,
        ref: ref.current
      }

      console.log('style')
      setStyle(props)
    }
  };

  const handleEnterKey = (e: KeyboardEvent) => { 
    e.preventDefault();

    if (!ref.current) return;
    const selection = globalThis.getSelection();
    if (!selection || selection.rangeCount === 0) return;
  
    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    let currentBlock = startContainer as HTMLElement;
  
    // Find the parent div block
    while (currentBlock && currentBlock.tagName !== "DIV") {
      currentBlock = currentBlock.parentElement!;
    }
  
    if (!currentBlock) return;
  
    const spans = Array.from(currentBlock.children) as HTMLSpanElement[];
    const startIndex = spans.findIndex((span) => span.contains(startContainer));
  
    // Detect if at the end of the line
    if (
      startIndex === spans.length - 1 &&
      range.startOffset === spans[startIndex].textContent?.length
    ) {
      const newLine = document.createElement("div");
      const newBlock = document.createElement("span");
      newBlock.innerText = "\u200B"; // Zero-width space to maintain cursor position
  
      const childrenArray = Array.from(ref.current.children || []);
      const index = childrenArray.findIndex(
        (child) => child === range.startContainer || child.contains(range.startContainer)
      );
  
      const currentStyle = toStyle(spans[startIndex].style) || {};
      newBlock.setAttribute("style", styleToString(currentStyle)!);
  
      // Insert new line after the current block
      if (index < childrenArray.length - 1) {
        ref.current.insertBefore(newLine, ref.current.children[index + 1]);
      } else {
        ref.current.appendChild(newLine);
      }
  
      newLine.appendChild(newBlock);
  
      // Move cursor to new line
      range.setStart(newBlock, 0);
      range.setEnd(newBlock, 0);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Split the line at cursor position
      const newContainer = document.createElement("div");
  
      // Get current span and text parts
      const startSpan = spans[startIndex];

      if (startSpan && startSpan.textContent) {
        const startText = startSpan.textContent;
        const startOffset = range.startOffset;
    
        const firstPart = startText.slice(0, startOffset); // Before split
        const secondPart = startText.slice(startOffset); // After split
    
        startSpan.textContent = firstPart; // Keep first part in original span
    
        if (secondPart) {
          const splitSpan = document.createElement("span");
          splitSpan.textContent = secondPart;
          const currentStyle = toStyle(startSpan.style) || {};
          splitSpan.setAttribute("style", styleToString(currentStyle)!);
          newContainer.appendChild(splitSpan);
        }
    
        // Move all spans **after** the split point into the new div
        for (let i = startIndex + 1; i < spans.length; i++) {
          newContainer.appendChild(spans[i]);
        }
    
        // Insert the new div block after current
        currentBlock.after(newContainer);
    
        // Move cursor to new line
        range.setStartBefore(newContainer.childNodes[0]);
        range.setEndBefore(newContainer.childNodes[0]);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      else {
        const newLine = document.createElement("div");
        const newBlock = document.createElement("span");
        newBlock.innerText = "\u200B";
    
        const currentStyle = {};
        newBlock.setAttribute("style", styleToString(currentStyle)!);
  
        ref.current.appendChild(newLine);
        newLine.appendChild(newBlock);
    
        // Move cursor to new line
        range.setStart(newBlock, 0);
        range.setEnd(newBlock, 0);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const keyUp = (e: createElement.JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    const selection = globalThis.getSelection();
    const range = selection!.getRangeAt(0);
    const startContainer = range.startContainer;

    let container = startContainer as HTMLElement;
    while (container && container.tagName !== "DIV") {
      container = container.parentElement!;
    }

    const spans = Array.from(container.children) as HTMLSpanElement[];
    const index = spans.findIndex((span) => span.contains(startContainer));

    if (e.key === "Backspace") {
      range.setStart(startContainer, range.startOffset)
      range.setEnd(startContainer, range.startOffset)

      if (spans[index] && spans[index + 1]) {
        if(!detectStyleChange(toStyle(spans[index].style)!, toStyle(spans[index + 1].style)!)) {
          const newNode = document.createElement('span')
          newNode.innerText = (spans[index].textContent || '') + (spans[index + 1].textContent || '')
          newNode.setAttribute('style', styleToString(toStyle(spans[index].style))!)
          container.replaceChild(newNode, spans[index])
          container.removeChild(spans[index + 1])
          
          const childrenArray = Array.from(container.children || []);
          range.selectNodeContents(childrenArray[index]);
          range.setStart(childrenArray[index].childNodes[0], spans[index].textContent!.length)
          range.setEnd(childrenArray[index].childNodes[0], spans[index].textContent!.length)
          range.collapse(false);
        }
      }
    }
  }

  const keyDown = (e: createElement.JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    if (!ref.current) return

    if (!ref.current.textContent?.replace('\u200B', '')) {
      ref.current.innerHTML = ''

      const newLine = document.createElement("div");
      const newBlock = document.createElement("span");
      newBlock.innerText = "\u200B";
  
      const currentStyle: style = {};
      newBlock.setAttribute("style", styleToString(currentStyle)!);

      ref.current.appendChild(newLine);
      newLine.appendChild(newBlock);

      console.log('new line')
    }

    const selection = globalThis.getSelection();

    if (selection) {  
      if (e.key === "Enter") {
        handleEnterKey(e);
        return;
      }

      if (e.ctrlKey) {
        let handled = false; // Track if a shortcut was processed
    
        switch (e.code) {
          case "KeyB":
            applyTextStyle("bold", true);
            handled = true;
            break;
          case "KeyI":
            applyTextStyle("italic", true);
            handled = true;
            break;
          case "KeyU":
            applyTextStyle("underline", true);
            handled = true;
            break;
          case "KeyQ":
            applyTextStyle("strike", true);
            handled = true;
            break;
        }
    
        // Only prevent default if a shortcut was processed
        if (handled) {
          e.preventDefault();
        }
        else cleanupEmptyNodes(ref.current)
      }

    }
  };

  return (
    <div class={`${props.class}`}>
      <div
      class={`text${text.value ? '': ' input'}`}
      contentEditable={true}
      tabindex={0}
      ref={ref}
      onKeyDown={(e) => {keyDown(e)}}
      onKeyUp={(e) => {keyUp(e)}}
      onInput={(e) => {
        text.value = e.currentTarget.textContent? e.currentTarget.textContent.replace('\u200B', '') : '';
      }}

      onPaste={(e) => {
        e.preventDefault();
        const plainText = e.clipboardData?.getData("text/plain") || "";
        document.execCommand("insertText", false, plainText);
      }}
      >
      </div>
    </div>
  );
}

function setStyle(props: ITextFunctions) {
  const { style, type, ref } = props;
  let { selection } = props;

  let childrenArray = Array.from(ref.children || []) as HTMLElement[];

  selection = document.getSelection()!
  const range = selection.getRangeAt(0);

  const startIndex = childrenArray.findIndex((child) => child === range.startContainer || child.contains(range.startContainer));
  const startContainer = childrenArray[startIndex]
  const startContainerArray = Array.from(startContainer!.children || []) as HTMLElement[];
  const startStyle = toStyle(range.startContainer.parentElement?.style)

  const endIndex = childrenArray.findIndex((child) => child === range.endContainer || child.contains(range.endContainer));
  const endContainer = childrenArray[endIndex]
  const endContainerArray = Array.from(endContainer!.children || []) as HTMLElement[];
  const endStyle = toStyle(range.endContainer.parentElement?.style)

  const startSelection = range.startContainer;
  const startSelectionText = startSelection.textContent;
  const startOffset = range.startOffset;

  const endSelection = range.endContainer;
  const endSelectionText = endSelection.textContent;
  const endOffset = range.endOffset;

  const currentStyle = style!
  if (startStyle![type as keyof style] === style[type as keyof style] &&
    endStyle![type as keyof style] === style[type as keyof style])
    currentStyle[type as keyof style] = props.defaults[type as keyof style]

  const extracted = range.extractContents()
  const extractedArray = Array.from(extracted.children || []) as HTMLElement[];

  if (startContainer === endContainer) {
    const vars: iStyleLoop = {
      startText: startSelectionText!,
      startOffset: startOffset,
      startStyle: startStyle!,
      
      endText: endSelectionText!,
      endOffset: endOffset,
      endStyle: endStyle!,
      
      style: currentStyle,
      type: type as keyof style,
      extracted: extracted,
      extractedArray: extractedArray
    }
    const fragment = styleLoop(vars)
    console.log(startIndex)
    console.log(startContainer)
    console.log(startContainerArray)

    startContainer?.replaceChild(fragment, startSelection.parentElement!)
    endSelection.parentElement?.remove()
  }
  else {
    const docFrag = document.createDocumentFragment()

    const eLength = extractedArray.length - 1
    let startText = startSelectionText!
    let endText = startContainerArray[startContainerArray.length - 1].textContent!

    extractedArray.forEach((line, index) => {
      const currLine = Array.from(line.children || []) as HTMLElement[]

      if (index != 0)
      {
        startText = currLine[0].textContent!
        endText = currLine[currLine.length - 1].textContent!
      }

      if (index === eLength)
      {
        startText = endContainerArray[0].textContent!
        endText = endSelectionText!
      }

      const vars: iStyleLoop = {
        startText: startText,
        startOffset: index === 0 ? startOffset : 0,
        startStyle: startStyle!,
        
        endText: endText,
        endOffset: index === eLength ? endOffset : currLine[currLine.length - 1].textContent!.length - 1,
        endStyle: endStyle!,
        
        style: currentStyle,
        type: type as keyof style,
        extracted: line,
        extractedArray: currLine
      }

      const fragment = styleLoop(vars)
      const str = document.createElement('div') as HTMLElement

      const temp = document.createDocumentFragment();
      (Array.from(childrenArray[startIndex + index].children) as HTMLElement[]).forEach(item => temp.appendChild(item));
      const originalLength = temp.childElementCount;
      
      // console.log(temp.textContent, fragment.textContent)
      if (index === 0)
      {
        temp?.replaceChild(fragment, startSelection.parentElement!)
        temp.removeChild(temp.lastChild!)
        str?.appendChild(temp)
      }
      else if (index === eLength){
        temp?.replaceChild(fragment, endSelection.parentElement!)
        str?.appendChild(temp)
      }
      else {
        temp?.replaceChild(fragment, temp.firstChild!);
        cleanupEmptyNodes(temp);
        console.log(originalLength, temp.childElementCount);
        (Array.from(temp.children) as HTMLElement[]).forEach((item, index) => {
          if (index >= originalLength)
            item.remove()
        })

        str?.appendChild(temp)
      }

      docFrag.appendChild(str)
    })

    ref.replaceChild(docFrag, startContainer)
    endContainer.remove()
  }

  childrenArray = Array.from(ref.children || []) as HTMLElement[];

  childrenArray.forEach(item => {
    cleanupEmptyNodes(item)
  })

  console.log(ref.innerHTML)
}

interface iStyleLoop {
  startText: string;
  startOffset: number;
  startStyle: style;

  endText: string;
  endOffset: number;
  endStyle: style;

  style: style;
  type: keyof style;
  extracted: DocumentFragment | HTMLElement;
  extractedArray: HTMLElement[];
}

const styleLoop = (props: iStyleLoop) => {
  const {startText, startOffset, startStyle, endText, endOffset, endStyle, type, style, extracted, extractedArray} = props

  const temp = document.createDocumentFragment()
  let currentText = startText?.slice(0, startOffset)!
  let currentStyle = style;

  let str = document.createElement('span')
  currentStyle = {...startStyle!}
  str.setAttribute('style', styleToString(currentStyle))
  str.textContent = currentText

  if (extractedArray.length > 0)
  {      
    extractedArray.forEach(item => {
      const thisStyle: style = toStyle(item.style)!
      thisStyle[type as keyof style] = style[type as keyof style]

      if (detectStyleChange(currentStyle, thisStyle)) {
        str.textContent = currentText
        temp.appendChild(str)

        currentStyle = {...thisStyle}

        str = document.createElement('span')
        currentText = item.textContent!
        str.textContent = currentText
        str.setAttribute('style', styleToString(currentStyle))
      }
      else {
        currentText += item.textContent!
      }
    });
  }
  else {
    currentStyle[type] = style[type]

    if (detectStyleChange(currentStyle, startStyle!)) {
      
      temp.appendChild(str)

      str = document.createElement('span')
      currentText = extracted.textContent!
      str.textContent = currentText
      str.setAttribute('style', styleToString(currentStyle))
    }
    else {
      currentText += extracted.textContent!
    }
  }

  if (detectStyleChange(currentStyle, endStyle!)) {
    str.textContent = currentText
    temp.appendChild(str)

    str = document.createElement('span')
    currentStyle = {...endStyle!}
    currentText = endText?.slice(endOffset)!
    str.setAttribute('style', styleToString(currentStyle))
  }
  else {
    currentText += endText?.slice(endOffset)!
  }

  str.textContent = currentText
  temp.appendChild(str)
  return (temp)
}

function cleanupEmptyNodes(parent: HTMLElement | DocumentFragment) {
  const children = Array.from(parent.children) as HTMLElement[];

  children.forEach((child) => {
    if (child.tagName === "SPAN" && child.textContent?.trim() === "") {
      child.remove();
    }
    if (child.tagName === "DIV" && child.childNodes.length === 0) {
      child.remove();
    }
  });
}