import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-location-dialog',
  templateUrl: './add-location-dialog.component.html',
  styleUrls: ['./add-location-dialog.component.scss']
})
export class AddLocationDialogComponent {

  title: string;

  constructor(
    public dialogRef: MatDialogRef<AddLocationDialogComponent, string>,
  ) { }

}
