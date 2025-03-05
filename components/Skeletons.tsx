import { JSX } from "preact/jsx-runtime";

export function Skeleton(props: JSX.HTMLAttributes<HTMLDivElement> & { count: number }) {
    return (
      <div class="skeleton-container">
        {Array(props.count)
          .fill(0)
          .map((_, i) => (
            <div class="skeleton-item" key={i}>
                {props.children}
            </div>
          ))}
      </div>
    );
  }