// useRegisterForm.js
import { useState } from 'react';

const useRegisterForm = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [update, setUpdate] = useState(false);
  const [toBeUpdatedCustomer, setToBeUpdatedCustomer] = useState(null);

  const handleUpdate = (data) => {
    setToBeUpdatedCustomer(data);
    setUpdate(true);
    setShowRegister(true);
  };

  const handleHide = () => {
    setShowRegister(false);
    setUpdate(false)
  };
  const handleShowRegister = () => {
    setShowRegister(true);
  };

  return { showRegister, update, toBeUpdatedCustomer, handleUpdate, handleHide,
handleShowRegister };
};

export default useRegisterForm;
