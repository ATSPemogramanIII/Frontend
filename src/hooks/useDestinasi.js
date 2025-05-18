import { useEffect, useState, useRef } from "react";
import axios from "axios";

export const useDestinasi = (id) => {
  const [destinasi, setDestinasi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8088/api/destinasi/${id}`
      );
      setDestinasi(response.data.data || null);
      console.log("Fetched destinasi:", response.data.data);
    } catch (err) {
      console.error("Error fetching destinasi:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchedRef.current && id) {
      fetchData();
      fetchedRef.current = true;
    }
  }, [id]);

  const retry = () => {
    fetchedRef.current = false;
    fetchData();
  };

  return { destinasi, loading, error, retry };
};
