import { Activity } from "./activity.model";

export interface ActivityType {
     actTypeId: number;
     title: string;
     description?: string;
     Type:  String;
     BodyPart:  String;
     Equipment:  String;
     Level:  String;
     Rating: number;
     RatingDesc:  String;
     activity: Activity

}