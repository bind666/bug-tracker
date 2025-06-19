import { createContext, useContext, useState } from "react";

//This Is Project Context Context Globally Handels Auth
const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
    const [selectedProject, setSelectedProject] = useState(null); // globally accessible

    return (
        <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
            {children}
        </ProjectContext.Provider>
    );
};
