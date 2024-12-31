"use client"

import { createContext, useContext, useEffect, useState } from "react";
import IUser from "../Interfaces/IUser";
import { useRouter } from "next/navigation";
import useToastMessage from "../hooks/useToastMessage";
import axiosInstance from "../api/axios";
import { ErrorUtils } from "../Utils/ErrorUtils";

const AccountContext = createContext<IUser | undefined>(undefined);

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within a AccountProvider");
  }
  return context;
};

export const AccountProvider = ({ children }: any) => {
  const showToast = useToastMessage();
  const router = useRouter();
  const [account, setAccount] = useState<IUser>({ id: '', username: '', email: ''});

  useEffect(() => {
    getUser();
  }, [])

  const getUser = async () => {
    const token = localStorage.getItem('token');
    if (token){
      try {
        const response : any = await axiosInstance.get("/accounts")
        console.log(response)
        setAccount(response.data.data)
      } catch (error: any)
      {
        var errorMsg = ErrorUtils.GetErrorMessageFromResponse(error);
        showToast(errorMsg, false);
      }
    }
    else {
      showToast("Você não está autenticado", false)
      router.push("/login")
    }
  }

  return (
    <AccountContext.Provider value={account}>
      {children}
    </AccountContext.Provider>
  );
};
