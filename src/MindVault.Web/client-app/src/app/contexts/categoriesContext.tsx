"use client"

import { createContext, useContext, useEffect, useState } from "react";
import useToastMessage from "../hooks/useToastMessage";
import axiosInstance from "../api/axios";
import { ErrorUtils } from "../Utils/ErrorUtils";
import ICategory from "../Interfaces/ICategory";
import { useAccount } from "./accountContext";

const CategoriesContext = createContext<{
  categories: ICategory[];
  loadingCategories: boolean,
  addCategory: (category: ICategory) => void,
  updateCategory: (category: ICategory) => void,
  removeCategory: (category: ICategory) => void,
}>({
  categories: [],
  loadingCategories: true,
  addCategory: () => {},
  updateCategory:() => {},
  removeCategory:() => {},
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
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    if (account && firstLoad)
    {
      fetchCategories();
      setFirstLoad(false);
    }
  }, [account])

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axiosInstance.get(`/categories?pageNumber=1&pageSize=10000`)
      setCategories(response.data.data);
    }catch (error: any) {
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    }
    setLoadingCategories(false);
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
    <CategoriesContext.Provider value={{categories, loadingCategories, addCategory, updateCategory, removeCategory}}>
      {children}
    </CategoriesContext.Provider>
  );
};
