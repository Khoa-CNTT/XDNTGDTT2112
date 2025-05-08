/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Avatar,
  Typography,
  Container,
  Box,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Section from "@/components/common/Section";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/hooks/useStore";
import { accountSelector } from "@/features/account";
import { uploadFileToCloudinary } from "@/services/cloudinaryService";
import { toast } from "react-toastify";
import { uploadProfile } from "@/services/userService";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  email: string;
  name: string;
  bio: string;
  avatar: string | null;
}

const Profile: React.FC = () => {
  const { themeMode } = useTheme();
  const { user } = useAppSelector(accountSelector);
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>({
    email: "",
    name: "",
    bio: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    if (user) {
      setProfile({
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatar: user.avatarUrl || "https://via.placeholder.com/150",
      });

      setEditedProfile({
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatar: user.avatarUrl || "https://via.placeholder.com/150",
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    const formData = new FormData();
    const file = fileInputRef.current?.files?.[0];

    try {
      let avatarUrl: string | null = profile.avatar;

      if (file) {
        formData.append("type", "image");
        formData.append("file", file);

        const res = await uploadFileToCloudinary(formData);

        avatarUrl = res?.data?.secure_url || null;
      }

      const data = {
        name: editedProfile.name,
        bio: editedProfile.bio,
        avatarUrl: avatarUrl,
      };

      const res = (await uploadProfile(data)) as any;

      if (res.statusCode === 200) {
        toast.success("Cập nhật thông tin thành công!");
        navigate("/profile", { replace: true });
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Có lỗi xảy ra khi tải lên tệp.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setEditedProfile((prev) => ({ ...prev, avatar: objectUrl }));
    }
  };

  const handleNavigateToChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <Section sx={{ mt: "128px", mb: "128px" }}>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            bgcolor: themeMode === "dark" ? "grey.900" : "background.paper",
            border: 1,
            borderColor: themeMode === "dark" ? "grey.700" : "grey.200",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: themeMode === "dark" ? "white" : "text.primary",
            }}
          >
            Thông tin cá nhân
          </Typography>

          <Box
            display="flex"
            justifyContent="center"
            mb={3}
            position="relative"
          >
            <Avatar
              src={
                isEditing
                  ? editedProfile.avatar || undefined
                  : profile.avatar || undefined
              }
              sx={{ width: 120, height: 120 }}
            />
            {isEditing && (
              <IconButton
                color="primary"
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: "calc(50% - 60px)", // căn giữa tương đối với avatar
                  bgcolor: themeMode === "light" ? "grey.800" : "white",
                  border: 1,
                  borderColor: "divider",
                  boxShadow: 1,
                }}
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <PhotoCamera />
              </IconButton>
            )}
          </Box>

          <Stack spacing={2}>
            <TextField
              label="Email"
              name="email"
              value={profile.email}
              fullWidth
              disabled
              variant="outlined"
            />
            <TextField
              label="Họ tên"
              name="name"
              value={isEditing ? editedProfile.name : profile.name}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditing}
              variant="outlined"
            />
            <TextField
              label="Tiểu sử"
              name="bio"
              value={isEditing ? editedProfile.bio : profile.bio}
              onChange={handleInputChange}
              fullWidth
              disabled={!isEditing}
              multiline
              rows={4}
              variant="outlined"
            />

            <Box display="flex" justifyContent="flex-end" gap={1}>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                  >
                    Lưu
                  </Button>
                  <Button variant="outlined" onClick={handleCancel}>
                    Hủy
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEdit}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleNavigateToChangePassword}
                  >
                    Đổi mật khẩu
                  </Button>
                </>
              )}
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Section>
  );
};

export default Profile;
