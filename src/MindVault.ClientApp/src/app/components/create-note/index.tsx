"use client"

import axiosInstance from "@/app/api/axios";
import { useCategories } from "@/app/contexts/categoriesContext";
import { useNotes } from "@/app/contexts/notesContext";
import useToastMessage from "@/app/hooks/useToastMessage";
import ICategory from "@/app/Interfaces/ICategory";
import { ErrorUtils } from "@/app/Utils/ErrorUtils";
import { useState } from "react"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Form, Input, FormFeedback, FormGroup } from 'reactstrap';
import SelectCategories from "../select-categories";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../loading-spinner";

export default function CreateNote()
{
  const { addNote } = useNotes();
  const showToast = useToastMessage();

  const [modalOpen, setModalOpen] = useState(false); 
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([])
  const [titleError, setTitleError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false);

  const router = useRouter();

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleCreateNote = async (ev: any) => {
    ev.preventDefault();

    if (titleError)
      return

    setCreating(true);
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
    setCreating(false);
  }

  return (
    <>
      <Button color="primary" onClick={toggleModal}>Criar Anotação</Button>
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Criar Anotação</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleCreateNote}>
            <FormGroup floating className="mb-3">
              <Input
                  type="text"
                  id="floatingInputTitle"
                  invalid={titleError != null}
                  value={title}
                  autoComplete="off"
                  onChange={(e) => {setTitle(e.target.value); setTitleError(null) }}
                />
              <Label htmlFor="floatingInputTitle">Título</Label>
              <FormFeedback className="invalid-feedback">{titleError}</FormFeedback>
            </FormGroup>
            <SelectCategories selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}/>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>Fechar</Button>
          <Button disabled={creating} color="primary" onClick={handleCreateNote}>
            { creating ? "Criando" : "Criar" }
            { creating && <LoadingSpinner /> }
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}