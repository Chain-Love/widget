export function generateQueryStr(
  baseString: string,
  query: Record<
    string,
    (string | number)[] | string | number | undefined | null
  >,
): string {
  const queryEntries = Object.entries(query).filter(
    ([, value]) =>
      value !== undefined &&
      value !== null &&
      value !== '' &&
      (Array.isArray(value) ? value.length > 0 : true),
  );

  if (queryEntries.length === 0) {
    return baseString;
  }

  const queryString =
    baseString +
    '?' +
    queryEntries
      .map(([k, v]) => {
        let value = v;

        if (Array.isArray(v)) {
          value = v.join(',');
        }

        return `${encodeURIComponent(k)}=${encodeURIComponent(String(value))}`;
      })
      .join('&');

  return queryString;
}
