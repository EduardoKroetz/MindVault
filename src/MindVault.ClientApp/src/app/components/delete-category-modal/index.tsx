"use client"

import axiosInstance from "@/app/api/axios";
import { useCategories } from "@/app/contexts/categoriesContext";
import useToastMessage from "@/app/hooks/useToastMessage";
import ICategory from "@/app/Interfaces/ICategory";
import { ErrorUtils } from "@/app/Utils/ErrorUtils";
import { useState } from "react";
import { Alert, Button, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import LoadingSpinner from "../loading-spinner";

export default function DeleteCategoryModal({ isOpen, toggleModal, category } : { isOpen: boolean, toggleModal(): void, category: ICategory | null })
{
  const [confirmation, setConfirmation] = useState("");
  const confirmationMsg = "deletar"
  const [errorConfirmation, setErrorConfirmation] = useState<string | null>(null)
  const { removeCategory } = useCategories()
  const showToast = useToastMessage();
  const [deleting, setDeleting] = useState(false);

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
    setDeleting(true);
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
    setDeleting(false);
  }

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Deletar Categoria - {category.name}</ModalHeader>
      <ModalBody>
        <p>Tem certeza que deseja deletar essa categoria?</p> 
        <Alert className="alert-danger">Essa ação é irreversível </Alert>
        <FormGroup className="form-floating">
          <Input type="text" id="floatingInputTitle" autoComplete="off" 
            invalid={errorConfirmation != null}
            onChange={(ev) => setConfirmation(ev.target.value)}
            value={confirmation}/>
          <Label htmlFor="floatingInputTitle">Confirme a ação digitando: '{confirmationMsg}'.</Label>
          <FormFeedback className="invalid-feedback">{ errorConfirmation }</FormFeedback>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal}>Cancelar</Button>
        <Button color="primary" onClick={handleDeleteCategory}>
          {deleting ? 'Deletando' : 'Deletar' }
          {deleting && <LoadingSpinner />}
        </Button>
      </ModalFooter>
    </Modal>
  )
}