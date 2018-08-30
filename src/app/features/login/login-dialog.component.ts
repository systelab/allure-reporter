import { Component } from '@angular/core';
import { DialogRef, ModalComponent, SystelabModalContext } from 'systelab-components/widgets/modal';

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

	constructor(public dialog: DialogRef<LoginDialogParameters>) {
		this.parameters = dialog.context;
	}

	public static getParameters(): LoginDialogParameters {
		return new LoginDialogParameters();
	}

	public close(): void {
		this.dialog.close(null);
	}

	public doGo() {
		this.dialog.close({
			username: this.parameters.username,
			password: this.parameters.password,
			server:   this.parameters.server
		});
	}
}
