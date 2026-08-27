import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, take } from "rxjs";
import { MessageDto } from "../models";

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    private baseUrl = 'http://localhost:8080/api/message';

    constructor(private http:HttpClient) {}

    getConversationHistory(id1:string, id2:string):Observable<MessageDto[]> {
        const url = `${this.baseUrl}/history?uid1=${id1}&uid2=${id2}`;
        return this.http.get<MessageDto[]>(url)
            .pipe(take(1), map(v => {
                const data:MessageDto[] = v;
                return data.map(m => {
                    return {
                        senderId: m.senderId,
                        recipientId: m.recipientId,
                        content: m.content,
                        timestamp: m.timestamp
                    } as MessageDto;
                })
            }))
    }
}