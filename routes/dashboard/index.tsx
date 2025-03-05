import { PageProps } from "$fresh/server.ts";
import { useRef } from 'preact/hooks';
import Test from "../../islands/Test.tsx";

export default function Dash({ Component }: PageProps) {
  const r = useRef<HTMLTextAreaElement>(null)

  return (
    <div>
      <Test />
    </div>
  );
}