export interface DcLastStatusResponse {
  requestId: string;
  tasks: DcLastStatusTask[];
}

export interface DcLastStatusTask {
  taskId: string;
  status: DcLastStatusStatus;
}

export interface DcLastStatusStatus {
  attemptId: string;
  timestamp: string;
  status: string;
  description: string;
}
