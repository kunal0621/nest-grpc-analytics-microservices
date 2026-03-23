import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';

export interface TransactionGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;
}
