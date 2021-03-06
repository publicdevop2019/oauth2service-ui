import { Observable, Subject } from 'rxjs';
import { IEditEvent } from '../components/editable-field/editable-field.component';
import { HttpProxyService } from '../services/http-proxy.service';
import { CustomHttpInterceptor } from '../services/interceptors/http.interceptor';
import { IEntityService, IEventAdminRep, IIdBasedEntity } from "./summary.component";
import { IEditListEvent } from '../components/editable-select-multi/editable-select-multi.component';
import { IEditBooleanEvent } from '../components/editable-boolean/editable-boolean.component';
import { IEditInputListEvent } from '../components/editable-input-multi/editable-input-multi.component';

export class EntityCommonService<C extends IIdBasedEntity, D> implements IEntityService<C, D>{
    httpProxySvc: HttpProxyService;
    refreshSummary: Subject<any> = new Subject();
    currentPageIndex: number = 0;
    entityRepo: string;
    role: string;
    supportEvent: boolean = false;
    interceptor: CustomHttpInterceptor
    constructor(httpProxySvc: HttpProxyService, interceptor: CustomHttpInterceptor) {
        this.httpProxySvc = httpProxySvc;
        this.interceptor = interceptor;
    }
    replaceEventStream(id: string, events: any[], changeId: string, version: number) {
        return this.httpProxySvc.replaceEventStream(id, events, changeId, version)
    };
    deleteEventStream(id: string, changeId: string) {
        return this.httpProxySvc.deleteEventStream(id, changeId)
    };
    readEventStreamById(id: string): Observable<IEventAdminRep> {
        return this.httpProxySvc.readEventStreamById(id)
    };
    saveEventStream(id: string, s: any[], changeId: string) {
        return this.httpProxySvc.saveEventStream(id, s, changeId)
    };
    readById(id: string) {
        return this.httpProxySvc.readEntityById<D>(this.entityRepo, this.role, id)
    };
    readEntityByQuery(num: number, size: number, query?: string, by?: string, order?: string,headers?:{}) {
        return this.httpProxySvc.readEntityByQuery<C>(this.entityRepo, this.role, num, size, query, by, order,headers)
    };
    deleteByQuery(query: string, changeId: string) {
        this.httpProxySvc.deleteEntityByQuery(this.entityRepo, this.role, query, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })
    };
    deleteById(id: string, changeId: string) {
        this.httpProxySvc.deleteEntityById(this.entityRepo, this.role, id, changeId).subscribe(next => {
            if (this.supportEvent) {
                this.deleteEventStream(id, changeId).subscribe(var0 => {
                    this.notify(!!var0)
                    this.refreshSummary.next();
                });
            } else {
                this.notify(!!next)
                this.refreshSummary.next();
            }
        })
    };
    create(s: D, changeId: string, events: any[]) {
        this.httpProxySvc.createEntity(this.entityRepo, this.role, s, changeId).subscribe(next => {
            if (this.supportEvent) {
                this.saveEventStream(next, events, changeId).subscribe(var0 => {
                    this.notify(!!var0)
                    this.refreshSummary.next();
                });
            } else {
                this.notify(!!next)
                this.refreshSummary.next();
            }
        });
    };
    update(id: string, s: D, changeId: string, events: any[], version: number) {
        if (this.supportEvent) {
            this.httpProxySvc.updateEntity(this.entityRepo, this.role, id, s, changeId).subscribe(next => {
                this.replaceEventStream(id, events, changeId, version).subscribe(var0 => {
                    this.notify(!!var0)
                    this.refreshSummary.next();
                });
            })
        } else {
            this.httpProxySvc.updateEntity(this.entityRepo, this.role, id, s, changeId).subscribe(next => {
                this.notify(!!next)
                this.refreshSummary.next();
            })
        }
    };
    patch(id: string, event: IEditEvent, changeId: string, fieldName: string) {
        this.httpProxySvc.patchEntityById(this.entityRepo, this.role, id, fieldName, event, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })
    };
    patchAtomicNum(id: string, event: IEditEvent, changeId: string, fieldName: string) {
        this.httpProxySvc.patchEntityAtomicById(this.entityRepo, this.role, id, fieldName, event, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })
    };
    patchList(id: string, event: IEditListEvent, changeId: string, fieldName: string) {
        this.httpProxySvc.patchEntityListById(this.entityRepo, this.role, id, fieldName, event, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })

    };
    patchMultiInput(id: string, event: IEditInputListEvent, changeId: string, fieldName: string) {
        this.httpProxySvc.patchEntityInputListById(this.entityRepo, this.role, id, fieldName, event, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })

    };
    patchBoolean(id: string, event: IEditBooleanEvent, changeId: string, fieldName: string) {
        this.httpProxySvc.patchEntityBooleanById(this.entityRepo, this.role, id, fieldName, event, changeId).subscribe(next => {
            this.notify(next)
            this.refreshSummary.next();
        })

    };
    notify(result: boolean) {
        result ? this.interceptor.openSnackbar('OPERATION_SUCCESS') : this.interceptor.openSnackbar('OPERATION_FAILED');
    }
}