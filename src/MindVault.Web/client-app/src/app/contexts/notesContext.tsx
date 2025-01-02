"use client"

import { createContext, useContext, useEffect, useState } from "react";
import useToastMessage from "../hooks/useToastMessage";
import axiosInstance from "../api/axios";
import { ErrorUtils } from "../Utils/ErrorUtils";
import INote from "../Interfaces/INote";
import DateUtils from "../Utils/DateUtils";
import IResponse from "../Interfaces/IResponse";

const NotesContext = createContext<{
  notes: INote[];
  dates: Date[];
  fetchNotes: (date: Date, pageNumber: number, pageSize: number) => Promise<INote[]>
  filterMemoryNotes: (date: Date) => INote[]
  addNote: (noteId: number) => Promise<void>,
  hasDatesNextPage: boolean,
  totalNotes: number,
}>({
  notes: [],
  dates: [],
  async addNote(noteId) {},
  filterMemoryNotes(date) { return [] },
  async fetchNotes(date, pageNumber, pageSize) { return [] },
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
    fetchDates()
    fetchTotalNotes();
  }, [])

  const fetchTotalNotes = async () => {
    try {
      var response = await axiosInstance.get(`/notes/search?pageNumber=1&pageSize=0`)
      setTotalNotes(response.data.totalCount);
    }catch (error: any) {
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    }
  }

  //Buscar datas que possuem anotações
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

  const fetchNotes = async (date: Date, pageNumber: number, pageSize: number) => {
    const formatedDate = DateUtils.FormatToYYYYMMDD(date);

    try {
      const response = await axiosInstance.get(`/notes/search?pageNumber=${pageNumber}&pageSize=${pageSize}&date=${formatedDate}`)

      setNotes(notes => [...notes, ...response.data.data]);

      return response.data.data
    } catch (error: any) {
      showToast("Não foi possível obter as anotações", false)
    }
  }

  const filterMemoryNotes = (date: Date) : INote[] => {
    const formatedDate = DateUtils.FormatToYYYYMMDD(date);
    return notes.filter(x => DateUtils.FormatToYYYYMMDD(x.createdAt) == formatedDate)
  }

  const addNote = async (noteId: number) => {
    const getNoteResponse = await axiosInstance.get<IResponse<INote>>("/notes/"+noteId);
    const note = getNoteResponse.data.data;
    const noteDate = note.createdAt
    const formatedDate = DateUtils.FormatToYYYYMMDD(noteDate)
    setTotalNotes(t => t + 1);

    // Procurar se alguma data em memória corresponde com a data da anotação
    if (dates.find(d => DateUtils.FormatToYYYYMMDD(d) === formatedDate))
    {
      // Caso anotações NÃO tenham sido carregado em memória
      if (filterMemoryNotes(noteDate).length === 0)
        fetchNotes(noteDate, 1, 20); // Carregar em memória
      else // Se já foram carregadas, então adicionar
        setNotes(n => [note, ...n])
    }else { // Se não possui a data, então criar
      setDates(d => [noteDate, ...d])
      setNotes(n => [note, ...n])
    }
  }

  return (
    <NotesContext.Provider value={{notes, addNote, dates, fetchNotes, filterMemoryNotes ,hasDatesNextPage, totalNotes}}>
      {children}
    </NotesContext.Provider>
  );
};
