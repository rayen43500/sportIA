package com.example.Activity.controller;

import com.example.Activity.entity.Activity;
import com.example.Activity.entity.ActivityType;
import com.example.Activity.service.ActivityService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Activity")
@AllArgsConstructor
public class ActivityControlleur {

    @Autowired
    ActivityService activityService;

    @GetMapping("/allType")
    public ResponseEntity<List<ActivityType>> getAllActivitiesType() {
        try {
            List<ActivityType> activities = activityService.getAllActivitiesType();
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();

        }
    }
    @PostMapping("/create/{activityTypeId}")
    public ResponseEntity<Activity> createActivity(@RequestBody Activity activity,
                                                   @PathVariable Long activityTypeId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(activityService.createActivity(activity, activityTypeId));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Activity>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.getActivityById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Activity> updateActivity(@PathVariable Long id,
                                                   @RequestBody Activity activityDetails) {
        return ResponseEntity.ok(activityService.updateActivity(id, activityDetails));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }
}
