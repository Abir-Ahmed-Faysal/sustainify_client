"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle, Clock } from "lucide-react";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "idea" | "voting" | "system" | "category";
    timestamp: Date;
    read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        title: "New Idea Created",
        message: "Your idea 'Sustainable Energy Solutions' has been created successfully.",
        type: "idea",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false
    },

    {
        id: "2",
        title: "Voting Activity",
        message: "Your idea received 5 new votes.",
        type: "voting",
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        read: true
    },

    {
        id: "3",
        title: "System Maintenance",
        message: "The system will undergo maintenance on 2024-06-20 from 1:00 AM to 3:00 AM.",
        type: "system",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: false
    },

    {
        id: "4",
        title: "New Category Added",
        message: "A new category 'Green Technology' has been added.",
        type: "category",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        read: true
    }
]

const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
        case "idea":
            return <CheckCircle className="h-4 w-4 text-green-600" />
        case "voting":
            return <Clock className="h-4 w-4 text-amber-600" />
        case "system":
            return <CheckCircle className="h-4 w-4 text-purple-600" />
        case "category":
            return <Bell className="h-4 w-4 text-blue-600" />
        default:
            return <Bell className="h-4 w-4 text-gray-600" />
    }
}

const NotificationDropdown = () => {

    const unreadCount = MOCK_NOTIFICATIONS.filter(notification => !notification.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"outline"} size={"icon"} className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <ScrollArea className="h-80">
                    {MOCK_NOTIFICATIONS.length > 0 ? (
                        MOCK_NOTIFICATIONS.map((notification) => (
                            <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-2 p-3 cursor-pointer">
                                <div className="flex items-start gap-2 w-full">
                                    {getNotificationIcon(notification.type)}
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{notification.title}</p>
                                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No notifications
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NotificationDropdown
