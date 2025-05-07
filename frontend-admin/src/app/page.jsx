'use client'

// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { DataGrid } from '@mui/x-data-grid'

// ** Icons Imports
import CarIcon from 'mdi-material-ui/Car'
import CalendarClockIcon from 'mdi-material-ui/CalendarClock'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import AccountGroup from 'mdi-material-ui/AccountGroup'
import ChevronRight from 'mdi-material-ui/ChevronRight'

// ** Custom Components Imports
import CustomAvatar from '@core/components/mui/avatar'

const salesData = [
  {
    stats: '245',
    title: 'Total Cars',
    color: 'primary',
    icon: <CarIcon sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '128',
    title: 'Active Bookings',
    color: 'success',
    icon: <CalendarClockIcon sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '$12,458',
    title: 'Revenue',
    color: 'warning',
    icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: '1,568',
    title: 'Customers',
    color: 'info',
    icon: <AccountGroup sx={{ fontSize: '1.75rem' }} />
  }
]

const renderStats = () => {
  return salesData.map((sale, index) => (
    <Grid item xs={6} md={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar skin='light' variant='rounded' color={sale.color} sx={{ mr: 4 }}>
          {sale.icon}
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h5'>{sale.stats}</Typography>
          <Typography variant='body2'>{sale.title}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const CarRentalDashboard = () => {
  // ** States
  const [pageSize, setPageSize] = useState(5)

  // ** Hooks
  const theme = useTheme()

  // Recent bookings data
  const bookings = [
    {
      id: 1,
      customer: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      car: 'Tesla Model 3',
      startDate: '2025-06-01',
      endDate: '2025-06-05',
      amount: '$500',
      status: 'confirmed'
    },
    {
      id: 2,
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com'
      },
      car: 'Toyota RAV4',
      startDate: '2025-06-10',
      endDate: '2025-06-15',
      amount: '$400',
      status: 'pending'
    },
    {
      id: 3,
      customer: {
        name: 'Robert Johnson',
        email: 'robert@example.com'
      },
      car: 'BMW X5',
      startDate: '2025-05-15',
      endDate: '2025-05-20',
      amount: '$750',
      status: 'completed'
    },
    {
      id: 4,
      customer: {
        name: 'Emily Wilson',
        email: 'emily@example.com'
      },
      car: 'Tesla Model 3',
      startDate: '2025-06-20',
      endDate: '2025-06-25',
      amount: '$500',
      status: 'cancelled'
    }
  ]

  const columns = [
    {
      flex: 0.2,
      minWidth: 180,
      field: 'customer',
      headerName: 'Customer',
      renderCell: params => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            {params.row.customer.name}
          </Typography>
          <Typography variant='caption'>{params.row.customer.email}</Typography>
        </Box>
      )
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'car',
      headerName: 'Car',
      renderCell: params => <Typography variant='body2'>{params.row.car}</Typography>
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
      field: 'amount',
      headerName: 'Amount',
      renderCell: params => <Typography variant='body2'>{params.row.amount}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'status',
      headerName: 'Status',
      renderCell: params => {
        const color = 
          params.row.status === 'confirmed' ? 'success' : 
          params.row.status === 'pending' ? 'warning' : 
          params.row.status === 'cancelled' ? 'error' : 'info'
        
        return (
          <Chip 
            label={params.row.status.charAt(0).toUpperCase() + params.row.status.slice(1)} 
            color={color}
            size='small'
          />
        )
      }
    }
  ]

  // Car availability data
  const carAvailability = [
    { car: 'Tesla Model 3', available: 8, total: 12 },
    { car: 'Toyota RAV4', available: 5, total: 8 },
    { car: 'BMW X5', available: 3, total: 5 },
    { car: 'Honda Civic', available: 10, total: 15 },
    { car: 'Mercedes-Benz E-Class', available: 2, total: 3 }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Car Rental Dashboard</Typography>
      </Grid>

      {/* Stats Cards */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Statistics' />
          <CardContent>
            <Grid container spacing={6}>
              {renderStats()}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Bookings */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader 
            title='Recent Bookings' 
            action={
              <Button 
                variant='text' 
                color='primary' 
                href="/bookings"
                endIcon={<ChevronRight fontSize='small' />}
              >
                View All
              </Button>
            } 
          />
          <CardContent>
            <DataGrid
              autoHeight
              rows={bookings}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[5, 10]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </CardContent>
        </Card>
      </Grid>
      
      {/* Car Availability */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title='Car Availability' />
          <TableContainer>
            <Table>
              <TableBody>
                {carAvailability.map(row => {
                  const availablePercentage = (row.available / row.total) * 100
                  
                  return (
                    <TableRow key={row.car} sx={{ '&:last-of-type td': { border: 0 } }}>
                      <TableCell>
                        <Typography variant='body2'>{row.car}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2'>{row.available}/{row.total}</Typography>
                        <LinearProgress 
                          variant='determinate' 
                          value={availablePercentage} 
                          color={availablePercentage > 60 ? 'success' : availablePercentage > 30 ? 'warning' : 'error'}
                          sx={{ height: 8, borderRadius: 5, mt: 1 }}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CarRentalDashboard 