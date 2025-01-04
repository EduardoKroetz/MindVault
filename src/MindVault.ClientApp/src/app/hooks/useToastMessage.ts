import { useToast } from '../contexts/toastContext';

const useToastMessage = () => {
  const { addToast } = useToast();

  const showToast = (message: string, success: boolean) => {
    addToast(message, success);
  };

  return showToast;
};

export default useToastMessage;
