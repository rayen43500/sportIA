package com.example.Activity.Repository;

import com.example.Activity.entity.Activity;
import com.example.Activity.entity.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityTypeRepository extends JpaRepository<ActivityType,Long> {
}
