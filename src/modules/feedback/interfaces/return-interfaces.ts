export abstract class FindAllReturn {
  statusCode: number;
  method: string;
  message: string;
  data: [{ count: number }, allPosts: any];
  path: string;
  timestamp: number;
}

export abstract class FindOneReturn {
  statusCode: number;
  method: string;
  message: string;
  data: any;
  path: string;
  timestamp: number;
}

export abstract class CreateReturn {
  statusCode: number;
  method: string;
  message: string;
  data: any;
  path: string;
  timestamp: number;
}

export abstract class UpdateReturn {
  statusCode: number;
  method: string;
  message: string;
  data: any;
  path: string;
  timestamp: number;
}

export abstract class DeleteReturn {
  statusCode: number;
  method: string;
  message: string;
  path: string;
  timestamp: number;
}
