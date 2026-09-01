import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PostResponse, ProfileDto } from "../models";
import { firstValueFrom, map, Observable, take } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private baseUrl = 'http://localhost:8080/api/profile';

    constructor(private http:HttpClient) {}

    // POST new profiles
    postProfile(profileDto:ProfileDto):Promise<PostResponse> {
        const url = `${this.baseUrl}/add`;
        return firstValueFrom(this.http.post<PostResponse>(url, profileDto));
    }

    // GET specific profile
    getSpecificProfile(id:string):Observable<ProfileDto> {
        const url = `${this.baseUrl}/${id}`;
        return this.http.get<ProfileDto>(url).pipe(take(1));
    }

    // GET class profiles
    getClassProfiles(id:string):Observable<ProfileDto[]> {
        const url = `${this.baseUrl}/getClass/${id}`;
        return this.http.get<ProfileDto[]>(url).pipe(take(1));
    }

    // GET CCA profiles
    getCCAProfiles(id:string):Observable<ProfileDto[]> {
        const url = `${this.baseUrl}/getCCA/${id}`;
        return this.http.get<ProfileDto[]>(url).pipe(take(1));
    }
}