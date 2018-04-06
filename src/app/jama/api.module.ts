import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { Configuration } from './configuration';

import { AbstractitemsService } from './api/abstractitems.service';
import { ActivitiesService } from './api/activities.service';
import { AttachmentsService } from './api/attachments.service';
import { BaselinesService } from './api/baselines.service';
import { CommentsService } from './api/comments.service';
import { FilesService } from './api/files.service';
import { FiltersService } from './api/filters.service';
import { ItemsService } from './api/items.service';
import { ItemtypesService } from './api/itemtypes.service';
import { PicklistoptionsService } from './api/picklistoptions.service';
import { PicklistsService } from './api/picklists.service';
import { ProjectsService } from './api/projects.service';
import { RelationshipsService } from './api/relationships.service';
import { RelationshiptypesService } from './api/relationshiptypes.service';
import { ReleasesService } from './api/releases.service';
import { SystemService } from './api/system.service';
import { TagsService } from './api/tags.service';
import { TestcyclesService } from './api/testcycles.service';
import { TestplansService } from './api/testplans.service';
import { TestrunsService } from './api/testruns.service';
import { UsergroupsService } from './api/usergroups.service';
import { UsersService } from './api/users.service';

@NgModule({
	imports:      [CommonModule, HttpModule],
	declarations: [],
	exports:      [],
	providers:    [AbstractitemsService, ActivitiesService, AttachmentsService, BaselinesService, CommentsService, FilesService, FiltersService, ItemsService, ItemtypesService, PicklistoptionsService, PicklistsService, ProjectsService, RelationshipsService, RelationshiptypesService, ReleasesService, SystemService, TagsService, TestcyclesService, TestplansService, TestrunsService, UsergroupsService, UsersService]
})
export class ApiModule {
	public static forConfig(configurationFactory: () => Configuration): ModuleWithProviders {
		return {
			ngModule:  ApiModule,
			providers: [{provide: Configuration, useFactory: configurationFactory}]
		}
	}
}
