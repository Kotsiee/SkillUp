import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

const KVContext = createContext<any>(null); // Context for Deno KV data

export function KVProvider({ children }: { children: preact.ComponentChildren }) {
  const [kvData, setKvData] = useState<{ [key: string]: any }>({});

  // Fetch cached data from Deno KV
  async function fetchKVData(key: string) {
    const response = await fetch(`/api/cache?key=${key}`);
    const result = await response.json();
    setKvData((prev) => ({ ...prev, [key]: result.data }));
  }

  // Store data in Deno KV
  async function storeKVData(key: string, value: any, ttlSeconds: number = 30) {
    await fetch(`/api/cache`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, ttlSeconds }),
    });
    fetchKVData(key); // Refresh stored data
  }

  return (
    <KVContext.Provider value={{ kvData, fetchKVData, storeKVData }}>
      {children}
    </KVContext.Provider>
  );
}

export function useKV() {
  return useContext(KVContext);
}
