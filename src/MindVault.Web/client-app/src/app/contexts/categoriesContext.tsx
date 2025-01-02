"use client"

import { createContext, useContext, useEffect, useState } from "react";
import useToastMessage from "../hooks/useToastMessage";
import axiosInstance from "../api/axios";
import { ErrorUtils } from "../Utils/ErrorUtils";
import ICategory from "../Interfaces/ICategory";

const CategoriesContext = createContext<{
  categories: ICategory[];
  addCategoryToNote: (categoryId: number, noteId: number) => Promise<void>
}>({
  categories: [],
  async addCategoryToNote(categoryId, noteId) {}
});

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
};

export const CategoriesProvider = ({ children }: any) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const showToast = useToastMessage();

  useEffect(() => {
    fetchCategories();
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`/categories?pageNumber=1&pageSize=10000`)
      setCategories(response.data.data);
    }catch (error: any) {
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    }
  }

  const addCategoryToNote = async (categoryId: number, noteId: number) => {
    try {
      await axiosInstance.post(`/notes/${noteId}/categories/${categoryId}`,)
    } catch (error: any) {
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false)
    }
  }

  return (
    <CategoriesContext.Provider value={{categories, addCategoryToNote}}>
      {children}
    </CategoriesContext.Provider>
  );
};
