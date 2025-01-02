"use client"

import axiosInstance from "@/app/api/axios";
import CategoryBadge from "@/app/components/category-badge";
import { useNotes } from "@/app/contexts/notesContext";
import useToastMessage from "@/app/hooks/useToastMessage";
import INote from "@/app/Interfaces/INote";
import IResponse from "@/app/Interfaces/IResponse";
import Layout from "@/app/layouts/layout/layout"
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react"

export default function ShowNote({ params }: { params: Promise<{ id: string }> })
{  
  const { id } = React.use(params);
  const { notes } = useNotes();
  const [note, setNote] = useState<INote | null>();
  const router = useRouter();
  const showToast = useToastMessage();

  useEffect(() =>{
    const idNumber = Number(id)
    if (!idNumber)
      return

    const fetchNote = async () => {
      try {
        let note = notes.find(x => x.id === idNumber)
        if (!note)
        {
          const response = await axiosInstance.get<IResponse<INote>>(`/notes/${id}`)
          note = response.data.data;
        }
        setNote(note);
      } catch (error: any)
      {
        showToast("Não foi possível carregar a anotação", false);
        router.push("/notes")
      }
    }

    fetchNote();
  }, [id])

  if (!note)
    return

  return (
    <Layout>
      <div className="container-fluid d-flex flex-column gap-3 h-100">
        <div className="form-floating">
          <input type="text" className="form-control" id="floatingInputTitle" 
            value={note.title} readOnly/>
          <label htmlFor="floatingInputTitle">Título</label>
        </div>
        <div className="d-flex">
          { note.categories.map(c => (
            <CategoryBadge key={c.id} category={c}></CategoryBadge>
          ))}
        </div>
        <div className="form-floating d-flex flex-grow-1">
          <textarea className="form-control h-100" id="floatingTextarea"
            value={note.content} readOnly></textarea>
          <label htmlFor="floatingTextarea">Conteúdo</label>
        </div>
      </div>
    </Layout>
  )
}