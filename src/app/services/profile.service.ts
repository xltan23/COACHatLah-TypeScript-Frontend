import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Profile } from "../models";
import { firstValueFrom, map, Observable, take } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private baseUrl = 'http://localhost:8080/profile';

    constructor(private http:HttpClient) {}

    postProfile(profile:Profile):Promise<String> {

        const payload = new HttpParams()
            .set("name", profile.name)
            .set("gender", profile.gender)
            .set("role", profile.role)
            .set("school", profile.school)
            .set("classCohort", profile.classCohort)
            .set("cca", profile.cca)
        const headers = new HttpHeaders()
            .set("Content-Type", "application/x-www-form-urlencoded")
            .set("Accept", "application/json")
        return firstValueFrom(this.http.post<String>(`${this.baseUrl}/add`, payload.toString(), {headers}))
    }

    // Get Class Profiles
    getClassProfiles(id:string):Observable<Profile[]> {
        const url = `${this.baseUrl}/getClass/${id}`;
        return this.http.get<Profile[]>(url)
            .pipe(take(1), map(v => {
                const data:Profile[] = v;
                return data.map(p => {
                    return {
                        name: p.name,
                        gender: p.gender,
                        role: p.role,
                        school: p.school,
                        classCohort: p.classCohort,
                        cca: p.cca
                    } as Profile
                })
            }))
    }

    // Get CCA Profiles
    getCCAProfiles(id:string):Observable<Profile[]> {
        const url = `${this.baseUrl}/getCCA/${id}`;
        return this.http.get<Profile[]>(url)
            .pipe(take(1), map(v => {
                const data:Profile[] = v;
                return data.map(p => {
                    return {
                        name: p.name,
                        gender: p.gender,
                        role: p.role,
                        school: p.school,
                        classCohort: p.classCohort,
                        cca: p.cca
                    } as Profile
                })
            }))
    }
}