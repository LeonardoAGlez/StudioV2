import { httpClient } from './httpClient';

export interface GenerationRequest {
  prompt: string;
  negative_prompt?: string;
  raw_camera?: {
    position: [number, number, number];
    rotation: [number, number, number];
    fov: number;
  };
  raw_light?: {
    position?: [number, number, number];
    intensity?: number;
  };
  project_id?: string;
}

export interface GenerationResponse {
  id: string;
  user_id: string;
  project_id?: string;
  prompt: string;
  negative_prompt?: string;
  image_url?: string;
  video_url?: string;
  status: 'generating' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface ProjectRequest {
  name: string;
  description?: string;
  status?: 'draft' | 'completed' | 'archived';
  scene_data?: any;
}

export interface ProjectResponse {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: string;
  scene_data?: any;
  created_at: string;
  updated_at: string;
  generations?: GenerationResponse[];
}

export const generationApi = {
  // Generar un frame/imagen
  async generateSingleFrame(data: GenerationRequest, token?: string): Promise<GenerationResponse> {
    return httpClient.post('/generation/single', data, token);
  },

  // Obtener historial de generaciones
  async getGenerations(token?: string): Promise<GenerationResponse[]> {
    return httpClient.get('/generation', token);
  },

  // Obtener una generación específica
  async getGeneration(id: string, token?: string): Promise<GenerationResponse> {
    return httpClient.get(`/generation/${id}`, token);
  },

  // Health check de FIBO
  async healthCheck(): Promise<{ status: string }> {
    return httpClient.get('/generation/health');
  },

  // Obtener presets de iluminación
  async getLightingPresets(token?: string): Promise<any[]> {
    return httpClient.get('/presets/lighting', token);
  },

  // Obtener presets de cámara
  async getCameraPresets(token?: string): Promise<any[]> {
    return httpClient.get('/presets/camera', token);
  },
};

export const projectApi = {
  // Obtener proyectos del usuario
  async getProjects(token?: string, page = 1, perPage = 10): Promise<{
    success: boolean;
    projects: ProjectResponse[];
    total: number;
    pages: number;
  }> {
    return httpClient.get(`/projects?page=${page}&per_page=${perPage}`, token);
  },

  // Obtener un proyecto específico
  async getProject(id: string, token?: string): Promise<ProjectResponse> {
    return httpClient.get(`/projects/${id}`, token);
  },

  // Crear nuevo proyecto
  async createProject(data: ProjectRequest, token?: string): Promise<ProjectResponse> {
    return httpClient.post('/projects', data, token);
  },

  // Actualizar proyecto
  async updateProject(id: string, data: Partial<ProjectRequest>, token?: string): Promise<ProjectResponse> {
    return httpClient.put(`/projects/${id}`, data, token);
  },

  // Eliminar proyecto
  async deleteProject(id: string, token?: string): Promise<{ success: boolean }> {
    return httpClient.delete(`/projects/${id}`, token);
  },

  // Guardar escena en proyecto
  async saveScene(projectId: string, sceneData: any, token?: string): Promise<any> {
    return httpClient.put(`/projects/${projectId}`, { scene_data: sceneData }, token);
  },
};
