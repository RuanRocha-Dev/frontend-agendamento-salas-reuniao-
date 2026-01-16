export interface MeetingRoom {
    id: number;
    name: string;
    capacity: number;
    createdAt?: Date;
}

export interface Meeting {
    id: string;
    roomId: string;
    startDate: string;
    endDate: string;
}

export interface dataRooms {
    id: number;
    name: string;
    capacity: number;
    status?: boolean;
    created_at: Date
    updated_at?: Date
}

export interface returnApi {
    sucess: boolean,
    message: string,
    data: unknown
}

export interface CreateRoomData {
    name: string;
    capacity: number;
}

export interface EditRoomData {
    id: number;
    name: string;
    capacity: number;
}

export interface ScheduleMeetingData {
    idMeetingRoom: number;
    description: string;
    startTime: string;
    endTime: string;
}

export interface Appointment {
    id: number;
    idMeetingRoom: number;
    description: string;
    startTime: string;
    endTime: string;
    createdAt?: Date;
}
