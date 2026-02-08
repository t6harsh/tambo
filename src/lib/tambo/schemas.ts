import { z } from "zod";

// Schema definitions for Tambo component registration

export const MetricVisualizerSchema = z.object({
    title: z.string().default("System Metric").describe("Name of the metric to display, e.g., 'API Latency', 'CPU Usage', 'Memory Usage'"),
    status: z.enum(["Critical", "Stable"]).default("Stable").describe("Current health status of the metric - Critical shows red jagged graph, Stable shows green smooth graph"),
    dataPoints: z.array(z.number()).default([]).describe("Array of numeric values for the chart, representing metric values over time"),
});

export const LogStreamSchema = z.object({
    serviceName: z.string().default("Service Logs").describe("Name of the service to show logs for, e.g., 'payment-svc', 'api-gateway'"),
    logLines: z.array(z.string()).default([]).describe("Array of log entries to display in the terminal"),
    highlightError: z.boolean().default(false).describe("If true, auto-scroll to the first ERROR line in the logs"),
});

export const ControlDeckSchema = z.object({
    serviceId: z.string().default("Target Service").describe("ID of the affected service for remediation"),
    actions: z.array(z.string()).default([]).describe("List of available remediation actions like 'Restart Container', 'Rollback', 'Scale Up'"),
});

export type MetricVisualizerProps = z.infer<typeof MetricVisualizerSchema>;
export type LogStreamProps = z.infer<typeof LogStreamSchema>;
export type ControlDeckProps = z.infer<typeof ControlDeckSchema>;
