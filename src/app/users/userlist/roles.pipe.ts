import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'roleFind'
})
export class RolesPipe implements PipeTransform {

    transform(items: string[], field: string): string {

        if (!items) { return null; }
        if (!field) { return null; }

        return  items.find(o => o === field) ? 'ADMIN' : 'USER';
    }
}
