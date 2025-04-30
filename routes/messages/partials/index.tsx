import { PageProps } from '$fresh/server.ts';
import { Partial } from '$fresh/runtime.ts';

export default function Messages(_props: PageProps) {
  return (
    <Partial name="messages">
      <h1>Nothing to see here</h1>
    </Partial>
  );
}
