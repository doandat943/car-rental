'use client'

// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'

// ** Icons Imports
import Pencil from 'mdi-material-ui/Pencil'
import Delete from 'mdi-material-ui/Delete'
import Plus from 'mdi-material-ui/Plus'
import AccountOutline from 'mdi-material-ui/AccountOutline'

const UsersPage = () => {
  // ** States
  const [pageSize, setPageSize] = useState(10)
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Dummy data - would come from backend API
  const users = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'customer',
      phoneNumber: '123-456-7890',
      address: '123 Main St, City, Country',
      createdAt: '2023-01-15'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'customer',
      phoneNumber: '234-567-8901',
      address: '456 Oak St, City, Country',
      createdAt: '2023-02-20'
    },
    {
      id: 3,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      role: 'admin',
      phoneNumber: '345-678-9012',
      address: '789 Pine St, City, Country',
      createdAt: '2023-01-01'
    }
  ]

  const columns = [
    {
      flex: 0.15,
      minWidth: 150,
      field: 'name',
      headerName: 'Name',
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 3, bgcolor: 'primary.main' }}>
            {params.row.firstName.charAt(0)}
            {params.row.lastName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant='body2'>{`${params.row.firstName} ${params.row.lastName}`}</Typography>
            <Typography variant='caption' color='text.secondary'>
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'phoneNumber',
      headerName: 'Phone',
      renderCell: params => <Typography variant='body2'>{params.row.phoneNumber}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 220,
      field: 'address',
      headerName: 'Address',
      renderCell: params => <Typography variant='body2'>{params.row.address}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'role',
      headerName: 'Role',
      renderCell: params => (
        <Chip 
          label={params.row.role.charAt(0).toUpperCase() + params.row.role.slice(1)} 
          color={params.row.role === 'admin' ? 'primary' : 'default'}
          size='small'
        />
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'createdAt',
      headerName: 'Created At',
      renderCell: params => <Typography variant='body2'>{params.row.createdAt}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'actions',
      headerName: 'Actions',
      renderCell: params => (
        <Box>
          <IconButton 
            color='primary'
            onClick={() => {
              setSelectedUser(params.row)
              setIsEdit(true)
              setOpen(true)
            }}
          >
            <Pencil fontSize='small' />
          </IconButton>
          <IconButton color='error'>
            <Delete fontSize='small' />
          </IconButton>
        </Box>
      )
    }
  ]

  const handleClickOpen = () => {
    setIsEdit(false)
    setSelectedUser(null)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedUser(null)
    setIsEdit(false)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Users Management' 
            action={
              <Button variant='contained' startIcon={<Plus />} onClick={handleClickOpen}>
                Add User
              </Button>
            } 
          />
          <CardContent>
            <DataGrid
              autoHeight
              rows={users}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Add/Edit User Dialog */}
      <Dialog open={open} onClose={handleClose} aria-labelledby='user-dialog-title' maxWidth='md' fullWidth>
        <DialogTitle id='user-dialog-title'>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField 
                label='First Name' 
                fullWidth 
                defaultValue={isEdit ? selectedUser?.firstName : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label='Last Name' 
                fullWidth 
                defaultValue={isEdit ? selectedUser?.lastName : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label='Email' 
                type='email' 
                fullWidth 
                defaultValue={isEdit ? selectedUser?.email : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label='Phone Number' 
                fullWidth 
                defaultValue={isEdit ? selectedUser?.phoneNumber : ''}
              />
            </Grid>
            {!isEdit && (
              <Grid item xs={12} sm={6}>
                <TextField 
                  label='Password' 
                  type='password' 
                  fullWidth 
                />
              </Grid>
            )}
            <Grid item xs={12} sm={isEdit ? 12 : 6}>
              <FormControl fullWidth>
                <InputLabel id='role-select-label'>Role</InputLabel>
                <Select
                  labelId='role-select-label'
                  label='Role'
                  defaultValue={isEdit ? selectedUser?.role : 'customer'}
                >
                  <MenuItem value='customer'>Customer</MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                  <MenuItem value='superadmin'>Super Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label='Address' 
                fullWidth 
                multiline 
                rows={2} 
                defaultValue={isEdit ? selectedUser?.address : ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleClose} color='primary' variant='contained'>
            {isEdit ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default UsersPage 