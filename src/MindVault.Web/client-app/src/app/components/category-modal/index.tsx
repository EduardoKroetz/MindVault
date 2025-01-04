"use client";

import axiosInstance from "@/app/api/axios";
import { useCategories } from "@/app/contexts/categoriesContext";
import useToastMessage from "@/app/hooks/useToastMessage";
import ICategory from "@/app/Interfaces/ICategory";
import IResponse from "@/app/Interfaces/IResponse";
import { ErrorUtils } from "@/app/Utils/ErrorUtils";
import { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form, FormGroup, Label, Input, FormFeedback } from "reactstrap";
import LoadingSpinner from "../loading-spinner";

interface CategoryModalProps {
  isEdit: boolean;
  toggle: () => void;
  open: boolean;
  category: ICategory | null;
}

export default function CategoryModal({
  isEdit,
  toggle,
  open,
  category,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [description, setDescription] = useState("");

  const [nameError, setNameError] = useState<string | null>(null);
  const showToast = useToastMessage();
  const { addCategory, updateCategory } = useCategories();

  const [loading, setLoading] = useState(false);

  const generateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Gera cor hexadecimal
    setColor(randomColor);
  };

  useEffect(() => {
    setNameError(null)
    if (isEdit && category) {
      setName(category.name);
      setColor(category.color);
      setDescription(category.description);
    } else {
      resetStates()
    }
  }, [category]);

  const resetStates = () => {
    setName("");
    setNameError(null);
    setDescription("");
    generateRandomColor();
  };

  if (isEdit && !category) return;

  const handleSubmit = async (ev: any) => {
    ev?.preventDefault();
    setLoading(true);

    const getNameError = (error: any) => {
      const nameError = error.response.data?.errors?.Name;
      setNameError(nameError);
      return nameError;
    };

    try {
      if (isEdit && category) {
        // Atualizar categoria
        await axiosInstance.put(`/categories/${category.id}`, {
          name,
          color,
          description,
        });
        toggle();
        showToast("Categoria atualizada com sucesso!", true);

        // Atualizar categoria
        category.name = name;
        category.color = color;
        category.description = description;
        updateCategory(category);
      } else {
        // Criar categoria
        const response = await axiosInstance.post(`/categories`, {
          name,
          color,
          description,
        });
        const categoryId = response.data.data.id;
        showToast("Categoria criada com sucesso!", true);
        toggle();

        // Add category in memory
        const getCategoryRes = await axiosInstance.get<IResponse<ICategory>>(
          `/categories/${categoryId}`
        );
        const category = getCategoryRes.data.data;
        addCategory(category);
      }
    } catch (error: any) {
      const nameError = getNameError(error);

      if (!nameError) {
        showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
        toggle();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal toggle={toggle} isOpen={open}>
      <ModalHeader>{isEdit ? "Editar Categoria" : "Criar Categoria"}</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup floating>
            <Input
              type="text"
              id="categoryName"
              placeholder="Trabalho"
              autoComplete="off"
              invalid={!!nameError}
              onChange={(ev) => setName(ev.target.value)}
              value={name}
            />
            <Label for="categoryName">Nome</Label>
            {nameError && <FormFeedback>{nameError}</FormFeedback>}
          </FormGroup>
          <FormGroup>
            <Label for="categoryColor">Cor</Label>
            <div className="d-flex gap-4 align-items-center">
              <Input
                type="color"
                id="categoryColor"
                title="Escolha uma cor"
                onChange={(ev) => setColor(ev.target.value)}
                value={color}
              />
              <Button onClick={generateRandomColor} color="secondary">
                <i className="bi-shuffle"></i>
              </Button>
            </div>
          </FormGroup>
          <FormGroup floating>
            <Input
              type="textarea"
              id="categoryDescription"
              placeholder="Descrição"
              onChange={(ev) => setDescription(ev.target.value)}
              value={description}
            />
            <Label for="categoryDescription">Descrição</Label>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={toggle} color="secondary">
          Cancelar
        </Button>
        <Button disabled={loading} color="primary" onClick={handleSubmit}>
          {loading ? "Salvando" : "Salvar"}
          {loading && <LoadingSpinner />}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
