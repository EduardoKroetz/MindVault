"use client"

import { createContext, useContext, useState } from "react";
import useToastMessage from "../hooks/useToastMessage";
import INote from "../Interfaces/INote";
import axiosInstance from "../api/axios";
import { ErrorUtils } from "../Utils/ErrorUtils";

const NotesContext = createContext<{
  notes: INote[];
  loadNotes: () => void;
  searchNotes: (categoryId: string, date: string) => INote[];
}>({
  notes: [],
  loadNotes: () => {},
  searchNotes: () => [],
});

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

export const NotesProvider = ({ children }: any) => {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [firstLoad, setFirstLoad] = useState(true);
  const pageNumber = 20;
  const showToast = useToastMessage();

  const loadNotes = async () => {
    if (!firstLoad)
      setPage(p => p++);

    try {
      var response = await axiosInstance.get("/notes/search?")
    }catch {

    }
  }

  const searchNotes = async (categoryId: string, date: string): Promise<INote[]> => {
    try {
      var response = await axiosInstance.get(`/notes/search?categoryId=${categoryId}&date=${date}`)
      return response.data.data;
    } catch (error: any) {
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    } 
  }


  return (
    <NotesContext.Provider value={{notes, loadNotes, searchNotes}}>
      {children}
    </NotesContext.Provider>
  );
};
