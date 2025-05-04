import { useRef } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { JSX } from 'preact/jsx-runtime';
import AIcon, { Icons } from '../../Icons.tsx';

export default function TextDropdownField({
  val,
  items,
  onAdd,
  onMinus,
  ...props
}: {
  val: Signal<string[]>;
  items: string[];
  onAdd?: (item: string) => void;
  onMinus?: (item: string) => void;
} & JSX.HTMLAttributes<HTMLInputElement>) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const isDropdownVisible = useSignal(false);
  const searchValue = useSignal('');

  const handleAddItem = () => {
    const trimmed = searchValue.value.trim();
    if (trimmed.length === 0) return; // Don't add empty
    if (!val.value.includes(trimmed)) {
      val.value = [...val.value, trimmed];
      onAdd?.(trimmed);
    }
    searchValue.value = ''; // Clear input after adding
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div class={`input-field input-field--search-dropdown ${props.class}`}>
      <p class="input-field-title input-field--search-dropdown-title">{props.children}</p>
      <div class="input-field--search-dropdown__search">
        <div class="input-field--search-dropdown__input">
          <input
            ref={props.ref}
            class="input-field--search-dropdown__search-input"
            type="text"
            name="search-input"
            autocomplete="off"
            placeholder={props.placeholder}
            value={searchValue.value}
            onInput={e => (searchValue.value = (e.target as HTMLInputElement).value)}
            onKeyDown={handleKeyDown}
            onFocusIn={() => {
              dropdownRef.current!.hidden = false;
              selectionRef.current!.hidden = true;
            }}
            onFocusOut={() => {
              if (!isDropdownVisible.value) {
                dropdownRef.current!.hidden = true;
                selectionRef.current!.hidden = false;
              }
            }}
          />
          <div
            class={`input-field--search-dropdown__plus-icon ${
              searchValue.value.length > 0 ? '--enabled' : ''
            }`}
          >
            <AIcon startPaths={Icons.Plus} onClick={handleAddItem} />
          </div>
        </div>

        <div ref={selectionRef} class="input-field--search-dropdown__items-selected">
          <ul>
            {val.value.map((item, index) => (
              <li class="input-field--search-dropdown__item">
                <AIcon
                  className="input-field--search-dropdown__remove-icon"
                  size={12}
                  startPaths={Icons.X}
                  onClick={() => {
                    onMinus?.(val.value[index]);
                    const newVal = [...val.value];
                    newVal.splice(index, 1);
                    val.value = newVal;
                  }}
                />
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        ref={dropdownRef}
        class="input-field--search-dropdown__dropdown"
        hidden
        tabIndex={0}
        onMouseEnter={() => {
          isDropdownVisible.value = true;
        }}
        onMouseLeave={() => {
          isDropdownVisible.value = false;
        }}
        onFocusOut={() => {
          dropdownRef.current!.hidden = true;
          selectionRef.current!.hidden = false;
        }}
      >
        <ul>
          {items &&
            (items as string[])
              .filter(item => item.toLowerCase().includes(searchValue.value.toLowerCase()))
              .map((item, index) => (
                <li key={index} class="input-field--search-dropdown__item">
                  <label>
                    <input
                      type="checkbox"
                      hidden
                      checked={val.value.includes(item)}
                      onClick={() => {
                        if (val.value.includes(item)) {
                          val.value = val.value.filter(v => v !== item);
                        } else {
                          val.value = [...val.value, item];
                          onAdd?.(item);
                        }
                      }}
                    />

                    <p>{item}</p>
                    <AIcon
                      className="input-field--search-dropdown__checked-icon"
                      size={12}
                      startPaths={Icons.Tick}
                    />
                  </label>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
}
