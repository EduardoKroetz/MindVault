"use client"

import axiosInstance from "@/app/api/axios";
import { useCategories } from "@/app/contexts/categoriesContext";
import useToastMessage from "@/app/hooks/useToastMessage";
import ICategory from "@/app/Interfaces/ICategory";
import IResponse from "@/app/Interfaces/IResponse";
import { ErrorUtils } from "@/app/Utils/ErrorUtils";
import { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface CategoryModalProps {
  isEdit: boolean,
  toggle: () => void,
  open: boolean,
  category: ICategory | null
}

export default function CategoryModal({ isEdit, toggle, open, category } : CategoryModalProps) {

  const [name, setName] = useState("")
  const [color, setColor] = useState("#ffffff")
  const [description, setDescription] = useState("")

  const [nameError, setNameError] = useState<string | null>(null)
  const showToast = useToastMessage();
  const { addCategory, updateCategory } = useCategories();

  const generateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Gera cor hexadecimal
    setColor(randomColor);
  };

  useEffect(() => {
    if (isEdit && category)
    {
      setName(category.name)
      setColor(category.color)
      setDescription(category.description)
    }else {
      setName("")
      setColor("")
      setDescription("")
      generateRandomColor()
    }
  }, [category])

  if (isEdit && !category)
    return

  const handleSubmit = async (ev: any) => {
    ev?.preventDefault();

    const getNameError = (error: any) => {
      const nameError = error.response.data?.errors?.Name;
      setNameError(nameError);
      return nameError;
    }

    if (isEdit && category)
    { //Atualizar categoria
      try {
        await axiosInstance.put(`/categories/${category.id}`, { name, color, description })

        showToast("Categoria atualizada com sucesso!", true)
        toggle()

        //Atualizar categoria
        category.name = name;
        category.color = color;
        category.description = description;
        updateCategory(category)

      }catch (error: any) {
        const nameError = getNameError(error);

        if (!nameError)
        {
          showToast(ErrorUtils.GetErrorMessageFromResponse(error), false)
          toggle();
        }
      }
    }else // Criar categoria
    {
      try {
        const response = await axiosInstance.post(`/categories`, { name, color, description })
        const categoryId = response.data.data.id;
        toggle()
        showToast("Categoria criada com sucesso!", true)

        // Add category in memory
        const getCategoryRes = await axiosInstance.get<IResponse<ICategory>>(`/categories/${categoryId}`)
        const category = getCategoryRes.data.data;
        addCategory(category)
      }catch (error: any) {
        const nameError = getNameError(error);

        if (!nameError)
        {
          showToast(ErrorUtils.GetErrorMessageFromResponse(error), false)
          toggle();
        }
      }
    }
  }

  return (
    <Modal toggle={toggle} isOpen={open}>
      <ModalHeader>
        { isEdit ? "Editar Categoria" : "Criar Categoria" }
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input type="text" id="categoryName" placeholder="Trabalho" 
              className={`form-control ${ nameError ? 'is-invalid' : ''} `}
              onChange={(ev) => setName(ev.target.value)}
              value={name}/>
            <label htmlFor="categoryName">Nome</label>
            <div className="invalid-feedback">
              { nameError }
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="categoryColor" className="form-label">Cor</label>
            <div className="d-flex gap-4">
              <input type="color" className="form-control form-control-color" id="categoryColor" title="Escolha uma cor" 
                onChange={(ev) => setColor(ev.target.value)}
                value={color}/>
              <Button onClick={generateRandomColor}>
                <span className="mx-2">Cor aleatória</span>
                <i className="bi-shuffle" ></i>
              </Button>
            </div>
  
          </div>
          <div className="form-floating">
            <textarea className="form-control" id="categoryDescription" placeholder="Descrição" 
              onChange={(ev) => setDescription(ev.target.value)}
              value={description}/>
            <label htmlFor="categoryDescription">Descrição</label>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggle}>Cancelar</Button>
        <Button color="primary" onClick={handleSubmit}>Salvar</Button>
      </ModalFooter>
      
    </Modal>
  )
}