export interface Profile {
    id: string;
    name: string;
    gender: string;
    role: Role;
    school: string;
    classCohort: string;
    cca: string;
    status: AccountStatus;
}

export interface PostResponse {
    message: string;
}

export interface MessageDto {
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: string;
}

export enum Role {
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
    COUNSELLOR = 'COUNSELLOR',
    DISCIPLINARY_COMMITTEE = 'DISCIPLINARY_COMMITTEE',
    ADMIN = 'ADMIN'
}

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    INACTIVE = 'INACTIVE'
}
