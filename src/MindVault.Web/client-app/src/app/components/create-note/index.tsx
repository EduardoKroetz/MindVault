"use client"

import axiosInstance from "@/app/api/axios";
import { useCategories } from "@/app/contexts/categoriesContext";
import { useNotes } from "@/app/contexts/notesContext";
import useToastMessage from "@/app/hooks/useToastMessage";
import ICategory from "@/app/Interfaces/ICategory";
import { ErrorUtils } from "@/app/Utils/ErrorUtils";
import { useState } from "react"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import SelectCategories from "../select-categories";
import { useRouter } from "next/navigation";

export default function CreateNote()
{
  const { categories } = useCategories();
  const { addNote } = useNotes();
  const showToast = useToastMessage();

  const [modalOpen, setModalOpen] = useState(false); 
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([])
  const [titleError, setTitleError] = useState<string | null>(null)

  const router = useRouter();

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleCreateNote = async (ev: any) => {
    ev.preventDefault();

    try {
      // Criar nota
      const categoriesIds = selectedCategories.map(x => x.id);
      const response = await axiosInstance.post('/notes', { title, content: "", categories: categoriesIds })
      setModalOpen(false);
      const noteId = response.data.data.id;
      await addNote(noteId);

      setTitle('');
      setSelectedCategories([]);
      showToast("Anotação criada com sucesso!", true)
      router.push(`/notes/edit/${noteId}`)
      
    } catch (error: any) {
      const titleError = error.response.data.errors?.Title;
      setTitleError(titleError)

      if (!titleError)
        showToast(ErrorUtils.GetErrorMessageFromResponse(error), false)
    }
  }

  return (
    <>
      <Button color="primary" onClick={toggleModal}>Criar Anotação</Button>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Criar Anotação</ModalHeader>
        <ModalBody>
          <form onSubmit={handleCreateNote} className="needs-validation">
            <div className="form-floating mb-3">
              <input
                  type="text"
                  id="floatingInputTitle"
                  className={`form-control ${titleError ? 'is-invalid' : ''}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              <label htmlFor="floatingInputTitle">Título</label>
              <div className="invalid-feedback">
                {titleError}
              </div>
            </div>
            <SelectCategories categories={categories} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}/>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>Fechar</Button>
          <Button color="primary" onClick={handleCreateNote}>Criar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}