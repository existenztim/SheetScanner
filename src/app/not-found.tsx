import { RiEmotionSadLine } from "react-icons/ri";
const Custom404 = () => {
  return (
    <div className='flex items-center justify-center h-screen w-screen top-[0px] fixed z-[49] bg-slate-100 bg-opacity-50 p-0 m-0'>
    <div className="w-96 p-4 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-stretch justify-center">
        <h2 className="font-bold w-full border-b border-grey-500 text-3xl">404 - Page Not Found</h2>
        <p className="mt-4 text-gray-800">Oops! The page you're looking for is just a blank sheet.</p>
      </div>
      <div className="mt-4 flex space-x-4 justify-end text-lg">
        <RiEmotionSadLine />
      </div>
    </div>
  </div>
  );
};

export default Custom404;