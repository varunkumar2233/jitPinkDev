import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { SharedRoutingModule } from './shared-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedRoutingModule,
  ],
  declarations: [
    PageLoaderComponent,
  ],
  exports: [
    PageLoaderComponent,
  ],
  entryComponents: [PageLoaderComponent],
  providers: [
  ],
 // entryComponents: [PageLoaderComponent],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
