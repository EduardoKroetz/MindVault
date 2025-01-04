"use client"

import axiosInstance from "@/app/api/axios";
import { useNotes } from "@/app/contexts/notesContext";
import useToastMessage from "@/app/hooks/useToastMessage";
import INote from "@/app/Interfaces/INote";
import { ErrorUtils } from "@/app/Utils/ErrorUtils";
import { useState } from "react";
import { Alert, Button, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import LoadingSpinner from "../loading-spinner";

export default function DeleteNoteModal({ isOpen, toggleModal, note } : { isOpen: boolean, toggleModal(): void, note: INote })
{
  const [confirmation, setConfirmation] = useState("");
  const confirmationMsg = "deletar"
  const [errorConfirmation, setErrorConfirmation] = useState<string | null>(null)
  const { removeNote } = useNotes()
  const showToast = useToastMessage();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteNote = async () => {
    setErrorConfirmation(null)
    if (confirmation != confirmationMsg)
    {
      setErrorConfirmation(`A confirmação deve ser idêntica a palavra ${confirmationMsg}`)
      return;
    }

    setDeleting(true);
    setConfirmation('')
    try {
      await axiosInstance.delete(`/notes/${note.id}`)
      toggleModal();
      showToast("Anotação deletada com sucesso", true);
      removeNote(note);
    }catch (error: any)
    {
      toggleModal();
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false)
    }
    setDeleting(false);
  }

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Deletar Anotação - {note.title}</ModalHeader>
      <ModalBody>
        <p>Tem certeza que deseja deletar essa anotação?</p> 
        <Alert className="alert-danger">Essa ação é irreversível</Alert>
        <FormGroup floating>
          <Input type="text" id="floatingInputTitle" autoComplete="off" 
            invalid={errorConfirmation != null}
            onChange={(ev) => setConfirmation(ev.target.value)}
            value={confirmation}/>
          <Label htmlFor="floatingInputTitle">Confirme a ação digitando: '{confirmationMsg}'.</Label>
          <FormFeedback className="invalid-feedback">{ errorConfirmation }</FormFeedback>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal}> Cancelar</Button>
        <Button disabled={deleting} color="primary" onClick={handleDeleteNote}>
          {deleting ? 'Deletando' : 'Deletar'}
          {deleting && <LoadingSpinner/> }
        </Button>
      </ModalFooter>
    </Modal>
  )
}