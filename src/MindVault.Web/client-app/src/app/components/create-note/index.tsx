"use client"

import axiosInstance from "@/app/api/axios";
import { useCategories } from "@/app/contexts/categoriesContext";
import { useNotes } from "@/app/contexts/notesContext";
import useToastMessage from "@/app/hooks/useToastMessage";
import ICategory from "@/app/Interfaces/ICategory";
import { ErrorUtils } from "@/app/Utils/ErrorUtils";
import { useState } from "react"
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

export default function CreateNote()
{
  const { categories, addCategoryToNote } = useCategories();
  const { addNote } = useNotes();
  const showToast = useToastMessage();

  const [modalOpen, setModalOpen] = useState(false); 
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([])
  const [titleError, setTitleError] = useState<string | null>(null)

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleCreateNote = async () => {
    try {
      // Criar nota
      const response = await axiosInstance.post('/notes', { title, content: "" })
      setModalOpen(false);
      const noteId = response.data.data.id;

      // Associar categorias nas notas
      await Promise.all(
        selectedCategories.map(async (x) => await addCategoryToNote(x.id, noteId))
      );
      await addNote(noteId);

      setTitle('');
      setSelectedCategories([]);
      showToast("Anotação criada com sucesso!", true)
      
    } catch (error: any) {
      const titleError = error.response.data.errors?.Title;
      setTitleError(titleError)

      if (!titleError)
        showToast(ErrorUtils.GetErrorMessageFromResponse(error), false)
    }
  }

  const addCategory = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category && !selectedCategories.find((x) => x.id === category.id)) {
      setSelectedCategories((v) => [...v, category]);
    }
  };

  const removeCategory = (categoryId: number) => {
    const filteredCategories = selectedCategories.filter(c => c.id != categoryId);
    setSelectedCategories(filteredCategories)
  }


  return (
    <>
      <Button color="primary" onClick={toggleModal}>Criar Anotação</Button>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Criar Anotação</ModalHeader>
        <ModalBody>
          <form className="needs-validation">
            <div className="mb-3">
              <label htmlFor="recipient-name" className="col-form-label">Título</label>
              <input
                type="text"
                id="recipient-name"
                className={`form-control ${titleError ? 'is-invalid' : ''}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="invalid-feedback">
                {titleError}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="categories" className="col-form-label">Categorias</label>
              <select className="form-select" id="categories" aria-label="Default select example"
                onChange={(e) => addCategory(Number(e.target.value))}
                value="">
                <option value="">Selecione categorias</option>
                { categories.map(c => (
                  <option key={c.id} value={c.id}>{ c.name }</option>
                )) }
              </select>
              <div className="mt-1 d-flex gap-1">
                { selectedCategories.map(c => (
                  <span key={`selected-c-${c.id}`} style={{backgroundColor: c.color}} className="badge d-flex align-items-center gap-2">
                    { c.name }
                    <i onClick={() => removeCategory(c.id)} style={{ cursor: 'pointer' }} className="bi-x"></i>
                  </span>
                )) }
              </div>
            </div>
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