async function fetcher<T = any>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, options);

  // If the server responds with a non-OK status, throw an error.
  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  // If the server responds with a OK status, parse the JSON and return it.
  return res.json();
}

export default fetcher;
