import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogRef, ModalComponent, SystelabModalContext } from 'systelab-components/widgets/modal';
import { ProjectsService } from '../../jama/api/projects.service';
import { map, catchError } from 'rxjs/internal/operators';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';

export class LoginDialogParameters extends SystelabModalContext {
	public width = 450;
	public height = 250;
	public username = '';
	public password = '';
	public server = '';
}

@Component({
	selector:    'login-dialog',
	templateUrl: 'login-dialog.component.html',
})
export class LoginDialog implements ModalComponent<LoginDialogParameters> {
	public parameters: LoginDialogParameters;
	private isLogged: boolean;
	public isLoading = false;

	constructor(public dialog: DialogRef<LoginDialogParameters>, private api: ProjectsService, private toastr: ToastrService) {
		this.parameters = dialog.context;
		this.isLogged = !!(this.parameters.username && this.parameters.password);
	}

	public static getParameters(): LoginDialogParameters {
		return new LoginDialogParameters();
	}

	public close(): void {
		if (document.body.classList.contains('modal-open')) {
			document.body.classList.remove('modal-open');
		}
		this.dialog.close({
			isLogged: this.isLogged,
			username: this.isLogged ? this.parameters.username : '',
			password: this.isLogged ? this.parameters.password : '',
			server:   this.parameters.server
		});
	}

	public doGo() {
		this.isLoading = true;
		if (document.body.classList.contains('modal-open')) {
			document.body.classList.remove('modal-open');
		}

		this.checkConnection().subscribe(() => {
			this.dialog.close({
				isLogged: true,
				username: this.parameters.username,
				password: this.parameters.password,
				server:   this.parameters.server
			});
		},
		() => this.isLogged = false
		).add(() => this.isLoading = false);
	}

	private checkConnection() {
		this.api.configuration.username = this.parameters.username;
		this.api.configuration.password = this.parameters.password;
		this.api.configuration.basePath = this.parameters.server;

		return this.api.getProjects(0, 20)
			.pipe(
				catchError(this.handleError.bind(this))
			);
	}

	private handleError(error: HttpErrorResponse) {
		if (error.status === 0) {
			// A client-side or network error occurred. Handle it accordingly.
			this.toastr.error('Network error occurred:');
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong.
			this.toastr.error(
				`Jama returned code ${error.status}${error.status === 401 ? ' - wrong username or password' : ''}`);
		}
		// Return an observable with a user-facing error message.
		return throwError(
			'Something bad happened; please try again later.');
	}
}
