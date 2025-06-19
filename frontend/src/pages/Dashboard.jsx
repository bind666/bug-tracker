import { useState } from "react";
import ProjectList from "../components/ProjectList";
import AddProjectModal from "../components/AddProjectModal";


//Project Dashboard
const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-purple-100">
      <div className="flex justify-between items-center mb-8 border-b border-purple-700 pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-purple-300 animate-fade-in">
          🚀 Project Dashboard
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 transition-all text-white font-bold px-6 py-2 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 duration-300"
        >
          ➕ Add Project
        </button>
      </div>

      <ProjectList />

      {/* Modal */}
      {modalOpen && (
        <div className="animate-fade-in">
          <AddProjectModal onClose={() => setModalOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
