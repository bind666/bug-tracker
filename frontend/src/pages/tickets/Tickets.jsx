import ProjectSelector from "../../components/projects/ProjectSelector";
import TicketForm from "../../components/tickets/TicketForm";
import TicketList from "../../components/tickets/TicketList";
import { useProject } from "../../context/ProjectContext";
import { useState } from "react";

//This is Main Ticket Page Where Ticket Form And Tickets are Displaying
const TicketPage = () => {
    const { selectedProject } = useProject(); // Full object
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [editTicket, setEditTicket] = useState(null);

    const handleTicketCreated = () => {
        setRefreshFlag((prev) => !prev);
    };


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-white mb-4">Ticket Management</h2>

            <ProjectSelector />

            {selectedProject ? (
                <>
                    <p className="text-sm text-gray-300 mb-2">
                        Selected Project: <span className="font-semibold text-yellow-400">{selectedProject.title}</span>
                    </p>
                    <TicketForm
                        projectId={selectedProject._id}
                        onCreated={handleTicketCreated}
                        editData={editTicket}
                        clearEdit={() => setEditTicket(null)}
                    />
                    <TicketList
                        projectId={selectedProject._id}
                        refreshFlag={refreshFlag}
                        onEdit={setEditTicket}
                    />
                </>
            ) : (
                <p className="text-gray-400">
                    Please select a project to view or create tickets.
                </p>
            )}
        </div>
    );
};

export default TicketPage;
