import { Injectable } from '@nestjs/common';

@Injectable()
export class DecisionEngineService {

  computeFairness(allocated: number, capacity: number) {
    const utilization = capacity ? allocated / capacity : 0;

    let fairness = capacity ? (capacity - allocated) / capacity : 0;

    if (utilization > 1) fairness -= 1;
    if (utilization > 0.8) fairness -= 0.3;
    if (utilization < 0.3) fairness += 0.4;

    return fairness;
  }

  computePerformance(perfRecords: any[]) {
    if (!perfRecords.length) return 0.6;

    const avgDelivery =
      perfRecords.reduce((a, b) => a + b.delivery_score, 0) /
      perfRecords.length;

    const avgQuality =
      perfRecords.reduce((a, b) => a + b.quality_score, 0) /
      perfRecords.length;

    return (avgDelivery + avgQuality) / 2;
  }

  computeFinalScore(
    fairness: number,
    performance: number,
    skillWeight: number = 0.1,
  ) {
    return fairness * 0.5 + performance * 0.4 + skillWeight;
  }
}