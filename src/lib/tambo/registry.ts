import { TamboComponent } from "@tambo-ai/react";
import { MetricVisualizer } from "@/components/generative/MetricVisualizer";
import { LogStream } from "@/components/generative/LogStream";
import { ControlDeck } from "@/components/generative/ControlDeck";
import {
    MetricVisualizerSchema,
    LogStreamSchema,
    ControlDeckSchema,
} from "./schemas";

export const tamboComponents: TamboComponent[] = [
    {
        name: "MetricVisualizer",
        description:
            "Displays system health metrics as a line chart. Use for latency, CPU, memory, or any performance-related queries. Set status to 'Critical' during incidents and 'Stable' after resolution.",
        component: MetricVisualizer,
        propsSchema: MetricVisualizerSchema,
    },
    {
        name: "LogStream",
        description:
            "Shows a terminal-style log viewer for a specific service. Use when debugging, investigating errors, or when user asks about logs. Set highlightError to true when investigating issues.",
        component: LogStream,
        propsSchema: LogStreamSchema,
    },
    {
        name: "ControlDeck",
        description:
            "Displays remediation action buttons for incident response. Use when user wants to fix, restart, rollback, or take action on a service. Shows simulated actions for demo.",
        component: ControlDeck,
        propsSchema: ControlDeckSchema,
    },
];
