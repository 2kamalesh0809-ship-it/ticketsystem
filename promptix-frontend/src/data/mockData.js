export const mockTickets = [
  {
    id: "TCK-1024",
    customerName: "Rahul Kumar",
    phone: "9876543210",
    priority: "High",
    status: "Open",
    assignedAgent: "Support Member 1",
    createdDate: "2026-02-20",
    createdAt: "2026-02-20T09:30:00",
    createdBy: "System Admin",
    assignedBy: "Manager Sarah",
    assignedAgent: "Support Member 1",
    assignedAt: "2026-02-20T09:35:00",
    email: "rahul@example.com",
    description: "Customer reports they were unable to login using the mobile app since the latest update. Error message '902' appears intermittently.",
    notes: [
      { id: 1, author: "Support Member 1", text: "Customer called regarding billing issue.", date: "2026-02-20T10:00:00" }
    ],
    history: [
      { id: 1, action: "Ticket Created", date: "2026-02-20T09:30:00" },
      { id: 2, action: "Assigned to Support Member 1", date: "2026-02-20T09:35:00" }
    ]
  },
  {
    id: "TCK-1025",
    customerName: "Priya Sharma",
    phone: "9876543211",
    priority: "Medium",
    status: "In Progress",
    assignedAgent: "Support Member 2",
    createdDate: "2026-02-21",
    createdAt: "2026-02-21T11:00:00",
    createdBy: "Manager Sarah",
    assignedBy: "Manager Sarah",
    assignedAgent: "Support Member 2",
    assignedAt: "2026-02-21T11:05:00",
    email: "priya@example.com",
    notes: [],
    history: [{ id: 1, action: "Ticket Created", date: "2026-02-21T11:00:00" }]
  },
  {
    id: "TCK-1026",
    customerName: "Amit Patel",
    phone: "9876543212",
    priority: "Low",
    status: "Resolved",
    assignedAgent: "Support Member 1",
    createdDate: "2026-02-18",
    createdAt: "2026-02-18T14:20:00",
    createdBy: "Support Lead",
    assignedBy: "System Admin",
    assignedAgent: "Support Member 1",
    assignedAt: "2026-02-18T14:45:00",
    email: "amit@example.com",
    notes: [],
    history: []
  },
  {
    id: "TCK-1027",
    customerName: "Sneha Gupta",
    phone: "9876543213",
    priority: "High",
    status: "Closed",
    assignedAgent: "Support Member 3",
    createdDate: "2026-02-15",
    email: "sneha@example.com",
    notes: [],
    history: []
  }
];

export const mockCustomers = [
  { id: "CUST-01", name: "Rahul Kumar", phone: "9876543210", email: "rahul@example.com", totalTickets: 5, lastContact: "2026-02-20" },
  { id: "CUST-02", name: "Priya Sharma", phone: "9876543211", email: "priya@example.com", totalTickets: 2, lastContact: "2026-02-21" },
  { id: "CUST-03", name: "Amit Patel", phone: "9876543212", email: "amit@example.com", totalTickets: 1, lastContact: "2026-02-18" },
  { id: "CUST-04", name: "Sneha Gupta", phone: "9876543213", email: "sneha@example.com", totalTickets: 8, lastContact: "2026-02-15" }
];

export const mockCallLogs = [
  { id: "CALL-101", type: "Inbound", duration: "05:23", linkedTicket: "TCK-1024", agentName: "Support Member 1", date: "2026-02-20" },
  { id: "CALL-102", type: "Outbound", duration: "12:05", linkedTicket: "TCK-1025", agentName: "Support Member 2", date: "2026-02-21" },
  { id: "CALL-103", type: "Inbound", duration: "02:15", linkedTicket: "TCK-1026", agentName: "Support Member 1", date: "2026-02-18" }
];
