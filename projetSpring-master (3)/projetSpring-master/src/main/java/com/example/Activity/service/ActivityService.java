package com.example.Activity.service;

import com.example.Activity.Repository.ActivityRepository;
import com.example.Activity.Repository.ActivityTypeRepository;
import com.example.Activity.entity.Activity;
import com.example.Activity.entity.ActivityType;
import com.opencsv.CSVReader;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

@Service
public class ActivityService {
@Autowired
private ActivityRepository activityRepository;
  @Autowired
  private ActivityTypeRepository activityTypeRepository;

  private static final String CSV_FILE = "megaGymDataset.csv";

  @PostConstruct
  public void loadCSVData() {
    System.out.println("⏳ Début du chargement des données CSV...");

    if (activityTypeRepository.count() == 0) {
      try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(CSV_FILE);
           BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
           CSVReader csvReader = new CSVReader(reader)) {

        // Sauter l'en-tête si présent
        csvReader.skip(1);

        int importedCount = 0;
        int skippedCount = 0;
        String[] values;

        while ((values = csvReader.readNext()) != null) {
          if (values.length < 9) {
            skippedCount++;
            continue;
          }

          ActivityType activityType = new ActivityType();
          activityType.setTitle(values[1]);
          activityType.setDescription(values[2]);
          activityType.setType(values[3]);
          activityType.setBodyPart(values[4]);
          activityType.setEquipment(values[5]);
          activityType.setLevel(values[6]);

          try {
            activityType.setRating(values[7].isEmpty() ? 0 : Integer.parseInt(values[7]));
          } catch (NumberFormatException e) {
            activityType.setRating(0);
          }

          activityType.setRatingDesc(values[8]);

          activityTypeRepository.save(activityType);
          importedCount++;
        }

        System.out.println("✅ Chargement CSV terminé :");
        System.out.println("   - Lignes importées : " + importedCount);
        System.out.println("   - Lignes ignorées : " + skippedCount);
        System.out.println("   - Total en base : " + activityTypeRepository.count());

      } catch (Exception e) {
        System.err.println("❌ Erreur lors du chargement du CSV : " + e.getMessage());
        e.printStackTrace();
      }
    } else {
      System.out.println("ℹ️ Base déjà peuplée (" + activityTypeRepository.count() + " activités)");
    }
  }

  public List<ActivityType> getAllActivitiesType() {
    return activityTypeRepository.findAll();
  }
  public Activity createActivity(Activity activity, Long activityTypeId) {
    ActivityType type = activityTypeRepository.findById(activityTypeId)
            .orElseThrow(() -> new RuntimeException("ActivityType not found"));
    activity.setActivityType(type);
    return activityRepository.save(activity);
  }

  public List<Activity> getAllActivities() {
    return activityRepository.findAll();
  }

  public Activity getActivityById(Long id) {
    return activityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Activity not found"));
  }

  public Activity updateActivity(Long id, Activity activityDetails) {
    Activity activity = getActivityById(id);
    activity.setTitle(activityDetails.getTitle());
    activity.setActivityDate(activityDetails.getActivityDate());
    activity.setReputation(activityDetails.getReputation());
    activity.setDuration(activityDetails.getDuration());
    return activityRepository.save(activity);
  }

  public void deleteActivity(Long id) {
    Activity activity = getActivityById(id);
    activityRepository.delete(activity);
  }
}

