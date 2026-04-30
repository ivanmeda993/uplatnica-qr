interface JsonLdProps {
  data: Record<string, unknown> | ReadonlyArray<Record<string, unknown>>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Schema.org JSON-LD payload, server-rendered. Safe because data is built from typed
      // builders, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
