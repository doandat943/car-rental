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

// ** Icons Imports
import Eye from 'mdi-material-ui/Eye'
import Delete from 'mdi-material-ui/Delete'
import Check from 'mdi-material-ui/Check'
import Close from 'mdi-material-ui/Close'

const getStatusColor = status => {
  if (status === 'confirmed') return 'success'
  if (status === 'pending') return 'warning'
  if (status === 'cancelled') return 'error'
  if (status === 'completed') return 'info'
  return 'default'
}

const BookingsPage = () => {
  // ** States
  const [pageSize, setPageSize] = useState(10)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  // Dummy data - would come from backend API
  const bookings = [
    {
      id: 1,
      customer: {
        id: 101,
        name: 'John Doe',
        email: 'john@example.com'
      },
      car: {
        id: 1,
        name: 'Tesla Model 3'
      },
      startDate: '2025-06-01',
      endDate: '2025-06-05',
      totalAmount: 500,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2025-05-20'
    },
    {
      id: 2,
      customer: {
        id: 102,
        name: 'Jane Smith',
        email: 'jane@example.com'
      },
      car: {
        id: 2,
        name: 'Toyota RAV4'
      },
      startDate: '2025-06-10',
      endDate: '2025-06-15',
      totalAmount: 400,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2025-05-22'
    },
    {
      id: 3,
      customer: {
        id: 103,
        name: 'Robert Johnson',
        email: 'robert@example.com'
      },
      car: {
        id: 3,
        name: 'BMW X5'
      },
      startDate: '2025-05-15',
      endDate: '2025-05-20',
      totalAmount: 750,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2025-05-01'
    },
    {
      id: 4,
      customer: {
        id: 104,
        name: 'Emily Wilson',
        email: 'emily@example.com'
      },
      car: {
        id: 1,
        name: 'Tesla Model 3'
      },
      startDate: '2025-06-20',
      endDate: '2025-06-25',
      totalAmount: 500,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: '2025-05-10'
    }
  ]

  const columns = [
    {
      flex: 0.1,
      minWidth: 80,
      field: 'id',
      headerName: 'ID',
      renderCell: params => <Typography variant='body2'>{params.row.id}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 180,
      field: 'customer',
      headerName: 'Customer',
      renderCell: params => (
        <Typography variant='body2'>
          {params.row.customer.name} ({params.row.customer.email})
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'car',
      headerName: 'Car',
      renderCell: params => <Typography variant='body2'>{params.row.car.name}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'dates',
      headerName: 'Rental Period',
      renderCell: params => (
        <Typography variant='body2'>
          {params.row.startDate} to {params.row.endDate}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'totalAmount',
      headerName: 'Amount',
      renderCell: params => <Typography variant='body2'>${params.row.totalAmount}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'status',
      headerName: 'Status',
      renderCell: params => (
        <Chip 
          label={params.row.status.charAt(0).toUpperCase() + params.row.status.slice(1)} 
          color={getStatusColor(params.row.status)}
          size='small'
        />
      )
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
              setSelectedBooking(params.row)
              setDetailsOpen(true)
            }}
          >
            <Eye fontSize='small' />
          </IconButton>
          <IconButton color='error'>
            <Delete fontSize='small' />
          </IconButton>
        </Box>
      )
    }
  ]

  const handleDetailsClose = () => {
    setDetailsOpen(false)
    setSelectedBooking(null)
  }

  const updateBookingStatus = (newStatus) => {
    // This would call the API to update the status
    console.log(`Updating booking ${selectedBooking.id} status to ${newStatus}`)
    handleDetailsClose()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Bookings Management' />
          <CardContent>
            <DataGrid
              autoHeight
              rows={bookings}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Booking Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleDetailsClose} aria-labelledby='booking-dialog-title' maxWidth='md' fullWidth>
        {selectedBooking && (
          <>
            <DialogTitle id='booking-dialog-title'>Booking Details</DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2'>Booking ID</Typography>
                  <Typography variant='body2'>{selectedBooking.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2'>Created On</Typography>
                  <Typography variant='body2'>{selectedBooking.createdAt}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant='h6' sx={{ my: 2 }}>Customer Information</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2'>Name</Typography>
                  <Typography variant='body2'>{selectedBooking.customer.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2'>Email</Typography>
                  <Typography variant='body2'>{selectedBooking.customer.email}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant='h6' sx={{ my: 2 }}>Car Information</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2'>Car</Typography>
                  <Typography variant='body2'>{selectedBooking.car.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2'>Car ID</Typography>
                  <Typography variant='body2'>{selectedBooking.car.id}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant='h6' sx={{ my: 2 }}>Booking Details</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2'>Start Date</Typography>
                  <Typography variant='body2'>{selectedBooking.startDate}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2'>End Date</Typography>
                  <Typography variant='body2'>{selectedBooking.endDate}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2'>Total Amount</Typography>
                  <Typography variant='body2'>${selectedBooking.totalAmount}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2'>Status</Typography>
                  <Chip 
                    label={selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)} 
                    color={getStatusColor(selectedBooking.status)}
                    size='small'
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2'>Payment Status</Typography>
                  <Chip 
                    label={selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)} 
                    color={selectedBooking.paymentStatus === 'paid' ? 'success' : selectedBooking.paymentStatus === 'refunded' ? 'warning' : 'default'}
                    size='small'
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDetailsClose} color='primary'>
                Close
              </Button>
              
              {selectedBooking.status === 'pending' && (
                <>
                  <Button onClick={() => updateBookingStatus('confirmed')} color='success' variant='contained' startIcon={<Check />}>
                    Confirm
                  </Button>
                  <Button onClick={() => updateBookingStatus('cancelled')} color='error' variant='contained' startIcon={<Close />}>
                    Cancel
                  </Button>
                </>
              )}
              
              {selectedBooking.status === 'confirmed' && (
                <Button onClick={() => updateBookingStatus('completed')} color='info' variant='contained'>
                  Mark as Completed
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Grid>
  )
}

export default BookingsPage 