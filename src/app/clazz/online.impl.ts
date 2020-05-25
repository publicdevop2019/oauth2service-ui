import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAuthorizeCode, IAuthorizeParty, IAutoApprove, INetworkService, IOrder, ITokenResponse } from '../interfaze/commom.interface';
import { IClient } from '../pages/summary-client/summary-client.component';
import { IForgetPasswordRequest, IPendingResourceOwner, IResourceOwner, IResourceOwnerUpdatePwd } from '../pages/summary-resource-owner/summary-resource-owner.component';
import { ISecurityProfile } from '../pages/summary-security-profile/summary-security-profile.component';
import { ICategory } from '../services/category.service';
import { IProductDetail, IProductSimple, IProductTotalResponse } from '../services/product.service';
import { getCookie } from './utility';
import { IPostCard } from '../services/post.service';
import { IComment } from '../services/comment.service';
import { IUserReactionResult } from '../services/reaction.service';






export class OnlineImpl implements INetworkService {
    private AUTH_SVC_NAME = '/auth-svc';
    private PRODUCT_SVC_NAME = '/product-svc';
    private PROFILE_SVC_NAME = '/profile-svc';
    private FILE_UPLOAD_SVC_NAME = '/file-upload-svc';
    private BBS_SVC_NAME = '/bbs-svc';
    set currentUserAuthInfo(token: ITokenResponse) {
        document.cookie = token === undefined ? 'jwt=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/' : 'jwt=' + JSON.stringify(token) + ';path=/';
    };
    get currentUserAuthInfo(): ITokenResponse | undefined {
        const jwtTokenStr: string = getCookie('jwt');
        if (jwtTokenStr !== 'undefined' && jwtTokenStr !== undefined) {
            return <ITokenResponse>JSON.parse(jwtTokenStr)
        } else {
            return undefined;
        }
    }
    // OAuth2 pwd flow
    constructor(private _httpClient: HttpClient) {
    }
    deletePost(id: string): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + this.BBS_SVC_NAME + '/admin/posts/' + id).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteComment(id: string): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + this.BBS_SVC_NAME + '/admin/comments/' + id).subscribe(next => {
                e.next(true)
            });
        });
    };
    rankLikes(pageNum: number, pageSize: number): Observable<IUserReactionResult> {
        return this._httpClient.get<IUserReactionResult>(environment.serverUri + this.BBS_SVC_NAME + '/admin/likes?pageNum=' + pageNum + '&pageSize=' + pageSize + '&sortOrder=ASC');
    };
    rankDisLikes(pageNum: number, pageSize: number): Observable<IUserReactionResult> {
        return this._httpClient.get<IUserReactionResult>(environment.serverUri + this.BBS_SVC_NAME + '/admin/dislikes?pageNum=' + pageNum + '&pageSize=' + pageSize + '&sortOrder=ASC');
    };
    rankReports(pageNum: number, pageSize: number): Observable<IUserReactionResult> {
        return this._httpClient.get<IUserReactionResult>(environment.serverUri + this.BBS_SVC_NAME + '/admin/reports?pageNum=' + pageNum + '&pageSize=' + pageSize + '&sortOrder=ASC');
    };
    rankNotInterested(pageNum: number, pageSize: number): Observable<IUserReactionResult> {
        return this._httpClient.get<IUserReactionResult>(environment.serverUri + this.BBS_SVC_NAME + '/admin/notInterested?pageNum=' + pageNum + '&pageSize=' + pageSize + '&sortOrder=ASC');
    };
    getAllComments(pageNum: number, pageSize: number): Observable<IComment[]> {
        return this._httpClient.get<IComment[]>(environment.serverUri + this.BBS_SVC_NAME + '/admin/comments?pageNum=' + pageNum + '&pageSize=' + pageSize + '&sortBy=id' + '&sortOrder=asc');
    };
    getAllPosts(pageNum: number, pageSize: number): Observable<IPostCard[]> {
        return this._httpClient.get<IPostCard[]>(environment.serverUri + this.BBS_SVC_NAME + '/admin/posts?pageNum=' + pageNum + '&pageSize=' + pageSize + '&sortBy=id' + '&sortOrder=asc');
    };
    getAllProducts(pageNum: number, pageSize: number): Observable<IProductTotalResponse> {
        return this._httpClient.get<IProductTotalResponse>(environment.serverUri + this.PRODUCT_SVC_NAME + '/categories/all?pageNum=' + pageNum + '&pageSize=' + pageSize);
    };
    getOrders(): Observable<IOrder[]> {
        return this._httpClient.get<IOrder[]>(environment.serverUri + this.PROFILE_SVC_NAME + '/orders');
    };
    uploadFile(file: File): Observable<string> {
        return new Observable<string>(e => {
            const formData: FormData = new FormData();
            formData.append('file', file, file.name);
            this._httpClient.post<void>(environment.serverUri + this.FILE_UPLOAD_SVC_NAME + '/files', formData, { observe: 'response' }).subscribe(next => {
                e.next(next.headers.get('location'));
            });
        })
    };
    getProducts(category: string, pageNum: number, pageSize: number): Observable<IProductSimple[]> {
        return this._httpClient.get<IProductSimple[]>(environment.serverUri + this.PRODUCT_SVC_NAME + '/categories/' + category + '?pageNum=' + pageNum + '&pageSize=' + pageSize);
    };
    getProductDetail(id: number): Observable<IProductDetail> {
        return this._httpClient.get<IProductDetail>(environment.serverUri + this.PRODUCT_SVC_NAME + '/productDetails/' + id);
    };
    createProduct(productDetail: IProductDetail): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + this.PRODUCT_SVC_NAME + '/productDetails', productDetail).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteProduct(productDetail: IProductDetail): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + this.PRODUCT_SVC_NAME + '/productDetails/' + productDetail.id).subscribe(next => {
                e.next(true)
            });
        });
    };
    updateProduct(productDetail: IProductDetail): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + this.PRODUCT_SVC_NAME + '/productDetails/' + productDetail.id, productDetail).subscribe(next => {
                e.next(true)
            });
        });
    };
    batchUpdateSecurityProfile(securitypProfile: { [key: string]: string }): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.patch(environment.serverUri + '/proxy/security/profile/batch/url', securitypProfile).subscribe(next => {
                e.next(true)
            });
        });
    };
    forgetPwd(fg: FormGroup): Observable<any> {
        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(false) }).pipe(switchMap(token => this._forgetPwd(this._getToken(token), fg)))
    };
    resetPwd(fg: FormGroup): Observable<any> {
        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(false) }).pipe(switchMap(token => this._resetPwd(this._getToken(token), fg)))
    };
    activate(fg: FormGroup): Observable<any> {
        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(false) }).pipe(switchMap(token => this._getActivationCode(this._getToken(token), fg)))
    };
    getCategories(): Observable<ICategory[]> {
        return this._httpClient.get<ICategory[]>(environment.serverUri + this.PRODUCT_SVC_NAME + '/categories');
    };
    createCategory(category: ICategory): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + this.PRODUCT_SVC_NAME + '/categories', category).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteCategory(category: ICategory): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + this.PRODUCT_SVC_NAME + '/categories/' + category.id).subscribe(next => {
                e.next(true)
            });
        });

    };
    updateCategory(category: ICategory): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + this.PRODUCT_SVC_NAME + '/categories/' + category.id, category).subscribe(next => {
                e.next(true)
            });
        });
    };
    autoApprove(clientId: string): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.get<IAutoApprove>(environment.serverUri + this.AUTH_SVC_NAME + '/clients/autoApprove?clientId=' + clientId).subscribe(next => {
                if (next.autoApprove)
                    e.next(true)
                e.next(false)
            });
        });
    };
    createSecurityProfile(securitypProfile: ISecurityProfile): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + '/proxy/security/profile', securitypProfile).subscribe(next => {
                e.next(true)
            });
        });

    };
    updateSecurityProfile(securitypProfile: ISecurityProfile): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + '/proxy/security/profile/' + securitypProfile.id, securitypProfile).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteSecurityProfile(securitypProfile: ISecurityProfile): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + '/proxy/security/profile/' + securitypProfile.id).subscribe(next => {
                e.next(true)
            });
        });

    };
    getSecurityProfiles(): Observable<ISecurityProfile[]> {
        return this._httpClient.get<ISecurityProfile[]>(environment.serverUri + '/proxy/security/profiles');
    };
    revokeResourceOwnerToken(resourceOwnerName: string): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post<any>(environment.serverUri + '/proxy/blacklist/resourceOwner', { "name": resourceOwnerName }).subscribe(next => {
                e.next(true)
            });
        });
    }
    revokeClientToken(clientId: string): Observable<boolean> {
        // const formData = new FormData();
        // formData.append('name', clientId);
        return new Observable<boolean>(e => {
            this._httpClient.post<any>(environment.serverUri + '/proxy/blacklist/client', { "name": clientId }).subscribe(next => {
                e.next(true)
            });
        });
    }
    authorize(authorizeParty: IAuthorizeParty): Observable<IAuthorizeCode> {
        const formData = new FormData();
        formData.append('response_type', authorizeParty.response_type);
        formData.append('client_id', authorizeParty.client_id);
        formData.append('state', authorizeParty.state);
        formData.append('redirect_uri', authorizeParty.redirect_uri);
        return this._httpClient.post<IAuthorizeCode>(environment.serverUri + this.AUTH_SVC_NAME + '/authorize', formData);
    };
    updateResourceOwnerPwd(resourceOwner: IResourceOwnerUpdatePwd): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.patch<IResourceOwnerUpdatePwd>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwner/pwd', resourceOwner).subscribe(next => {
                e.next(true)
            });
        });
    };
    updateResourceOwner(resourceOwner: IResourceOwner): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put<IResourceOwner>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners/' + resourceOwner.id, resourceOwner).subscribe(next => {
                e.next(true)
            });
        });

    };
    deleteResourceOwner(resourceOwner: IResourceOwner): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete<IResourceOwner>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners/' + resourceOwner.id).subscribe(next => {
                e.next(true)
            });
        });
    };
    createClient(client: IClient): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.post(environment.serverUri + this.AUTH_SVC_NAME + '/clients', client).subscribe(next => {
                e.next(true)
            });
        });
    };
    updateClient(client: IClient): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.put(environment.serverUri + this.AUTH_SVC_NAME + '/clients/' + client.id, client).subscribe(next => {
                e.next(true)
            });
        });
    };
    deleteClient(client: IClient): Observable<boolean> {
        return new Observable<boolean>(e => {
            this._httpClient.delete(environment.serverUri + this.AUTH_SVC_NAME + '/clients/' + client.id).subscribe(next => {
                e.next(true)
            });
        });
    };
    getResourceOwners(): Observable<IResourceOwner[]> {
        return this._httpClient.get<IResourceOwner[]>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners');
    };
    getClients(): Observable<IClient[]> {
        return this._httpClient.get<IClient[]>(environment.serverUri + this.AUTH_SVC_NAME + '/clients');
    };
    refreshToken(): Observable<ITokenResponse> {
        const formData = new FormData();
        formData.append('grant_type', 'refresh_token');
        formData.append('refresh_token', this.currentUserAuthInfo.refresh_token);
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(true) })
    }
    login(loginFG: FormGroup): Observable<ITokenResponse> {
        const formData = new FormData();
        formData.append('grant_type', 'password');
        formData.append('username', loginFG.get('email').value);
        formData.append('password', loginFG.get('pwd').value);
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(true) });
    }
    register(registerFG: FormGroup): Observable<any> {
        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        return this._httpClient.post<ITokenResponse>(environment.tokenUrl, formData, { headers: this._getAuthHeader(false) }).pipe(switchMap(token => this._createUser(this._getToken(token), registerFG)))
    }
    private _getAuthHeader(islogin: boolean, token?: string): HttpHeaders {
        return islogin ? new HttpHeaders().append('Authorization',
            'Basic ' + btoa(environment.loginClientId + ':' + environment.clientSecret)) :
            token ? new HttpHeaders().append('Authorization', 'Bearer ' + token) :
                new HttpHeaders().append('Authorization', 'Basic ' + btoa(environment.registerClientId + ':' + environment.clientSecret));
    }
    private _getToken(res: ITokenResponse): string {
        return res.access_token;
    }
    private _createUser(token: string, registerFG: FormGroup): Observable<any> {
        return this._httpClient.post<any>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners', this._getRegPayload(registerFG), { headers: this._getAuthHeader(false, token) })
    }
    private _getActivationCode(token: string, registerFG: FormGroup): Observable<any> {
        return this._httpClient.post<any>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners/register', this._getActivatePayload(registerFG), { headers: this._getAuthHeader(false, token) })
    }
    private _resetPwd(token: string, registerFG: FormGroup): Observable<any> {
        return this._httpClient.post<any>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners/resetPwd', this._getResetPayload(registerFG), { headers: this._getAuthHeader(false, token) })
    }
    private _forgetPwd(token: string, registerFG: FormGroup): Observable<any> {
        return this._httpClient.post<any>(environment.serverUri + this.AUTH_SVC_NAME + '/resourceOwners/forgetPwd', this._getForgetPayload(registerFG), { headers: this._getAuthHeader(false, token) })
    }
    private _getRegPayload(fg: FormGroup): IPendingResourceOwner {
        return {
            email: fg.get('email').value,
            password: fg.get('pwd').value,
            activationCode: fg.get('activationCode').value,
        };
    }
    private _getActivatePayload(fg: FormGroup): IPendingResourceOwner {
        return {
            email: fg.get('email').value,
        };
    }
    private _getForgetPayload(fg: FormGroup): IForgetPasswordRequest {
        return {
            email: fg.get('email').value,
        };
    }
    private _getResetPayload(fg: FormGroup): IForgetPasswordRequest {
        return {
            email: fg.get('email').value,
            token: fg.get('token').value,
            newPassword: fg.get('pwd').value,
        };
    }
}