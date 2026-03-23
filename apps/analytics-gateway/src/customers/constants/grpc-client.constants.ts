import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';

export interface CustomerGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;
}
