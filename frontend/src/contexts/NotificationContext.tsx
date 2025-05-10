/* eslint-disable @typescript-eslint/no-unused-vars */
import { isLoggedInSelector, userSelector } from "@/features/account";
import { useAppSelector } from "@/hooks/useStore";
import { Notification } from "@/types";
import React, { createContext, useState, useEffect, useContext } from "react";
import io, { Socket } from "socket.io-client";

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isLoggedIn = useAppSelector(isLoggedInSelector);
  const user = useAppSelector(userSelector);
  const [socket, setSocket] = useState<null | Socket>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Kết nối đến server
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
    });

    newSocket.emit("register", user?.email);

    // Nhận thông báo ban đầu
    newSocket.on("notifications", (initialNotifications: Notification[]) => {
      setNotifications(initialNotifications);
      setUnreadCount(initialNotifications.length);
    });

    // // Nhận thông báo mới
    newSocket.on("new_notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    newSocket.on("refresh_token", () => {
      console.log("Refresh token event received");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isLoggedIn]);

  return (
    <>
      <NotificationContext.Provider
        value={{
          notifications,
          unreadCount,
        }}
      >
        {children}
      </NotificationContext.Provider>
    </>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => useContext(NotificationContext);
