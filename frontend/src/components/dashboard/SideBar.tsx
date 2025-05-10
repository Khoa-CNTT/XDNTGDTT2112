/** react-router */
import { NavLink } from "react-router-dom";

/** react */
import { useState } from "react";

/** MUI components */
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";

/** MUI icons */
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Quiz as QuizIcon,
  Help as HelpIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

export default function SideBar({
  isDark,
  isCollapsed,
  onClose,
}: {
  isDark: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}) {
  const [indexOpen, setIndexOpen] = useState<number | null>(null);

  function handleOpen(index: number) {
    if (indexOpen === index) setIndexOpen(null);
    else {
      setIndexOpen(index);
    }
  }

  function handleCloseSideBar() {
    // mobile
    if (window.innerWidth <= 550) {
      onClose();
    }
  }

  const drawerWidth = isCollapsed ? 60 : 240;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: isDark ? "#212121" : "#fff",
          color: isDark ? "#fff" : "#000",
          borderRight: `1px solid ${isDark ? "#424242" : "#e0e0e0"}`,
          transition: "width 0.3s",
        },
      }}
    >
      <Box sx={{ overflow: "auto", mt: 2 }}>
        <List>
          {/* Dashboard Link */}
          <ListItem
            component={NavLink}
            to="/dashboard/statistical"
            end
            onClick={handleCloseSideBar}
            sx={{
              "&.active": {
                backgroundColor: isDark ? "#424242" : "#f0f0f0",
                "& .MuiListItemIcon-root": {
                  color: isDark ? "#90caf9" : "#1976d2",
                },
                "& .MuiListItemText-primary": {
                  fontWeight: "bold",
                },
              },
              padding: "8px 16px",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isDark ? "#fff" : "#000",
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Bảng điều khiển"
                primaryTypographyProps={{
                  fontSize: "14px",
                  color: isDark ? "#fff" : "#000",
                }}
              />
            )}
          </ListItem>


          {/* Quản lý Dropdown */}
          <ListItem
            onClick={() => handleOpen(0)}
            sx={{
              padding: "8px 16px",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: isDark ? "#424242" : "#f0f0f0",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isDark ? "#fff" : "#000",
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            {!isCollapsed && (
              <>
                <ListItemText
                  primary="Quản lý"
                  primaryTypographyProps={{ fontSize: "14px" }}
                />
                {indexOpen === 0 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </>
            )}
          </ListItem>

          {/* Dropdown Items */}
          <Collapse in={indexOpen === 0 && !isCollapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                component={NavLink}
                to="user-management"
                onClick={handleCloseSideBar}
                sx={{
                  pl: 4,
                  "&.active": {
                    backgroundColor: isDark ? "#424242" : "#f0f0f0",
                    "& .MuiListItemIcon-root": {
                      color: isDark ? "#90caf9" : "#1976d2",
                    },
                    "& .MuiListItemText-primary": {
                      fontWeight: "bold",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isDark ? "#fff" : "#000",
                  }}
                >
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Quản lý người dùng"
                  primaryTypographyProps={{ fontSize: "14px", color: isDark ? "#fff" : "#000" }}
                />

              </ListItem>

              <ListItem
                component={NavLink}
                to="course-management"
                onClick={handleCloseSideBar}
                sx={{
                  pl: 4,
                  "&.active": {
                    backgroundColor: isDark ? "#424242" : "#f0f0f0",
                    "& .MuiListItemIcon-root": {
                      color: isDark ? "#90caf9" : "#1976d2",
                    },
                    "& .MuiListItemText-primary": {
                      fontWeight: "bold",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isDark ? "#fff" : "#000",
                  }}
                >
                  <QuizIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Quản lý khóa học"
                  primaryTypographyProps={{ fontSize: "14px", color: isDark ? "#fff" : "#000" }}
                />
              </ListItem>

              <ListItem
                component={NavLink}
                to="payment-management"
                onClick={handleCloseSideBar}
                sx={{
                  pl: 4,
                  "&.active": {
                    backgroundColor: isDark ? "#424242" : "#f0f0f0",
                    "& .MuiListItemIcon-root": {
                      color: isDark ? "#90caf9" : "#1976d2",
                    },
                    "& .MuiListItemText-primary": {
                      fontWeight: "bold",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isDark ? "#fff" : "#000",
                  }}
                >
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Quản lý thanh toán"
                  primaryTypographyProps={{ fontSize: "14px", color: isDark ? "#fff" : "#000" }}
                />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
}