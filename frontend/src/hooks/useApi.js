import { useState, useCallback } from "react";
import {
  fetchData,
  postData,
  putData,
  deleteData,
} from "../services/api";

export const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔄 GET
  const get = useCallback(async (endpoint, token) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchData(endpoint, token);
      setData(res);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ➕ POST
  const post = useCallback(async (endpoint, payload, token) => {
    setLoading(true);
    setError(null);

    try {
      const res = await postData(endpoint, payload, token);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✏️ PUT
  const put = useCallback(async (endpoint, payload, token) => {
    setLoading(true);
    setError(null);

    try {
      const res = await putData(endpoint, payload, token);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ❌ DELETE
  const remove = useCallback(async (endpoint, token) => {
    setLoading(true);
    setError(null);

    try {
      const res = await deleteData(endpoint, token);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔄 Reset manual
  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    remove,
    reset,
  };
};