import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormsModule, Validators,ReactiveFormsModule  } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Admin } from '../../models/admin.model';
import { CommonModule } from '@angular/common';

import {
  AvatarComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardGroupComponent,
  CardHeaderComponent,
  CardImgDirective,
  CardLinkDirective,
  CardSubtitleDirective,
  CardTextDirective,
  CardTitleDirective,
  ColComponent,
} from '@coreui/angular';
@Component({
  selector: 'app-gestionadmins',
  templateUrl: './gestionadmins.component.html',
  styleUrls: ['./gestionadmins.component.scss'],
  standalone: true,  // <-- Mark it as standalone
  imports: [ReactiveFormsModule, AvatarComponent,
    CardBodyComponent,
    CommonModule,
    FormsModule,
    CardComponent,
    CardFooterComponent,
    CardGroupComponent,
    CardHeaderComponent,
    CardImgDirective,
    CardLinkDirective,
    CardSubtitleDirective,
    CardTextDirective,
    CardTitleDirective,
    ColComponent,],  // <-- Import ReactiveFormsModule here

})
export class GestionadminsComponent implements OnInit {
  selectedAdminId: string | null = null; // Declare selectedAdminId
  admins: Admin[] = [];  // Array to store all admins
  adminForm!: FormGroup;  // Form for admin
  showForm = false;       // Control to show/hide the form
  isSubmitting = false;   // For form submission state
  searchName: string = '';
  searchRole: string = '';
  filteredAdmins: Admin[] = [];

  constructor(private adminService: AdminService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchAllAdmins();
    this.initAdminForm();
  }

  fetchAllAdmins(): void {
    this.adminService.getAllAdmins().subscribe({
      next: (data) => {
        this.admins = data;
        this.filteredAdmins = data; // Initialize filteredAdmins with all Admins
      },
      error: (error) => {
        console.error('Error fetching Admins', error);
      },
    });
  }

  initAdminForm(): void {
    // Initialize the form with form controls and validators
    this.adminForm = this.fb.group({
      username: ['', [Validators.required]],
      mdp: ['', [Validators.required]], // Password field
      role: ['', [Validators.required]], // 'superadmin' or 'admin'
    });
  }

  onSubmit(): void {
    if (this.adminForm.valid) {
      this.isSubmitting = true;
      const adminData = this.adminForm.value;

      if (this.selectedAdminId) {
        // If an admin is selected for editing, update it
        this.adminService.updateAdmin(this.selectedAdminId, adminData).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.fetchAllAdmins(); // Refresh the list after updating
            this.selectedAdminId = null; // Reset the selected admin ID
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error updating Admin', error);
          },
        });
      } else {
        // Otherwise, create a new admin
        this.adminService.addAdmin(adminData).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.showForm = false;
            this.fetchAllAdmins(); // Refresh the list after adding
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error adding Admin', error);
          },
        });
      }
    }
  }

  deleteAdmin(adminId: string): void {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.adminService.deleteAdmin(adminId).subscribe({
        next: () => {
          this.fetchAllAdmins(); // Refresh the list after deleting
        },
        error: (error) => {
          console.error('Error deleting Admin', error);
        },
      });
    }
  }

  editAdmin(admin: Admin): void {
    this.adminForm.patchValue({
      username: admin.username,
      role: admin.role,
      mdp: '', // Leave password empty when editing for security reasons
    });
    this.showForm = true; // Show the form for editing
    this.selectedAdminId = admin.id; // Store the ID of the selected admin for updating
  }

  filterAdmins(): void {
    this.filteredAdmins = this.admins.filter(
      (admin) =>
        admin.username.toLowerCase().includes(this.searchName.toLowerCase()) &&
        admin.role.toLowerCase().includes(this.searchRole.toLowerCase())
    );
  }
}
