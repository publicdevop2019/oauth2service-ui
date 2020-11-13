import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { mockAttrs } from 'src/app/mocks/mock-attributes';
import { mockCatalogAdmin } from 'src/app/mocks/mock-catalog-admin';
import { mockCatalogCustomer } from 'src/app/mocks/mock-catalog-customer';
import { mockClient } from 'src/app/mocks/mock-clients';
import { mockFilter } from 'src/app/mocks/mock-filter';
import { mockFilters } from 'src/app/mocks/mock-filters';
import { mockOrders } from 'src/app/mocks/mock-orders';
import { mockProductDetails } from 'src/app/mocks/mock-product';
import { mockProducts } from 'src/app/mocks/mock-products';
import { mockSP1 } from 'src/app/mocks/mock-endpoint';
import { environment } from 'src/environments/environment';
import { IAuthorizeCode } from '../clazz/validation/interfaze-common';
import { mockCatalog } from 'src/app/mocks/mock-catalog';
import { mockAttr } from 'src/app/mocks/mock-attribute';
import { mockClient1 } from 'src/app/mocks/mock-client';
import { mockSP } from 'src/app/mocks/mock-endpoints';
import { mockResourceO } from 'src/app/mocks/mock-users';
import { mockResource1 } from 'src/app/mocks/mock-user';
import { mockChanges } from 'src/app/mocks/mock-changes';
import { mockBizClientOpt } from 'src/app/mocks/mock-biz-client-opt';
import { mockBizUserOpt } from 'src/app/mocks/mock-biz-user-opt';
import { mockBizEndpointOpt } from 'src/app/mocks/mock-biz-ep-opt';
import { mockRevokeTokenOpt } from 'src/app/mocks/mock-revoke-token-opt';
import { mockProductOpt } from 'src/app/mocks/mock-product-opt';
import { mockBizCatalogOpt } from 'src/app/mocks/mock-biz-catalog-opt';
import { mockBizAttributeOpt } from 'src/app/mocks/mock-biz-attribute-opt';
import { mockBizFilterOpt } from 'src/app/mocks/mock-biz-filter-opt';
import { mockRevokeTokens } from 'src/app/mocks/mock-revoke-tokens';
import { mockSku } from 'src/app/mocks/mock-sku';
import { mockBizSkuOpt } from 'src/app/mocks/mock-biz-sku-opt';
import { mockBizTask } from 'src/app/mocks/mock-biz-task';
import { mockOrder } from 'src/app/mocks/mock-order';
import { mockProductsSearch } from 'src/app/mocks/mock-products-search';
import { mockAttrsSearch } from 'src/app/mocks/mock-attributes-search';
import { mockResourceSearch } from 'src/app/mocks/mock-users-search';
import { mockBizOrderOpt } from 'src/app/mocks/mock-biz-order-opt';
/**
 * use refresh token if call failed
 */
@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  private DEFAULT_DELAY = 1000;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (environment.mode === 'offline') {
      if (['delete', 'put', 'post', 'patch'].includes(req.method.toLowerCase())) {
        console.dir('[DEV ONLY] request body')
        console.dir(req.body)
        if (req.url.includes('/authorize'))
          return of(new HttpResponse({ status: 200, body: { authorize_code: 'dummyCode' } as IAuthorizeCode })).pipe(delay(this.DEFAULT_DELAY))
        if (req.url.includes('/oauth/token')) {
          const mockedToken = {
            access_token: 'mockTokenString',
            refresh_token: 'mockTokenString2'
          };
          return of(new HttpResponse({ status: 200, body: mockedToken })).pipe(delay(this.DEFAULT_DELAY));
        }
        if (req.url.includes('/file')) {
          let header = new HttpHeaders();
          header = header.set('location', 'https://img.alicdn.com/imgextra/i3/3191337305/O1CN01X11Ad123pjrtuTsDT_!!3191337305-0-lubanu-s.jpg_430x430q90.jpg')
          return of(new HttpResponse({ status: 200, headers: header })).pipe(delay(this.DEFAULT_DELAY));
        }
        return of(new HttpResponse({ status: 200 })).pipe(delay(this.DEFAULT_DELAY));
      }
      if (['get'].includes(req.method.toLowerCase())) {
        if (req.url.includes('changes/root?query=entityType:BizClient')) {
          return of(new HttpResponse({ status: 200, body: mockBizClientOpt })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('event-svc/events/admin')) {
          return of(new HttpResponse({ status: 200, body: null })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('changes/root?query=entityType:BizUser')) {
          return of(new HttpResponse({ status: 200, body: mockBizUserOpt })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('changes/root?query=entityType:BizEndpoint')) {
          return of(new HttpResponse({ status: 200, body: mockBizEndpointOpt })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('changes/root?query=entityType:RevokeToken')) {
          return of(new HttpResponse({ status: 200, body: mockRevokeTokenOpt })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('changes/root?query=entityType:Product')) {
          return of(new HttpResponse({ status: 200, body: mockProductOpt })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('changes/root?query=entityType:BizCatalog')) {
          return of(new HttpResponse({ status: 200, body: mockBizCatalogOpt })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('changes/root?query=entityType:BizAttribute')) {
          return of(new HttpResponse({ status: 200, body: mockBizAttributeOpt })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('changes/root?query=entityType:BizFilter')) {
          return of(new HttpResponse({ status: 200, body: mockBizFilterOpt })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('changes/root?query=entityType:BizSku')) {
          return of(new HttpResponse({ status: 200, body: mockBizSkuOpt })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('changes/root?query=entityType:BizOrder')) {
          return of(new HttpResponse({ status: 200, body: mockBizOrderOpt })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('revoke-tokens/root')) {
          return of(new HttpResponse({ status: 200, body: mockRevokeTokens })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('tasks/admin')) {
          return of(new HttpResponse({ status: 200, body: mockBizTask })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('attributes/admin/')) {
          return of(new HttpResponse({ status: 200, body: mockAttr })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('attributes/admin?query=id:')) {
          return of(new HttpResponse({ status: 200, body: mockAttrsSearch })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('attributes/admin')) {
          return of(new HttpResponse({ status: 200, body: mockAttrs })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/products/admin/')) {
          return of(new HttpResponse({ status: 200, body: mockProductDetails })).pipe(delay(this.DEFAULT_DELAY))
          // return of(new HttpResponse({ status: 200, body: mockProductDetail })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/changes/admin')) {
          return of(new HttpResponse({ status: 200, body: mockChanges })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('products/admin?query=id:')) {
          return of(new HttpResponse({ status: 200, body: mockProductsSearch })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('products/admin')) {
          return of(new HttpResponse({ status: 200, body: mockProducts })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/catalogs/admin?query=type:FRONTEND')) {
          return of(new HttpResponse({ status: 200, body: mockCatalogCustomer })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/catalogs/admin?query=type:BACKEND')) {
          return of(new HttpResponse({ status: 200, body: mockCatalogAdmin })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/catalogs/admin/')) {
          return of(new HttpResponse({ status: 200, body: mockCatalog })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/catalogs/')) {
          return of(new HttpResponse({ status: 200, body: mockProducts })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/proxy/endpoints/root/')) {
          return of(new HttpResponse({ status: 200, body: mockSP1 })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('/proxy/endpoints/root')) {
          return of(new HttpResponse({ status: 200, body: mockSP })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('clients/root/')) {
          return of(new HttpResponse({ status: 200, body: mockClient1 })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('clients/root')) {
          return of(new HttpResponse({ status: 200, body: mockClient })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('users/admin/')) {
          return of(new HttpResponse({ status: 200, body: mockResource1 })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('users/admin?query=id:')) {
          return of(new HttpResponse({ status: 200, body: mockResourceSearch })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('users/admin')) {
          return of(new HttpResponse({ status: 200, body: mockResourceO })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('orders/admin/')) {
          return of(new HttpResponse({ status: 200, body: JSON.parse(JSON.stringify(mockOrder)) })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('orders/admin')) {
          return of(new HttpResponse({ status: 200, body: mockOrders })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('filters/admin/')) {
          return of(new HttpResponse({ status: 200, body: mockFilter })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('filters/admin')) {
          return of(new HttpResponse({ status: 200, body: mockFilters })).pipe(delay(this.DEFAULT_DELAY))
        }
        if (req.url.includes('skus/admin')) {
          return of(new HttpResponse({ status: 200, body: mockSku })).pipe(delay(this.DEFAULT_DELAY))
        }
      }
    }
    return next.handle(req);
  }
}