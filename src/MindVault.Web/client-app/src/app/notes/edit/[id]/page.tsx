"use client"

import axiosInstance from "@/app/api/axios";
import SelectCategories from "@/app/components/select-categories";
import { useCategories } from "@/app/contexts/categoriesContext";
import { useNotes } from "@/app/contexts/notesContext";
import useToastMessage from "@/app/hooks/useToastMessage";
import ICategory from "@/app/Interfaces/ICategory";
import INote from "@/app/Interfaces/INote";
import IResponse from "@/app/Interfaces/IResponse";
import Layout from "@/app/layouts/layout/layout"
import { ErrorUtils } from "@/app/Utils/ErrorUtils";
import { useRouter } from "next/navigation";
import React, { FormEvent } from "react";
import { useEffect, useState } from "react"
import { Button } from "reactstrap";

export default function EditNote({ params }: { params: Promise<{ id: string }> })
{  
  const { id } = React.use(params);
  const { categories } = useCategories();
  const { updateNote } = useNotes();
  const [note, setNote] = useState<INote | null>();
  const [title,setTitle] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectCategories] = useState<ICategory[]>(note?.categories ?? []);


  const router = useRouter();
  const showToast = useToastMessage();

  useEffect(() =>{
    const fetchNote = async () => {
      try {
        const response = await axiosInstance.get<IResponse<INote>>(`/notes/${id}`)
        const note = response.data.data;
        setNote(note);
        setTitle(note.title);
        setContent(note.content);
        setSelectCategories(note.categories)
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

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    try {
      const categoriesId = selectedCategories.map(x => x.id);
      await axiosInstance.put(`/notes/${id}`, { title, content, categories: categoriesId })
      
      //Atualizar nota em memória
      note.title = title;
      note.content = content;
      note.categories = selectedCategories;
      updateNote(note);
      
      showToast("Anotação salva com sucesso!", true)
      router.push("/notes");
    } catch (error: any) {
      const titleError = error.response.data.errors?.Title;
      setTitleError(titleError);
      
      if (!titleError)
        showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    }
  }

  return (
    <Layout>
      <form onSubmit={(ev) => handleSubmit(ev)} className="container-fluid d-flex flex-column gap-3 h-100">
        <div className="form-floating">
          <input type="text" className="form-control" id="floatingInputTitle" 
            onChange={(ev) => setTitle(ev.target.value)}
            value={title}/>
          <label htmlFor="floatingInputTitle">Título</label>
        </div>
        <div>
          <SelectCategories categories={categories} selectedCategories={selectedCategories} setSelectedCategories={setSelectCategories}></SelectCategories>
        </div>
        <div className="form-floating d-flex flex-grow-1">
          <textarea className="form-control h-100" id="floatingTextarea"
            onChange={(ev) => setContent(ev.target.value)}
            value={content}></textarea>
          <label htmlFor="floatingTextarea">Conteúdo</label>
        </div>
        <Button color="primary" className="m-auto">
          <span className="mx-3">Salvar</span>
          <i className="bi-floppy"></i>
          </Button>
      </form>
    </Layout>
  )
}