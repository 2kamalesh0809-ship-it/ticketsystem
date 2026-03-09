export const tickets = [
    {
        id: "TCK-8041",
        customerId: "CST-1001",
        title: "Server Migration Failure",
        description: "The primary database server failed to migrate properly to the new instance, causing a read-only lock state on production data.",
        priority: "High",
        status: "In Progress",
        assignedAgent: "Sarah Jenkins",
        createdDate: "2026-02-22T08:30:00Z"
    },
    {
        id: "TCK-8042",
        customerId: "CST-1003",
        title: "Billing Portal Access Denied",
        description: "Admin users are unable to access the billing portal since the last security update.",
        priority: "Medium",
        status: "Open",
        assignedAgent: "Michael Chang",
        createdDate: "2026-02-23T09:15:00Z"
    },
    {
        id: "TCK-8043",
        customerId: "CST-1002",
        title: "API Rate Limit Exceeded",
        description: "Client is experiencing 429 Too Many Requests errors despite being well under their enterprise tier limits.",
        priority: "High",
        status: "Resolved",
        assignedAgent: "David Ross",
        createdDate: "2026-02-20T14:45:00Z"
    },
    {
        id: "TCK-8044",
        customerId: "CST-1005",
        title: "UI Rendering Bug in Dashboard",
        description: "The statistics widgets on the main dashboard overlap on mobile viewport sizes.",
        priority: "Low",
        status: "Closed",
        assignedAgent: "Emily Stone",
        createdDate: "2026-02-18T11:20:00Z"
    },
    {
        id: "TCK-8045",
        customerId: "CST-1004",
        title: "Missing Audit Logs",
        description: "Audit logs for the past 48 hours appear to be missing from the export utility.",
        priority: "Medium",
        status: "In Progress",
        assignedAgent: "Sarah Jenkins",
        createdDate: "2026-02-21T16:05:00Z"
    }
];
