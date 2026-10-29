import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { EscalationDto, PostResponse, ReviewDto } from "../models";
import { firstValueFrom, Observable, take } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root'})
export class EscalationService {

    private baseUrl = `${environment.apiUrl}/api/escalations`;

    constructor(private http: HttpClient) {}

    // GET escalation records
    getEscalationRecords():Observable<EscalationDto[]> {
        const url = `${this.baseUrl}/get`;
        return this.http.get<EscalationDto[]>(url).pipe(take(1));
    }

    // POST review for an escalation record
    postEscalationReview(review: ReviewDto):Promise<PostResponse> {
        const url = `${this.baseUrl}/review`;
        return firstValueFrom(this.http.post<PostResponse>(url, review));
    }
}