import { BasicFetchResult } from '../base';
export interface AwardModel {
    id: string;
    name: string;
    image: string;
    people: string;
    add_time: string;
}
export type AwardResultModel = BasicFetchResult<AwardModel>;
