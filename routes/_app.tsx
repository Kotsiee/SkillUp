import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>DuckTasks</title>
        <link rel="stylesheet" href="/styles/styles.css" />
        <link rel="icon" type="image/x-icon" href="/assets/favicon.ico"></link>
      </head>
      <body class="dark-mode brand">
        <Component />
      </body>
    </html>
  );
}
