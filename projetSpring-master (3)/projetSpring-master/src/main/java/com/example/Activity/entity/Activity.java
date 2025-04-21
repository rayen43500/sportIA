package com.example.Activity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;


@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)// Auto-increment
     Long actId;

     String title;
     Date ActivityDate;
     Integer reputation;
     Integer duration;

    @OneToOne(cascade = CascadeType.ALL)
    private ActivityType activityType;

}

