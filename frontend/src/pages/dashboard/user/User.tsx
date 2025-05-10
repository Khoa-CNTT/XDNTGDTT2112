import {
  Box,
  Typography,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

// Kiểu cho từng user
type UserList = {
  _id: string;
  email: string;
  name: string;
  bio: string;
  avatarUrl: string;
  role: 'user' | 'admin' | 'instructor';
  registerProvider: 'local' | 'google';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

// Kiểu cho response chính
type GetAllUsersResponse = {
  statusCode: number;
  statusText: string;
  message: string;
  data: UserList[];
};

// Kiểu cho form
type UserForm = {
  name: string;
  email: string;
  bio: string;
  role: 'user' | 'admin' | 'instructor';
  avatarUrl?: string;
  password?: string;
};

export default function UserTable() {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const [editUser, setEditUser] = useState<UserList | null>(null);
  const [editForm, setEditForm] = useState<UserForm>({
    name: '',
    email: '',
    bio: '',
    role: 'user',
  });
  const [users, setUsers] = useState<UserList[]>([]);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addForm, setAddForm] = useState<UserForm>({
    name: '',
    email: '',
    password: '',
    role: 'user',
    bio: '',
    avatarUrl: '',
  });

  const handleEdit = (user: UserList) => {
    setEditUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      bio: user.bio,
      role: user.role,
    });
  };

  const handleFormChange = (field: keyof UserForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddFormChange = (field: keyof UserForm, value: string) => {
    setAddForm((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data: GetAllUsersResponse = await response.json();
      if (response.ok) {
        setUsers(data.data);
      } else {
        console.error('Lỗi lấy danh sách người dùng:', data.message);
      }
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
    }
  };

  // Handle save (add or edit)
  const handleSave = async () => {
    const method = editUser ? 'PUT' : 'POST';
    const url = editUser
      ? `http://localhost:3000/api/users/${editUser._id}`
      : 'http://localhost:3000/api/users';

    const userData = editUser
      ? {
          email: editUser.email,
          name: editForm.name,
          bio: editForm.bio,
          role: editForm.role,
          avatarUrl: editUser.avatarUrl || '',
        }
      : {
          ...addForm,
          avatarUrl: addForm.avatarUrl || '',
        };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`${method} lỗi: ${errorText}`);
      }

      // const data = await res.json();
      toast.success(`${editUser ? 'Cập nhật' : 'Thêm'} người dùng thành công!`);
      setEditUser(null);
      setAddUserOpen(false);
      setEditForm({ name: '', email: '', bio: '', role: 'user' });
      setAddForm({ name: '', email: '', password: '', role: 'user', bio: '', avatarUrl: '' });
      fetchUsers(); // Reload user list
    } catch (error) {
      console.error('Lỗi khi lưu người dùng:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  // Handle delete
  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        console.error('Lỗi xóa người dùng');
      }
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  const rows = users.map((user, index) => ({
    id: index + 1,
    avatar: user.avatarUrl,
    name: user.name,
    email: user.email,
    role: user.role,
    provider: user.registerProvider,
    bio: user.bio,
    createdAt: new Date(user.createdAt).toLocaleDateString(),
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    {
      field: 'avatar',
      headerName: 'Avatar',
      width: 100,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" height={1}>
          <Avatar src={params.value} />
        </Box>
      ),
    },
    { field: 'name', headerName: 'Tên', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Vai trò', width: 120 },
    { field: 'provider', headerName: 'Provider', width: 120 },
    { field: 'bio', headerName: 'Tiểu sử', flex: 1 },
    { field: 'createdAt', headerName: 'Ngày tạo', width: 150 },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const user = users[params.row.id - 1];
        return (
          <Box>
            <IconButton onClick={() => handleEdit(user)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={() => handleDelete(user._id)}>
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Quản lý người dùng</Typography>
      <Box mb={2} display="flex" justifyContent="flex-end" alignItems="center">
        <Button
          variant="contained"
          sx={{ display: 'flex', alignItems: 'center', py: 1.3 }}
          onClick={() => setAddUserOpen(true)}
        >
          <AddIcon sx={{ mr: 1, fontSize: '16px' }} />
          <Typography fontSize="13px">Thêm người dùng</Typography>
        </Button>
      </Box>
      <Paper elevation={3} sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5]}
        />
      </Paper>

      {/* Dialog sửa người dùng */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)} fullWidth maxWidth="sm">
        <DialogTitle>Sửa người dùng</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={editUser?.avatarUrl} sx={{ width: 56, height: 56 }} />
              <Button variant="outlined" component="label">
                Tải ảnh lên
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (editUser) {
                          setEditUser({ ...editUser, avatarUrl: reader.result as string });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Button>
            </Box>
            <TextField
              fullWidth
              label="Tên"
              value={editForm.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
            />
            <TextField
              fullWidth
              label="Email"
              value={editForm.email}
              disabled
            />
            <FormControl fullWidth>
              <InputLabel id="role-label">Vai trò</InputLabel>
              <Select
                labelId="role-label"
                value={editForm.role}
                label="Vai trò"
                onChange={(e) => handleFormChange('role', e.target.value as 'user' | 'admin' | 'instructor')}
              >
                <MenuItem value="user">Người dùng</MenuItem>
                <MenuItem value="admin">Quản trị viên</MenuItem>
                <MenuItem value="instructor">Giảng viên</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Tiểu sử"
              multiline
              rows={3}
              value={editForm.bio}
              onChange={(e) => handleFormChange('bio', e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm người dùng */}
      <Dialog open={addUserOpen} onClose={() => setAddUserOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Thêm người dùng</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={addForm.avatarUrl} sx={{ width: 56, height: 56 }} />
              <Button variant="outlined" component="label">
                Tải ảnh lên
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setAddForm({ ...addForm, avatarUrl: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </Button>
            </Box>
            <TextField
              label="Tên"
              fullWidth
              value={addForm.name}
              onChange={(e) => handleAddFormChange('name', e.target.value)}
            />
            <TextField
              label="Email"
              fullWidth
              value={addForm.email}
              onChange={(e) => handleAddFormChange('email', e.target.value)}
            />
            <TextField
              label="Mật khẩu"
              fullWidth
              type="password"
              value={addForm.password}
              onChange={(e) => handleAddFormChange('password', e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="add-role-label">Vai trò</InputLabel>
              <Select
                labelId="add-role-label"
                value={addForm.role}
                label="Vai trò"
                onChange={(e) => handleAddFormChange('role', e.target.value)}
              >
                <MenuItem value="user">Người dùng</MenuItem>
                <MenuItem value="admin">Quản trị viên</MenuItem>
                <MenuItem value="instructor">Giảng viên</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Tiểu sử"
              fullWidth
              multiline
              rows={3}
              value={addForm.bio}
              onChange={(e) => handleAddFormChange('bio', e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}