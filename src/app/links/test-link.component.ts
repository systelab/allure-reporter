import { Component, Input } from '@angular/core';
import { Link } from '../model/model';

@Component({
	selector:    'test-link',
	templateUrl: 'test-link.component.html'
})
export class TestLinkComponent {

	@Input() link: Link;

}
