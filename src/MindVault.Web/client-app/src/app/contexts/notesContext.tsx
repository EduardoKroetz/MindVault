"use client"

import { createContext, useContext, useEffect, useState } from "react";
import useToastMessage from "../hooks/useToastMessage";
import axiosInstance from "../api/axios";
import { ErrorUtils } from "../Utils/ErrorUtils";
import INote from "../Interfaces/INote";
import DateUtils from "../Utils/DateUtils";
import { parseISO } from "date-fns";

const NotesContext = createContext<{
  notes: INote[];
  dates: Date[];
  fetchDates: () => void;
  fetchNotes: (date: Date, pageNumber: number, pageSize: number) => Promise<INote[]>
  hasDatesNextPage: boolean,
  totalNotes: number,
}>({
  notes: [],
  dates: [],
  fetchDates: () => {},
  async fetchNotes(date, pageNumber, pageSize) {
    return []
  },
  hasDatesNextPage: true,
  totalNotes: 0
});

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};

export const NotesProvider = ({ children }: any) => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const [page, setPage] = useState(1);
  const [firstLoad, setFirstLoad] = useState(true);
  const [hasDatesNextPage, setHasNextPage] = useState(true);
  const [totalNotes, setTotalNotes] = useState(0);
  const pageSize = 20;
  const showToast = useToastMessage();

  useEffect(() => {
    loadTotalNotes();
  }, [])

  const loadTotalNotes = async () => {
    try {
      var response = await axiosInstance.get(`/notes/search?pageNumber=1&pageSize=0`)
      setTotalNotes(response.data.totalCount);
    }catch (error: any) {
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    }
  }

  const fetchDates = async () => {
    if (!firstLoad && hasDatesNextPage)
      setPage(p => p++);

    try {
      var response = await axiosInstance.get(`/notes/dates?pageNumber=${page}&pageSize=${pageSize}`)
      if (firstLoad)
        setFirstLoad(false);
      
      setHasNextPage(response.data.hasNextPage);
      setDates(dates => [...dates, ...response.data.data])
      setTotalNotes(response.data.totalCount);
    }catch (error: any) {
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    }
  }

  const fetchNotes = async (date: Date, pageNumber: number, pageSize: number): Promise<INote[]> => {
    const formatedDate = DateUtils.FormatToYYYYMMDD(date);
    
    var memoryNotes = notes.filter(x => DateUtils.FormatToYYYYMMDD(x.createdAt) == formatedDate)
    if (memoryNotes.length > 0)
      return memoryNotes;

    try {
      const response = await axiosInstance.get(`/notes/search?pageNumber=${pageNumber}&pageSize=${pageSize}&date=${formatedDate}`)

      setNotes(notes => [...notes, ...response.data.data]);

      return response.data.data
    } catch (error: any) {
      showToast("Não foi possível obter as anotações", false)
    }

    return memoryNotes;
  }

  return (
    <NotesContext.Provider value={{notes,dates, fetchDates, fetchNotes ,hasDatesNextPage, totalNotes}}>
      {children}
    </NotesContext.Provider>
  );
};
