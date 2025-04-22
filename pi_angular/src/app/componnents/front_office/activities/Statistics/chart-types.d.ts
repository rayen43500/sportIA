declare module 'chart.js' {
  import { Chart, ChartType, ChartData, ChartOptions } from 'chart.js';
  
  export interface ChartConfiguration {
    type: ChartType;
    data: ChartData;
    options?: ChartOptions;
  }
} 