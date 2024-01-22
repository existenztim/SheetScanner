interface AlertModalProps {
    errorMessage: string;
    closeAlertModal: () => void;
  }
  const AlertModal = ({ errorMessage, closeAlertModal }: AlertModalProps) => {
    return (
      <div className="flex items-center justify-center h-screen w-screen top-[-6rem] fixed z-40 bg-slate-100 bg-opacity-50">
        <div className="w-96 p-4 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col items-stretch justify-center">
            <h4 className="font-bold text-lg w-full border-b border-grey-500 text-red-600">Error</h4>
            <p className="mt-4 text-gray-800">{errorMessage}</p>
          </div>
          <div className="mt-4 flex space-x-4 justify-end">
            <button
              className="bg-yellow-600 rounded text-gray-800 py-2 hover:text-gray-50"
              onClick={closeAlertModal}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default AlertModal;