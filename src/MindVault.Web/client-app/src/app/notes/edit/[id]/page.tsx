"use client"

import axiosInstance from "@/app/api/axios";
import LoadingSpinner from "@/app/components/loading-spinner";
import SelectCategories from "@/app/components/select-categories";
import { useCategories } from "@/app/contexts/categoriesContext";
import { useNotes } from "@/app/contexts/notesContext";
import useToastMessage from "@/app/hooks/useToastMessage";
import ICategory from "@/app/Interfaces/ICategory";
import INote from "@/app/Interfaces/INote";
import IResponse from "@/app/Interfaces/IResponse";
import Layout from "@/app/layouts/layout/layout"
import DateUtils from "@/app/Utils/DateUtils";
import { ErrorUtils } from "@/app/Utils/ErrorUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent } from "react";
import { useEffect, useState } from "react"
import { Button, FormFeedback, FormGroup, Input, Label, Spinner } from "reactstrap";

export default function EditNote({ params }: { params: Promise<{ id: string }> })
{  
  const { id } = React.use(params);
  const { updateNote, notes } = useNotes();
  const [note, setNote] = useState<INote | null>();
  const [title,setTitle] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectCategories] = useState<ICategory[]>(note?.categories ?? []);
  const router = useRouter();
  const showToast = useToastMessage();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() =>{
    const idNumber = Number(id)
    if (!idNumber)
      return

    const fetchNote = async () => {
      setLoading(true)
      try {
        let note = notes.find(x => x.id === idNumber)
        if (!note)
        {
          const response = await axiosInstance.get<IResponse<INote>>(`/notes/${id}`)
          note = response.data.data;
        }
        setNote(note);
        setTitle(note.title);
        setContent(note.content);
        setSelectCategories(note.categories)
      } catch (error: any)
      {
        showToast("Não foi possível carregar a anotação", false);
        router.push("/notes")
      }
      setLoading(false)
    }

    fetchNote();
  }, [id])

  if (loading)
    return (
      <Layout>
        <Spinner/>
      </Layout>
    )

  if (!note)
    return

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    setSaving(true);
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
    setSaving(false);
  }

  return (
    <Layout>
      <div className="d-flex flex-column h-100 p-2">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-3">
            <Link href="/notes">
              <i className="bi-chevron-left me-2"></i>
            </Link>
            Anotação
          </h4>
          <p>{ DateUtils.FormatDateTime(note.createdAt) }</p>
        </div>

        <form onSubmit={(ev) => handleSubmit(ev)} className={"d-flex flex-column px-md-4 gap-1 flex-grow-1"}>
          <div className="row gap-2 m-0">
            <FormGroup className="col-12 col-md-6 p-0" floating>
              <Input type="text" id="floatingInputTitle" 
                invalid={titleError != null}
                onChange={(ev) => {setTitle(ev.target.value); setTitleError(null)}}
                value={title}/>
              <Label htmlFor="floatingInputTitle">Título</Label>
              <FormFeedback>
                { titleError }
              </FormFeedback>
            </FormGroup>
            <div className="col-5 flex-grow-1 p-0">
              <SelectCategories  selectedCategories={selectedCategories} setSelectedCategories={setSelectCategories}></SelectCategories>
            </div>
          </div>
          
          <FormGroup floating className="flex-grow-1">
            <textarea className="form-control h-100" id="floatingTextarea"
              onChange={(ev) => setContent(ev.target.value)}
              value={content}></textarea>
            <label htmlFor="floatingTextarea">Conteúdo</label>
          </FormGroup>
          <div className="m-auto">
            <Button disabled={saving} color="primary">
              <span className="mx-3">{ saving ? "Salvando" : "Salvar" }</span>
              { saving ? <LoadingSpinner /> : <i className="bi-floppy"></i> }
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}