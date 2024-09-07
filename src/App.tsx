import { DragDropListView, PreviewArea, Sidebar } from "@app/components";

import { Welcome } from "./components/Welcome";
import { useState } from "react";

export default function App() {
  const [showWelcomePage, setShowWelcomePage] = useState(true);

  const toggleWelcomePage = () => {
    setShowWelcomePage(welcome => !welcome);
  }

  return (
    <>
      {showWelcomePage && <Welcome toggleWelcomePage={toggleWelcomePage} />}

      {!showWelcomePage && (
        <div className="bg-blue-100 font-sans">
          <div className="h-screen overflow-hidden flex flex-row  ">
            <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200">
              <Sidebar />
              <DragDropListView />
            </div>
            <div className="w-1/2 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200">
              <PreviewArea />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
