import axios from 'axios';

//const API_URL = import.meta.env.VITE_API_URL || 'https://bafcc-server.onrender.com';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Address {
    village: string;
    post_office: string;
    police_station: string;
    district: string;
    pin: string;
}

export interface ApplicationCreate {
    name: string;
    father_name: string;
    mother_name: string;
    guardian_name?: string;
    dob: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
    aadhar_number?: string;
    category: string;
    mobile_number: string;
    alternate_mobile_number?: string;
    address: Address;
    current_address: Address;
    school_name: string;
    current_class: string;
    playing_position: string;
    medical_issues?: string;
    image_url?: string;
}

export interface Application {
    id?: number;
    registration_number: string;
    name: string;
    father_name: string;
    mother_name: string;
    guardian_name?: string;
    dob: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
    aadhar_number?: string;
    category: string;
    mobile_number: string;
    alternate_mobile_number?: string;
    address: Address;
    current_address: Address;
    school_name: string;
    current_class: string;
    playing_position: string;
    medical_issues?: string;
    image_url?: string;
    created_at?: string;
}

export interface ApplicationsResponse {
    applications: Application[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

export interface ApplicationWithImages {
    application: Application;
    images: {
        logo: string | null;
        photo: string | null;
    };
}

export class ApplicationService {
    private static instance: ApplicationService;

    private constructor() {}

    static getInstance(): ApplicationService {
        if (!ApplicationService.instance) {
            ApplicationService.instance = new ApplicationService();
        }
        return ApplicationService.instance;
    }

    async getApplications(page: number = 1, size: number = 100): Promise<ApplicationsResponse> {
        const response = await axios.get<ApplicationsResponse>(`${API_URL}/api/v1/applications/?page=${page}&size=${size}`);
        return response.data;
    }

    async getApplication(id: number): Promise<Application> {
        const response = await axios.get<Application>(`${API_URL}/api/v1/applications/${id}`);
        return response.data;
    }

    async createApplication(application: ApplicationCreate): Promise<Application> {
        const response = await axios.post<Application>(`${API_URL}/api/v1/applications/`, application);
        return response.data;
    }

    async updateApplication(id: number, application: Application): Promise<Application> {
        const response = await axios.put<Application>(`${API_URL}/api/v1/applications/${id}`, application);
        return response.data;
    }

    async deleteApplication(id: number): Promise<void> {
        await axios.delete(`${API_URL}/api/v1/applications/${id}`);
    }

    async getApplicationWithImages(id: number): Promise<ApplicationWithImages> {
        const token = localStorage.getItem('access_token');
        const response = await axios.get<ApplicationWithImages>(`${API_URL}/api/v1/applications/${id}/pdf-images`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    }
}