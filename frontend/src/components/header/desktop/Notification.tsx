// React
import { useState } from "react";

// MUI
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import {
  List,
  ListItemButton,
  Menu,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// Icons
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";

// Components
import Image from "@/components/common/Image";
import { TwoLineTypography } from "@/components/typography";

// Redux
import { useAppSelector } from "@/hooks/useStore";
import { userSelector } from "@/features/account";
import { useNotifications } from "@/contexts/NotificationContext";
import { Notification as NotificationType } from "@/types";
import { useNavigate } from "react-router-dom";

export default function Notification() {
  const data = useNotifications();
  const navigate = useNavigate();

  const { notifications, unreadCount } = data || {
    notifications: [],
    unreadCount: 0,
  };

  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const user = useAppSelector(userSelector);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleGoToNotification = (notification: NotificationType) => {
    navigate(notification.referenceUrl);
    handleClose();
  };

  const userNotifications = notifications.filter(
    (notification) => notification.to === "user"
  );

  const instructorNotifications = notifications.filter(
    (notification) => notification.to === "instructor"
  );

  const adminNotifications = notifications.filter(
    (notification) => notification.to === "admin"
  );

  return (
    <Box>
      <Tooltip title="Thông báo">
        <IconButton onClick={handleClick} size="large" color="inherit">
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: {
            width: "400px",
            p: 0,
          },
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              textColor="secondary"
              indicatorColor="secondary"
            >
              {user?.role !== "admin" && (
                <Tab
                  sx={{
                    textTransform: "capitalize",
                  }}
                  label="Học sinh"
                  {...a11yProps(0)}
                />
              )}
              {["admin", "instructor"].includes(user?.role || "") && (
                <Tab
                  sx={{
                    textTransform: "capitalize",
                  }}
                  label="Giáo viên"
                  {...a11yProps(1)}
                />
              )}
              {user?.role === "admin" && (
                <Tab
                  sx={{
                    textTransform: "capitalize",
                  }}
                  label="Quản trị"
                  {...a11yProps(2)}
                />
              )}
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <List sx={{ width: "100%", p: 0, bgcolor: "background.paper" }}>
              {userNotifications.length > 0 &&
                userNotifications.map((notification) => (
                  <ListItemButton
                    onClick={handleGoToNotification.bind(null, notification)}
                    key={notification._id}
                  >
                    <NotificationItem notification={notification} />
                  </ListItemButton>
                ))}
              {userNotifications.length === 0 && (
                <Stack
                  sx={{
                    width: 1,
                    height: "100px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  direction={"column"}
                  gap={1}
                >
                  <Typography sx={{ fontSize: "0.85rem" }} variant="body1">
                    Không có thông báo nào.
                  </Typography>
                </Stack>
              )}
            </List>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <List sx={{ width: "100%", p: 0, bgcolor: "background.paper" }}>
              {instructorNotifications.length > 0 &&
                instructorNotifications.map((notification) => (
                  <ListItemButton
                    onClick={handleGoToNotification.bind(null, notification)}
                    key={notification._id}
                  >
                    <NotificationItem notification={notification} />
                  </ListItemButton>
                ))}
              {instructorNotifications.length === 0 && (
                <Stack
                  sx={{
                    width: 1,
                    height: "100px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  direction={"column"}
                  gap={1}
                >
                  <Typography sx={{ fontSize: "0.85rem" }} variant="body1">
                    Không có thông báo nào.
                  </Typography>
                </Stack>
              )}
            </List>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <List sx={{ width: "100%", p: 0, bgcolor: "background.paper" }}>
              {adminNotifications.length > 0 &&
                adminNotifications.map((notification) => (
                  <ListItemButton
                    onClick={handleGoToNotification.bind(null, notification)}
                    key={notification._id}
                  >
                    <NotificationItem notification={notification} />
                  </ListItemButton>
                ))}
              {adminNotifications.length === 0 && (
                <Stack
                  sx={{
                    width: 1,
                    height: "100px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  direction={"column"}
                  gap={1}
                >
                  <Typography sx={{ fontSize: "0.85rem" }} variant="body1">
                    Không có thông báo nào.
                  </Typography>
                </Stack>
              )}
            </List>
          </CustomTabPanel>
        </Box>
      </Menu>
    </Box>
  );
}

function NotificationItem({
  notification,
}: {
  notification: NotificationType;
}) {
  return (
    <Stack
      sx={{ width: 1, cursor: "pointer" }}
      direction={"row"}
      gap={1}
      alignItems={"flex-start"}
    >
      <Box
        sx={{
          width: "70px",
          position: "relative",
          aspectRatio: "1/1",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Image src="/images/image-placeholder.png" fill />
      </Box>
      <Stack direction={"column"} gap={0}>
        <TwoLineTypography sx={{ fontSize: "1rem" }} variant="body1">
          {notification.title}
        </TwoLineTypography>
        <Typography sx={{ opacity: 0.6 }} fontSize={"0.75rem"} variant="body1">
          {new Date(notification.createdAt).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </Typography>
        <TwoLineTypography
          sx={{ mt: "4px", fontSize: "0.85rem", fontWeight: 400 }}
          variant="body1"
        >
          {notification.message}
        </TwoLineTypography>
      </Stack>
    </Stack>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
