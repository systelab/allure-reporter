import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector:    'app-login',
	templateUrl: 'login.component.html'
})
export class LoginComponent {

	private _username = '';
	private _password = '';
	private _server = '';

	@Input()
	public get username(): string {
		return this._username;
	}

	public set username(value: string) {
		this._username = value;
		this.usernameChange.emit(this._username);
	}

	@Input()
	public get password(): string {
		return this._password;
	}

	public set password(value: string) {
		this._password = value;
		this.passwordChange.emit(this._password);
	}

	@Input()
	public get server(): string {
		return this._server;
	}

	public set server(value: string) {
		this._server = value;
		this.serverChange.emit(this._server);
	}

	@Output() public usernameChange = new EventEmitter<string>();
	@Output() public passwordChange = new EventEmitter<string>();
	@Output() public serverChange = new EventEmitter<string>();

	@Output() public close = new EventEmitter();


	public doClose() {
		this.close.emit();
	}
}
