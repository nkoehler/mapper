import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-location-dialog',
  templateUrl: './edit-location-dialog.component.html',
  styleUrls: ['./edit-location-dialog.component.scss']
})
export class EditLocationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditLocationDialogComponent, string>,
    @Inject(MAT_DIALOG_DATA) public name: string
  ) {
  }

}
