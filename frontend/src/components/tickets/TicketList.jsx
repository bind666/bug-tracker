import { useEffect, useState } from "react";
import { getTicketsByProject, updateTicket } from "../../services/ticketService";
import toast from "react-hot-toast";
import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";

const columns = ["To Do", "In Progress", "Done"];

// All ticket are displayed using ticket list 
const TicketList = ({ projectId, refreshFlag, onEdit }) => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                if (!projectId) return;
                const res = await getTicketsByProject(projectId);
                setTickets(res.data.data);
            } catch (err) {
                console.error("❌ Error fetching tickets:", err);
                toast.error("Failed to load tickets");
            }
        };

        fetchTickets();
    }, [projectId, refreshFlag]);

    const groupedTickets = columns.reduce((acc, status) => {
        acc[status] = tickets.filter((ticket) => ticket.status === status);
        return acc;
    }, {});

    const handleDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination || source.droppableId === destination.droppableId) return;

        try {
            const updatedTickets = tickets.map((t) =>
                t._id === draggableId ? { ...t, status: destination.droppableId } : t
            );
            setTickets(updatedTickets);
            await updateTicket(draggableId, { status: destination.droppableId });
            toast.success("Status updated");
        } catch (err) {
            console.error("❌ Failed to update status:", err);
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="bg-gray-900 p-4 mt-4 rounded shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">🎯 Ticket Board (Drag to update)</h2>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {columns.map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-800 p-4 rounded min-h-[300px]"
                                >
                                    <h3 className="text-lg font-semibold mb-3 text-yellow-400">{status}</h3>

                                    {groupedTickets[status].map((ticket, index) => (
                                        <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-gray-700 p-3 mb-2 rounded shadow hover:shadow-lg"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="text-md font-bold text-yellow-300">{ticket.title}</h4>
                                                            <p className="text-sm text-gray-300">{ticket.description}</p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                <span className="font-semibold">Priority:</span> {ticket.priority}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                <span className="font-semibold">Assignee:</span>{" "}
                                                                {ticket.assignee?.name || "Unassigned"}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => onEdit(ticket)}
                                                            className="text-xs text-green-400 mt-1 underline"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default TicketList;
