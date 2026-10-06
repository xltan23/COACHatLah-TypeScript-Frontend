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

// Mirrors backend EscalationDto: Long -> number, Instant -> ISO-8601 string
export interface EscalationDto {
    id: number;
    studentId: string;
    classCohort: string;
    triggerType: string;    // THRESHOLD_EXCEEDED | ANOMALY_DETECTED | MANUAL_REPORT
    triggerDetail: string;  // flag count, or comma-separated spike hours
    reviewStatus: string;   // NONE | TO_BE_REVIEWED | UNDER_REVIEW | REVIEWED | SANCTIONED
    createdAt: string;
    // null until the escalation is reviewed
    reviewedBy: string | null;
    reviewComments: string | null;
    reviewedAt: string | null;
}

// Mirrors backend ReviewDto
export interface ReviewDto {
    escalationId: number;
    reviewedBy: string;
    reviewComments: string;
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
