import { useEffect, useState } from "react";

export const useMasterConfig = (filePath: string) => {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!data && filePath.length) {
        try {
          const response = await fetch(filePath);
          if (!response.ok) {
            throw new Error("Failed to fetch JSON file");
          }
          const jsonData = await response.json();
          setData(jsonData);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [filePath, data]);
  return data;
};
