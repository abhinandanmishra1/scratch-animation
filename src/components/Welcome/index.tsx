import { Logo } from "@app/assets";
import { useState } from "react";

interface WelcomeProps {
  toggleWelcomePage: () => void;
}

const ReadInstructions = () => {
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  return (
    <>
      {/* Button to toggle the modal */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={toggleModal}
      >
        Read Instructions
      </button>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-md w-full flex flex-col items-center">
            <img src={Logo} alt="logo" className="w-32 aspect-auto" />
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 justify-center">
              How to Use?
            </h2>
            <div className="mb-4">
              <h3 className="text-gray-600">
                Welcome to our platform! Here's a brief guide on how to use it:
              </h3>
              <ul className="pl-5 list-decimal">
                <li>
                  Create animations using the drag-and-drop functionality.
                </li>
                <li>
                  Explore various animations like moving steps, turning degrees,
                  and more.
                </li>
                <li>
                  Create multiple sprites and make them interact with each
                  other.
                </li>
              </ul>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Welcome component
export const Welcome = ({ toggleWelcomePage }: WelcomeProps) => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-yellow-500">
          Welcome to the  <img src={Logo} alt="logo" className="w-32 aspect-auto" />
        </h1>
        <div className="flex flex-col items-center space-y-4">
          <ReadInstructions />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={toggleWelcomePage}
          >
            Start Creating
          </button>
        </div>
      </div>
    </div>
  );
};
