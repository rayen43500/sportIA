package com.example.Activity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)// Auto-increment
    Long actTypeId;
    String Title;
    @Column(length = 2000) // Augmentez cette valeur selon vos besoins

    String description;
    String Type;
    String BodyPart;
    String Equipment;
    String Level;
    Integer Rating;
    String RatingDesc;

@JsonIgnore
    @OneToOne(mappedBy = "activityType", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Activity activity;



}
