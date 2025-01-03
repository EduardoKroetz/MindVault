"use client"

import { createContext, useContext, useEffect, useState } from "react";
import useToastMessage from "../hooks/useToastMessage";
import axiosInstance from "../api/axios";
import { ErrorUtils } from "../Utils/ErrorUtils";
import ICategory from "../Interfaces/ICategory";
import { useAccount } from "./accountContext";

const CategoriesContext = createContext<{
  categories: ICategory[];
  addCategory: (category: ICategory) => void,
  updateCategory: (category: ICategory) => void,
  removeCategory: (category: ICategory) => void,
}>({
  categories: [],
  addCategory(category: ICategory) {},
  updateCategory(category: ICategory) {},
  removeCategory(category: ICategory) {},
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
  const [firstLoad, setFirstLoad] = useState(true);
  const { account } = useAccount();

  useEffect(() => {
    if (account && firstLoad)
    {
      fetchCategories();
      setFirstLoad(false);
    }
  }, [account])

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`/categories?pageNumber=1&pageSize=10000`)
      setCategories(response.data.data);
    }catch (error: any) {
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    }
  }

  const addCategory = (category: ICategory) => {
    setCategories(c => [category, ...c])
  }

  const updateCategory = (category: ICategory) => {
    const categoryIndex = categories.findIndex(x => x.id === category.id);
    if (categoryIndex === -1)
      return

    const updatedCategories = [...categories];
    updatedCategories[categoryIndex] = category;

    setCategories(updatedCategories);
  }

  const removeCategory = (category: ICategory) => {
    const updatedCategories = categories.filter(c => c.id != category.id)
    setCategories(updatedCategories);
  }

  return (
    <CategoriesContext.Provider value={{categories, addCategory, updateCategory, removeCategory}}>
      {children}
    </CategoriesContext.Provider>
  );
};
