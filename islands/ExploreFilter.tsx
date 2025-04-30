// deno-lint-ignore-file no-explicit-any
import { useSignal } from 'https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js';
import { DualSlider } from '../components/UI/Sliders/DualSlider.tsx';
import AIcon, { Icons } from '../components/Icons.tsx';
import { Searchbar, SearchbarDropdown } from '../components/Searchbar.tsx';
import { useRef } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';
import { joinProjectFilter, parseProjectFilter, ProjectFilter } from '../lib/utils/parsers.ts';

export default function ExploreFilters(
  props: JSX.HTMLAttributes<HTMLDivElement> & {
    sort: string[];
    startSort: string;
    filter: filterOptionProps[];
    url: URL;
  }
) {
  const openFilter = useRef<HTMLDivElement>(null);
  const openSort = useSignal(true);
  const openSort1 = useSignal(false);

  const filterValues = useSignal<{ [key: string]: any }>({});
  const handleFilterChange = (name: string, value: any) => {
    filterValues.value = { ...filterValues.value, [name.toLowerCase().replace(' ', '')]: value };
  };

  const url = new URL(props.url);
  const vals: ProjectFilter = parseProjectFilter(url.search);

  const search = (): string => {
    const outQuery: ProjectFilter = {
      search: filterValues.value.search || undefined,
      jobType: filterValues.value.jobtype || vals.jobType || undefined,
      language: filterValues.value.language || vals.language || undefined,
      minContributors: filterValues.value.contributors?.min || vals.minContributors || undefined,
      maxContributors: filterValues.value.contributors?.max || vals.maxContributors || undefined,
      minBudget: filterValues.value.budget?.min || vals.minBudget || undefined,
      maxBudget: filterValues.value.budget?.max || vals.maxBudget || undefined,
    };

    return `${url.pathname}?${joinProjectFilter(outQuery)}`;
  };

  return (
    <div class="explore-filter-container">
      <div class="explore-filter">
        <link rel="stylesheet" href="/styles/islands/exploreFilter.css" />
        <div class="explore-btns sort">
          <div>
            <button
              class="explore-btn sort-dd"
              tabindex={0}
              aria-label="Open Sort Menu"
              onClick={() => {
                openSort.value = !openSort.value;
              }}
              onFocusOut={() => {
                !openSort1.value ? (openSort.value = true) : null;
              }}
            >
              <AIcon className="sort-icon" size={16} startPaths={Icons.Sort} />
              <p>{props.startSort}</p>
            </button>

            <div
              class="explore-sort dropdown"
              hidden={openSort}
              tabindex={0}
              onMouseEnter={() => {
                openSort.value = false;
                openSort1.value = true;
              }}
              onMouseLeave={() => {
                openSort.value = true;
                openSort1.value = false;
              }}
              onFocusOut={() => {
                openSort.value = true;
              }}
            >
              <ul>
                {props.sort.map((option, index) => {
                  const concatName = option.toLowerCase().replace(' ', '');

                  return (
                    <li
                      key={index}
                      onClick={() => {
                        globalThis.location.href = `${url.pathname}?sort=${option.replace(
                          ' ',
                          '%20'
                        )}`;
                      }}
                    >
                      <label for={`${props.class}-${concatName}`}>{option}</label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <button class="explore-btn sort-switch" tabindex={0} aria-label="Switch Sort">
            <AIcon className="sort-switch-icon" size={16} startPaths={Icons.SortSwitch} />
          </button>
        </div>
        <Searchbar
          class="explore-search"
          startVal={vals.search}
          onSearch={val => {
            filterValues.value = { ...filterValues.value, search: val };
            globalThis.location.href = search();
          }}
          onLoad={val => (filterValues.value = { ...filterValues.value, search: val })}
        />
        <button
          class="explore-btn filter"
          tabindex={0}
          aria-label="Open Sort Menu"
          onClick={() => {
            openFilter.current!.hidden = !openFilter.current!.hidden;
          }}
        >
          <AIcon className="filter-icon" size={16} startPaths={Icons.Filter} />
          <p>Filters</p>
        </button>
      </div>

      <div class="explore-filters-container" ref={openFilter} hidden>
        <div class="explore-filters">
          {props.filter.map((item, index) => {
            return (
              <FilterOption
                key={index}
                {...item}
                onChang={value => handleFilterChange(item.name!.toString(), value)}
              />
            );
          })}
        </div>
        <div class="explore-filters-search">
          <a href={search()}>Search</a>
        </div>
      </div>
    </div>
  );
}

export interface filterOptionProps extends JSX.HTMLAttributes<HTMLInputElement> {
  contentType: 'dropdown' | 'multi-dropdown' | 'dual-slider';
  items?: string[];
  onChang?: (value: any) => void;
  startFilters?: {
    items?: string[];
    min?: number | 'min';
    max?: number | 'max';
  };
}

const FilterOption = (props: filterOptionProps) => {
  switch (props.contentType) {
    case 'dropdown':
      break;
    case 'multi-dropdown':
      return (
        <div class={`explore-filters-selection ${props.class}`}>
          <p>{props.name?.toString()}</p>
          <SearchbarDropdown
            onChang={props.onChang!}
            ref={props.ref}
            class={`explore-filters-selection-item`}
            name={props.name?.toString().replace(' ', '')}
            items={props.items!}
            startItems={props.startFilters?.items}
            placeholder={props.placeholder}
          />
        </div>
      );
    case 'dual-slider':
      return (
        <div class={`explore-filters-selection ${props.class}`}>
          <p>{props.name?.toString()}</p>
          <DualSlider
            onChang={props.onChang!}
            ref={props.ref}
            class={`explore-filters-selection-item`}
            name={props.name?.toString().replace(' ', '')}
            minVal={props.min as any as number}
            maxVal={props.max as any as number}
            step={props.step}
            startMinVal={props.startFilters?.min}
            startMaxVal={props.startFilters?.max}
          />
        </div>
      );
    default:
      return <></>;
  }

  return <></>;
};
