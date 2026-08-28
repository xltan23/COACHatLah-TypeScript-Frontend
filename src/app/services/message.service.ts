import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, map, Observable, take } from "rxjs";
import { MessageDto, MessageRequest, MessageResponse } from "../models";

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private baseUrl = 'http://localhost:8080/api/message';

    constructor(private http:HttpClient) {}

    // GET conversation history
    getConversationHistory(id1:string, id2:string):Observable<MessageDto[]> {
        const url = `${this.baseUrl}/history?uid1=${id1}&uid2=${id2}`;
        return this.http.get<MessageDto[]>(url).pipe(take(1));
    }

    // POST message request (Receive response for delivery status)
    sendMessage(messageReq:MessageRequest):Promise<MessageResponse> {
        const url = `${this.baseUrl}/send`
        return firstValueFrom(this.http.post<MessageResponse>(url, messageReq));
    }

}