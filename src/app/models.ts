export interface ProfileDto {
    id: string;
    name: string;
    gender: string;
    role: Role;
    school: string;
    classCohort: string;
    cca: string;
    // status: AccountStatus;
}

export interface PostResponse {
    postMessage: string;
}

export interface MessageDto {
    messageId:string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: string;
}

export interface MessageRequest {
    senderId: string;
    recipientId: string;
    content: string;
}

export interface MessageResponse {
    delivered: boolean;
    message: MessageDto;
    flagCategory: string | null;
    llmRephrase: string | null;
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
