import { JSX } from "preact";
import AIcon, { Icons } from "./Icons.tsx";
import { useRef } from 'preact/hooks';
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useEffect } from 'preact/hooks';

export function Searchbar(props: JSX.HTMLAttributes<HTMLInputElement> & { startVal: string | undefined, onLoad: (values: string | undefined) => void, onSearch: (values: string | undefined) => void }) {
  const inputValue = useSignal<string>(props.startVal || "");

  useEffect(() => {
    props.onLoad(props.startVal || undefined)
  }, [])

  return (
    <div class={`searchbar ${props.class}`}>
        <link rel="stylesheet" href="/styles/components/searchbar.css" />
        <AIcon className="search-icon" startPaths={Icons.Search}/>
        <input
          class="search-input" type="text" name="search-input" 
          value={inputValue.value}
          onInput={(e) => inputValue.value = (e.target as HTMLInputElement).value}
          autocomplete="off" 
          placeholder={props.placeholder}
        />
        <a href="#" class="search-submit" onClick={() => props.onSearch(inputValue.value)}>Search</a>
    </div>
  );
}

export function SearchbarDropdown(props: JSX.HTMLAttributes<HTMLInputElement> & {items: string[], startItems: string[] | undefined, onChang: (values: string) => void;}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const isDropdownVisible = useSignal(false);
  const items = useSignal<{arrName: string, i: string[]}>({arrName: props.name? props.name.toString() : "", i: props.startItems || []});
  const searchValue = useSignal("");

  const handleClick = (item: string) => {
    if (items.value.i.includes(item)) items.value = { ...items.value, i: items.value.i.filter(i => i !== item) };
    else items.value = { ...items.value, i: [...items.value.i, item] };
    props.onChang(items.value.i.join('%2C'));
  }
  
  return (
    <div class={`searchbar-dropdown ${props.class}`}>
        <link rel="stylesheet" href="/styles/components/searchbar.css" />
        <div class="search">
          <div class="input">
            <input ref={props.ref} class="search-input" type="text" name="search-input" autocomplete="off" placeholder={props.placeholder} 

            value={searchValue.value}
            onInput={(e) => searchValue.value = (e.target as HTMLInputElement).value}

            onFocusIn={() => { 
              dropdownRef.current!.hidden = false
              selectionRef.current!.hidden = true
            }} 

            onFocusOut={() => {
              if(!isDropdownVisible.value){
                dropdownRef.current!.hidden = true
                selectionRef.current!.hidden = false
              }
            }}/>

            <AIcon className="search-icon" startPaths={Icons.Search}/>
          </div>

          <div ref={selectionRef} class="items-selected">
            <ul>

              {items.value.i.map((item, index) => {
                return (
                <li key={index} class="item" onClick={() => handleClick(item)}>
                  <AIcon className="remove-icon" size={12} startPaths={Icons.X}/>
                  <p>{item}</p>
                </li>)
              })}

            </ul>
          </div>

        </div>

        <div ref={dropdownRef} class="dropdown" hidden tabindex={0}
        onMouseEnter={() =>{ isDropdownVisible.value = true }}
        onMouseLeave={() =>{ isDropdownVisible.value = false }}
        onFocusOut={() => { 
          dropdownRef.current!.hidden = true
          selectionRef.current!.hidden = false
        }}
        >
          <ul>
            {props.items
            .filter((item) => item.toLowerCase().includes(searchValue.value.toLowerCase()))
            .map((item, index) => {
              
                return (
                  <li key={index} class="item">
                    <input type="checkbox" name={`${props.name}-${item}-${index}`} id={`${props.name}-${item}-${index}`} hidden
                    checked={items.value.i.includes(item)}
                    onClick={() => handleClick(item)}/>
                    <label for={`${props.name}-${item}-${index}`}>
                      <AIcon className="checked-icon" size={12} startPaths={Icons.Tick}/>
                      <p>{item}</p>
                    </label>
                  </li>
                  )
            
            })}
          </ul>
        </div>
    </div>
  );
}
