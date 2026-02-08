// Mock data generators for SRE-0

export function generateMetrics(status: "Critical" | "Stable"): number[] {
    if (status === "Critical") {
        // Jagged, high-value latency spikes
        return [10, 25, 45, 78, 95, 120, 85, 150, 180, 220, 195, 250];
    }
    // Smooth, low-value stable metrics
    return [45, 42, 38, 35, 32, 28, 25, 22, 20, 18, 15, 12];
}

export function generateLogs(serviceName: string, includeErrors: boolean = true): string[] {
    const timestamp = () => {
        const now = new Date();
        return now.toISOString();
    };

    const baseLogs = [
        `${timestamp()} INFO [${serviceName}] Service started successfully`,
        `${timestamp()} INFO [${serviceName}] Health check passed`,
        `${timestamp()} DEBUG [${serviceName}] Processing incoming request`,
        `${timestamp()} INFO [${serviceName}] Database connection established`,
    ];

    if (includeErrors) {
        return [
            ...baseLogs,
            `${timestamp()} WARN [${serviceName}] High memory usage detected: 85%`,
            `${timestamp()} ERROR [${serviceName}] Connection timeout to upstream service`,
            `${timestamp()} ERROR [${serviceName}] Failed to process transaction: TIMEOUT`,
            `${timestamp()} WARN [${serviceName}] Retry attempt 1/3 for payment gateway`,
            `${timestamp()} ERROR [${serviceName}] Circuit breaker OPEN - too many failures`,
            `${timestamp()} INFO [${serviceName}] Attempting graceful degradation`,
            `${timestamp()} ERROR [${serviceName}] Exception: java.net.SocketTimeoutException`,
            `${timestamp()} WARN [${serviceName}] Response time degraded: 2500ms (threshold: 500ms)`,
        ];
    }

    return [
        ...baseLogs,
        `${timestamp()} INFO [${serviceName}] Request processed in 45ms`,
        `${timestamp()} INFO [${serviceName}] Cache hit ratio: 92%`,
        `${timestamp()} DEBUG [${serviceName}] Metrics exported successfully`,
        `${timestamp()} INFO [${serviceName}] All systems nominal`,
    ];
}

export function generateActions(serviceId: string): string[] {
    return [
        `Restart ${serviceId} (30s downtime)`,
        `Rollback to previous version`,
        `Scale up replicas (2 → 4)`,
        `Enable circuit breaker bypass`,
    ];
}
