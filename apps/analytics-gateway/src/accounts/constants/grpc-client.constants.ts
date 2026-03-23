import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';

export interface AccountGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;
}
