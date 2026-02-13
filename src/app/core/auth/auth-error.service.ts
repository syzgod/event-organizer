import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthErrorMessages {
  network: string;
  byStatus?: Record<number, string>;
  fallback: string;
}

@Injectable({ providedIn: 'root' })
export class AuthErrorService {
  getMessage(error: unknown, messages: AuthErrorMessages): string {
    if (!(error instanceof HttpErrorResponse)) {
      return messages.fallback;
    }

    if (error.status === 0) {
      return messages.network;
    }

    const configuredStatusMessage = messages.byStatus?.[error.status];
    if (configuredStatusMessage) {
      return configuredStatusMessage;
    }

    const payloadMessage = this.extractPayloadMessage(error.error);
    return payloadMessage ?? messages.fallback;
  }

  private extractPayloadMessage(payload: unknown): string | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const errorPayload = payload as { message?: string | string[] };

    if (typeof errorPayload.message === 'string') {
      return errorPayload.message;
    }

    if (Array.isArray(errorPayload.message) && errorPayload.message.length > 0) {
      return errorPayload.message[0] ?? null;
    }

    return null;
  }
}
