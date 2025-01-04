"use client"

import { createContext, useContext, useEffect, useState } from "react";
import IUser from "../Interfaces/IUser";
import { useRouter } from "next/navigation";
import useToastMessage from "../hooks/useToastMessage";
import axiosInstance from "../api/axios";
import { ErrorUtils } from "../Utils/ErrorUtils";

interface AccountContextProps {
  account: IUser | null,
  getUser: () => Promise<void>
} 

const AccountContext = createContext<AccountContextProps>({ account: null, getUser: async () => {} });

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
  const [account, setAccount] = useState<IUser | null>(null);
  const [firstLoad, setFirstLoad] = useState(true);

  const getUser = async () => {
    if (!firstLoad)
      return

    const token = localStorage.getItem('token');
    if (token){
      try {
        const response : any = await axiosInstance.get("/accounts")
        setAccount(response.data.data)
        setFirstLoad(false)
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
    <AccountContext.Provider value={{ account, getUser }}>
      {children}
    </AccountContext.Provider>
  );
};
