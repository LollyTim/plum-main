
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { OrderNotification } from '@/types/product';

const OrderNotifications = ({ notifications = [] }: { notifications: OrderNotification[] }) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  
  const unreadCount = localNotifications.filter(n => !n.read).length;
  
  const getIconClass = (type: string) => {
    switch (type) {
      case 'order_placed':
        return 'bg-blue-100 text-blue-600';
      case 'payment_received':
        return 'bg-green-100 text-green-600';
      case 'order_shipped':
        return 'bg-orange-100 text-orange-600';
      case 'order_delivered':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  const handleMarkAsRead = (id: string) => {
    setLocalNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    setLocalNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-flex items-center justify-center">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500">
            {unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Mark all as read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {localNotifications.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          localNotifications.map(notification => (
            <DropdownMenuItem 
              key={notification.id}
              className="flex flex-col items-start p-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className="flex w-full">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full ${getIconClass(notification.type)} flex items-center justify-center mr-3`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()} · {new Date(notification.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderNotifications;
