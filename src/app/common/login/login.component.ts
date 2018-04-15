import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector:    'app-login',
	templateUrl: 'login.component.html'
})
export class LoginComponent {

	@Output() public close = new EventEmitter();

	public doClose() {
		this.close.emit();
	}
}
