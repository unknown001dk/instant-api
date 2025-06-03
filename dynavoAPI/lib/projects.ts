import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';

export type SchemaField = {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
};

export type Project = {
  // id: string;
  name: string;
  connectionUrl: string;
  schema: SchemaField[];
  createdAt: string;
  apiUrl: string;
};

type ProjectsState = {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'apiUrl'>) => void;
  removeProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
};

export const useProjects = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],
      addProject: (projectData) => {
        const id = Math.random().toString(36).substring(2, 9);
        const apiUrl = `https://api.dynavoapiurl.com/${id}`;
        
        const newProject: Project = {
          // id,
          name: projectData.name,
          connectionUrl: projectData.connectionUrl,
          schema: projectData.schema,
          createdAt: new Date().toISOString(),
          apiUrl,
        };
        
        set((state) => ({
          projects: [...state.projects, newProject],
        }));
      },
      removeProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }));
      },
      getProject: (id) => {
        return get().projects.find((project) => project.id === id);
      },
    }),
    { name: 'projects-storage' }
  )
);