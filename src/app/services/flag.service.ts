import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, take } from "rxjs";
import { FlagDto } from "../models";

@Injectable({ providedIn: 'root' })
export class FlagService {

    private baseUrl = `${environment.apiUrl}/api/flagrecords`;

    constructor(private http: HttpClient) {}

    // GET flag  records
    getFlagRecords(id:string):Observable<FlagDto[]> {
        const url = `${this.baseUrl}/${id}`;
        return this.http.get<FlagDto[]>(url).pipe(take(1));
    }
}