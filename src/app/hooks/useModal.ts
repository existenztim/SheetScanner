import { useState } from 'react';
import { FormResponseTypes } from '../models/enums/EFormResponse';
import { Imodal } from '../models/interfaces/IModal';

const useModal = () => {
  const [modal, setModal] = useState<Imodal>({
    message: '',
    type: FormResponseTypes.ERROR,
  });

  const handleModalResponse = (message: string, type: string) => {
    setModal({
      message: message,
      type: type,
    });
  };

  return { modal, handleModalResponse };
};

export default useModal;
