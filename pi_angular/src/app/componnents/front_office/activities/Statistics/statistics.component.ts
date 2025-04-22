import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivityService } from 'src/app/services/activities/Activity.service';
import { Activity } from 'src/app/models/activities/activity.model';
import { ActivityType } from 'src/app/models/activities/activityType.model';
import { Chart, registerables, ChartType } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('activityTypeChart') activityTypeChartRef!: ElementRef;
  @ViewChild('durationChart') durationChartRef!: ElementRef;
  @ViewChild('reputationChart') reputationChartRef!: ElementRef;
  @ViewChild('monthlyActivityChart') monthlyActivityChartRef!: ElementRef;

  activities: Activity[] = [];
  activityTypes: ActivityType[] = [];
  isLoading: boolean = true;
  
  // Statistics data
  totalActivities: number = 0;
  averageReputation: number = 0;
  totalDuration: number = 0;
  averageDuration: number = 0;
  mostPopularType: string = '';
  
  // Charts
  activityTypeChart: Chart | undefined;
  durationChart: Chart | undefined;
  reputationChart: Chart | undefined;
  monthlyActivityChart: Chart | undefined;

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  ngAfterViewInit(): void {
    // Charts will be initialized after data is loaded
  }

  loadActivities(): void {
    this.isLoading = true;
    this.activityService.getAllActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.calculateStatistics();
        this.isLoading = false;
        
        // Initialize charts after data is loaded and DOM is ready
        setTimeout(() => {
          this.initializeCharts();
        }, 0);
      },
      error: (err) => {
        console.error('Error loading activities', err);
        this.isLoading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalActivities = this.activities.length;
    
    // Calculate average reputation
    const totalReputation = this.activities.reduce((sum, activity) => 
      sum + activity.reputation, 0);
    this.averageReputation = this.totalActivities > 0 
      ? parseFloat((totalReputation / this.totalActivities).toFixed(1)) 
      : 0;
    
    // Calculate total and average duration
    this.totalDuration = this.activities.reduce((sum, activity) => 
      sum + activity.duration, 0);
    this.averageDuration = this.totalActivities > 0 
      ? parseFloat((this.totalDuration / this.totalActivities).toFixed(1)) 
      : 0;
    
    // Find most popular activity type
    const typeCount: Record<string, number> = {};
    this.activities.forEach(activity => {
      const typeTitle = activity.activityType?.title || 'Inconnu';
      typeCount[typeTitle] = (typeCount[typeTitle] || 0) + 1;
    });
    
    let maxCount = 0;
    for (const [type, count] of Object.entries(typeCount)) {
      if (count > maxCount) {
        maxCount = count;
        this.mostPopularType = type;
      }
    }
  }

  initializeCharts(): void {
    this.createActivityTypeChart();
    this.createDurationDistributionChart();
    this.createReputationDistributionChart();
    this.createMonthlyActivityChart();
  }

  createActivityTypeChart(): void {
    if (!this.activityTypeChartRef) return;
    
    // Count activities by type
    const typeCount: Record<string, number> = {};
    this.activities.forEach(activity => {
      const typeTitle = activity.activityType?.title || 'Inconnu';
      typeCount[typeTitle] = (typeCount[typeTitle] || 0) + 1;
    });
    
    const labels = Object.keys(typeCount);
    const data = Object.values(typeCount);
    
    // Generate background colors
    const backgroundColors = this.generateColors(labels.length);
    
    // Create chart
    this.activityTypeChart = new Chart(this.activityTypeChartRef.nativeElement, {
      type: 'pie' as ChartType,
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: 'Répartition par Type d\'Activité',
            font: {
              size: 18
            }
          }
        }
      }
    });
  }

  createDurationDistributionChart(): void {
    if (!this.durationChartRef) return;
    
    // Group durations into ranges
    const durationRanges: Record<string, number> = {
      '0-30 min': 0,
      '30-60 min': 0,
      '1-2 heures': 0,
      '2+ heures': 0
    };
    
    this.activities.forEach(activity => {
      const duration = activity.duration;
      
      if (duration <= 30) {
        durationRanges['0-30 min']++;
      } else if (duration <= 60) {
        durationRanges['30-60 min']++;
      } else if (duration <= 120) {
        durationRanges['1-2 heures']++;
      } else {
        durationRanges['2+ heures']++;
      }
    });
    
    const labels = Object.keys(durationRanges);
    const data = Object.values(durationRanges);
    
    this.durationChart = new Chart(this.durationChartRef.nativeElement, {
      type: 'bar' as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre d\'activités',
          data: data,
          backgroundColor: '#6C63FF',
          borderColor: '#6C63FF',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Distribution des Durées d\'Activités',
            font: {
              size: 18
            }
          }
        }
      }
    });
  }

  createReputationDistributionChart(): void {
    if (!this.reputationChartRef) return;
    
    // Count activities by reputation
    const reputationCount: Record<string, number> = {
      '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0
    };
    
    this.activities.forEach(activity => {
      const reputation = activity.reputation.toString();
      reputationCount[reputation]++;
    });
    
    const labels = Object.keys(reputationCount);
    const data = Object.values(reputationCount);
    
    this.reputationChart = new Chart(this.reputationChartRef.nativeElement, {
      type: 'bar' as ChartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre d\'activités',
          data: data,
          backgroundColor: '#FFD54F',
          borderColor: '#FFD54F',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Distribution des Réputations',
            font: {
              size: 18
            }
          }
        }
      }
    });
  }

  createMonthlyActivityChart(): void {
    if (!this.monthlyActivityChartRef) return;
    
    // Create monthly distribution
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthlyCount = new Array(12).fill(0);
    
    this.activities.forEach(activity => {
      const date = new Date(activity.activityDate);
      const month = date.getMonth();
      monthlyCount[month]++;
    });
    
    this.monthlyActivityChart = new Chart(this.monthlyActivityChartRef.nativeElement, {
      type: 'line' as ChartType,
      data: {
        labels: months,
        datasets: [{
          label: 'Nombre d\'activités',
          data: monthlyCount,
          backgroundColor: 'rgba(108, 99, 255, 0.2)',
          borderColor: '#6C63FF',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Activités par Mois',
            font: {
              size: 18
            }
          }
        }
      }
    });
  }

  // Helper function to generate colors
  generateColors(count: number): string[] {
    const colors = [
      '#6C63FF', '#FF6584', '#FFD54F', '#4CAF50', '#2196F3', 
      '#9C27B0', '#FF9800', '#F44336', '#009688', '#3F51B5'
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    
    return result;
  }
} 