import { FormResponseTypes } from '../models/enums/EFormResponse';

interface AlertModalProps {
  modal: {
    message: string;
    type: string;
  };
  closeAlertModal: () => void;
}

const AlertModal = ({ modal, closeAlertModal }: AlertModalProps) => {
  let color = '';
  let text = '';

  switch (modal.type) {
    case FormResponseTypes.ERROR:
      color = 'text-red-600';
      text = 'Error';
      break;
    case FormResponseTypes.SUCCESS:
      color = 'text-green-600';
      text = 'Success';
      break;
    case FormResponseTypes.INFORMATION:
      color = 'text-yellow-600';
      text = 'Information';
      break;
    default:
      break;
  }
  return (
    <div className="flex items-center justify-center h-screen w-screen top-[-3rem] fixed z-40 bg-slate-100 bg-opacity-50 p-0 m-0">
      <div className="w-96 p-4 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-stretch justify-center">
          <h4 className={`font-bold text-lg w-full border-b border-grey-500 ${color}`}>{text}</h4>
          <p className="mt-4 text-gray-800">{modal.message}</p>
        </div>
        <div className="mt-4 flex space-x-4 justify-end">
          <button
            className="sheetScanner-standard-link bg-yellow-600 rounded text-gray-800 py-2 hover:text-gray-50"
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
