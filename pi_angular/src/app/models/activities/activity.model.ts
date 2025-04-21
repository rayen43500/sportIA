import { ActivityType } from './activityType.model';

export interface Activity {
    actId:number;
     title:string;
     ActivityDate:Date;
     reputation:number ;
     duration: number;
  activityType:  ActivityType;

}