export type Sprint = {
  _id: string;
  sprintId?: string;
  sprintName?: string;
  name: string;
  startDate: string;
  endDate: string;
  project: string;
  projectId?: string;
  goals: Array<string>;
  status?: string;

  // AI Planner fields
  summary?: string;
  aiSummary?: string;
  plannedBy?: string;
  assignmentStrategy?: string;
  aiConfidence?: number;
  predictedVelocity?: number;
  velocity?: number;
  sprintRiskScore?: number;
  totalEffort?: number;

  capacity?: {
    totalCapacityHours: number;
    memberCapacities: Array<{
      projectMemberId: string;
      effectiveHours: number;
    }>;
  };

  riskAnalysis?: {
    delayRiskPercent: number;
    overloadedMembers: string[];
    criticalDependencies: string[];
    deadlineThreats: string[];
  };

  recommendations?: string[];

  selectedTasks?: Array<{
    taskId: string;
    estimatedHours: number;
    assignedTo: string;
    reason: string;
    assignedMemberDetails?: {
      projectMemberId: string;
      name: string;
      role: string;
      reliabilityScore: number;
      effectiveCapacity: number;
      currentLoad: number;
      fairShareHours?: number;
      fairnessScore?: number;
      userId?: string | null;
      email?: string | null;
      avatar?: string | null;
    };
  }>;

  deferredTasks?: Array<{
    taskId: string;
    reason: string;
  }>;

  burndownForecast?: Array<{
    date: string;
    remainingHours: number;
  }>;

  memberWorkloadSummary?: Array<{
    memberId: string;
    taskCount: number;
    totalEstimatedHours: number;
    totalStoryPoints: number;
  }>;

  fairnessReport?: Array<{
    projectMemberId: string;
    fairnessScore: number;
    normalizedShare: number;
    fairShareHours: number;
    plannedHours: number;
    overloadFlag: boolean;
  }>;
};
