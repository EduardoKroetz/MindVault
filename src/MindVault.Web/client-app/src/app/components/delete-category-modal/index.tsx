"use client"

import axiosInstance from "@/app/api/axios";
import { useCategories } from "@/app/contexts/categoriesContext";
import useToastMessage from "@/app/hooks/useToastMessage";
import ICategory from "@/app/Interfaces/ICategory";
import { ErrorUtils } from "@/app/Utils/ErrorUtils";
import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function DeleteCategoryModal({ isOpen, toggleModal, category } : { isOpen: boolean, toggleModal(): void, category: ICategory | null })
{
  const [confirmation, setConfirmation] = useState("");
  const confirmationMsg = "deletar"
  const [errorConfirmation, setErrorConfirmation] = useState<string | null>(null)
  const { removeCategory } = useCategories()
  const showToast = useToastMessage();

  if (!category)
    return

  const handleDeleteCategory = async () => {
    setErrorConfirmation(null)
    if (confirmation != confirmationMsg)
    {
      setErrorConfirmation(`A confirmação deve ser idêntica a palavra ${confirmationMsg}`)
      return;
    }

    setConfirmation('')
    try {
      await axiosInstance.delete(`/categories/${category.id}`)
      toggleModal();
      showToast("Categoria deletada com sucesso", true);
      removeCategory(category)
    }catch (error: any)
    {
      toggleModal();
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Deletar Categoria - {category.name}</ModalHeader>
      <ModalBody>
        <p>Tem certeza que deseja deletar essa categoria?</p> 
        <div className="alert alert-danger" role="alert">
          Essa ação é irreversível
        </div>
        <div className="form-floating">
          <input type="text" id="floatingInputTitle" autoComplete="off" 
            className={`form-control ${errorConfirmation ? 'is-invalid' : ''}`}
            onChange={(ev) => setConfirmation(ev.target.value)}
            value={confirmation}/>
          <label htmlFor="floatingInputTitle">Confirme a ação digitando: '{confirmationMsg}'.</label>
          <div className="invalid-feedback">
            { errorConfirmation }
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleDeleteCategory}>
          Confirmar
        </Button>
      </ModalFooter>
    </Modal>
  )
}