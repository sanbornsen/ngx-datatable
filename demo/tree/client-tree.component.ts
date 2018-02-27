import { Component } from '@angular/core';

@Component({
  selector: 'client-side-tree-demo',
  template: `
    <div>
      <h3>
        Flex Column Width Distribution
        <small>
          <a href="https://github.com/swimlane/ngx-datatable/blob/master/demo/columns/column-flex.component.ts"
            target="_blank">
            Source
          </a>
        </small>
      </h3>
      <ngx-datatable
        [rowDraggable]="true"
        (rowDrop)="onRowDrop($event)"
        (rowDrag)="onRowDrag($event)"
        [rowDragHandle]="'.handleDrag'"
        [rowExternalDrag]="'dragScope'"
        class="material"
        [columnMode]="'flex'"
        [headerHeight]="50"
        [footerHeight]="50"
        [rowHeight]="'auto'"
        [treeFromRelation]="'manager'"
        [treeToRelation]="'name'"
        [rows]="rows"
        (treeAction)="onTreeAction($event)">
        <ngx-datatable-column
              [width]="50"
              [resizeable]="false"
              [sortable]="false"
              [cellClass]="'cell-class'"
              [frozenLeft]="false">
              <ng-template let-row="row" let-expanded="expanded" ngx-datatable-cell-template>
                <i class="handleDrag icon datatable-icon-collapse" style="cursor: pointer;"></i>
              </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Id" [flexGrow]="1">
          <ng-template let-row="row" let-value="value" ngx-datatable-cell-template>
            {{value}}
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Name" [flexGrow]="3" [isTreeColumn]="true">
          <ng-template let-value="value" ngx-datatable-cell-template>
            {{value}}
          </ng-template>
          <ng-template ngx-datatable-tree-icon let-tree="treeStatus">
            <i *ngIf="tree==='loading'"
              class="icon datatable-icon-collapse"></i>
            <i *ngIf="tree==='collapsed'"
              class="icon datatable-icon-up"></i>
            <i *ngIf="tree==='expanded'"
              class="icon datatable-icon-down"></i>
            <i *ngIf="tree==='disabled'"
              class="disabled icon datatable-icon-down"></i>
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Gender" [flexGrow]="1">
          <ng-template let-row="row" let-value="value" ngx-datatable-cell-template>
            {{value}}
          </ng-template>
        </ngx-datatable-column>
        <ngx-datatable-column name="Age" [flexGrow]="1">
          <ng-template let-value="value" ngx-datatable-cell-template>
            {{value}}
          </ng-template>
        </ngx-datatable-column>
      </ngx-datatable>

      <div style="height:200px; width: 300px; border: 1px solid; float: left"
         droppable [dropScope]="'a'" (onDrop)="outDrop($event, 'a')">
         <h4 style="border: 1px solid;">a</h4>
         <p *ngFor="let row of aExtraRows">{{ row.name }}</p>

      </div>
      <div style="height:200px; width: 300px; border: 1px solid; float: left"
         droppable [dropScope]="'b'" (onDrop)="outDrop($event, 'b')">
         <h4 style="border: 1px solid;">b</h4>
         <p *ngFor="let row of bExtraRows">{{ row.name }}</p>

      </div>
      <div style="height:200px; width: 300px; border: 1px solid; float: left"
         droppable [dropScope]="'c'" (onDrop)="outDrop($event, 'c')">
         <h4 style="border: 1px solid;">c</h4>
         <p *ngFor="let row of cExtraRows">{{ row.name }}</p>

      </div>
    </div>
  `,
  styles: [
    '.icon {height: 10px; width: 10px; }',
    '.disabled {opacity: 0.5; }'
  ],

})
export class ClientTreeComponent {

  rows = [];
  rowExternalDrag = 'item';
  aExtraRows = [];
  bExtraRows = [];
  cExtraRows = [];
  restrictRowDrop = true;

  constructor() {
    this.fetch((data) => {
      this.rows = data;
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company_tree.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (this.rows[index].treeStatus === 'collapsed') {
      this.rows[index].treeStatus = 'expanded';
    } else {
      this.rows[index].treeStatus = 'collapsed';
    }
    this.rows = [...this.rows];
  }

  onRowDrop(event) {
    console.log(event);
    const srcelement = this.rows.filter((item) => {
      return item.name === event.src.name;
    });
    this.rows = this.rows.filter((item) => {
      return item.name !== event.src.name;
    });
    const targetindex = this.rows.findIndex((item) => {
      return item.name === event.target.name;
    });
    this.rows = [
      ...this.rows.slice(0, targetindex + 1),
      ...srcelement,
      ...this.rows.slice(targetindex + 1)
    ];
  }

  onRowDrag(event) {
    console.log(event);
  }

  outDrop(event, str) {
    const srcelement = this.rows.filter((item) => {
      return item.name === event.dragData.name;
    });
    this.rows = this.rows.filter((item) => {
      return item.name !== event.dragData.name;
    });
    if (str === 'a') {
      this.aExtraRows = [...this.aExtraRows, ...srcelement];
    }
    if (str === 'b') {
      this.bExtraRows = [...this.bExtraRows, ...srcelement];
    }
    if (str === 'c') {
      this.cExtraRows = [...this.cExtraRows, ...srcelement];
    }
  }

}
