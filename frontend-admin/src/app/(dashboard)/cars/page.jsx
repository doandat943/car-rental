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

// ** Icons Imports
import Pencil from 'mdi-material-ui/Pencil'
import Delete from 'mdi-material-ui/Delete'
import Plus from 'mdi-material-ui/Plus'

const CarsPage = () => {
  // ** States
  const [pageSize, setPageSize] = useState(10)
  const [open, setOpen] = useState(false)

  // Dummy data - would come from backend API
  const cars = [
    {
      id: 1,
      name: 'Tesla Model 3',
      brand: 'Tesla',
      model: 'Model 3',
      category: 'Sedan',
      year: 2023,
      dailyPrice: 100,
      transmission: 'Automatic',
      fuelType: 'Electric',
      availability: true
    },
    {
      id: 2,
      name: 'Toyota RAV4',
      brand: 'Toyota',
      model: 'RAV4',
      category: 'SUV',
      year: 2023,
      dailyPrice: 80,
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      availability: true
    },
    {
      id: 3,
      name: 'BMW X5',
      brand: 'BMW',
      model: 'X5',
      category: 'SUV',
      year: 2022,
      dailyPrice: 150,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      availability: false
    }
  ]

  const columns = [
    {
      flex: 0.1,
      minWidth: 100,
      field: 'id',
      headerName: 'ID',
      renderCell: params => <Typography variant='body2'>{params.row.id}</Typography>
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'name',
      headerName: 'Name',
      renderCell: params => <Typography variant='body2'>{params.row.name}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'brand',
      headerName: 'Brand',
      renderCell: params => <Typography variant='body2'>{params.row.brand}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'category',
      headerName: 'Category',
      renderCell: params => <Typography variant='body2'>{params.row.category}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'year',
      headerName: 'Year',
      renderCell: params => <Typography variant='body2'>{params.row.year}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'dailyPrice',
      headerName: 'Daily Price',
      renderCell: params => <Typography variant='body2'>${params.row.dailyPrice}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'availability',
      headerName: 'Availability',
      renderCell: params => (
        <Typography
          variant='body2'
          sx={{
            color: params.row.availability ? 'success.main' : 'error.main'
          }}
        >
          {params.row.availability ? 'Available' : 'Unavailable'}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'actions',
      headerName: 'Actions',
      renderCell: params => (
        <Box>
          <IconButton color='primary'>
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
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader 
            title='Cars Management' 
            action={
              <Button variant='contained' startIcon={<Plus />} onClick={handleClickOpen}>
                Add Car
              </Button>
            } 
          />
          <CardContent>
            <DataGrid
              autoHeight
              rows={cars}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Add/Edit Car Dialog */}
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title' maxWidth='md' fullWidth>
        <DialogTitle id='form-dialog-title'>Add New Car</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField label='Name' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Brand' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Model' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Category' fullWidth select defaultValue=''>
                <MenuItem value=''>Select Category</MenuItem>
                <MenuItem value='Sedan'>Sedan</MenuItem>
                <MenuItem value='SUV'>SUV</MenuItem>
                <MenuItem value='Sports'>Sports</MenuItem>
                <MenuItem value='Luxury'>Luxury</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Year' type='number' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Daily Price' type='number' fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Transmission' fullWidth select defaultValue=''>
                <MenuItem value=''>Select Transmission</MenuItem>
                <MenuItem value='Automatic'>Automatic</MenuItem>
                <MenuItem value='Manual'>Manual</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label='Fuel Type' fullWidth select defaultValue=''>
                <MenuItem value=''>Select Fuel Type</MenuItem>
                <MenuItem value='Gasoline'>Gasoline</MenuItem>
                <MenuItem value='Diesel'>Diesel</MenuItem>
                <MenuItem value='Electric'>Electric</MenuItem>
                <MenuItem value='Hybrid'>Hybrid</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField label='Description' multiline rows={4} fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleClose} color='primary' variant='contained'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CarsPage 