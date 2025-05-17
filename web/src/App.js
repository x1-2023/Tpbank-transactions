import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Button, Card, CardContent, Grid, Box, Alert, IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/histories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'transaction_CategoryMoneyIn' })
      });
      const data = await res.json();
      if (res.ok && data.info && data.info.transactionInfos) {
        setTransactions(data.info.transactionInfos);
      } else {
        setError(data.error || 'Không lấy được dữ liệu');
      }
    } catch (err) {
      setError('Lỗi kết nối tới server');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, []);

  // Tính tổng tiền nhận
  const totalAmount = transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f6fa', minHeight: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <MonetizationOnIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard Nhận Tiền TPBank
          </Typography>
          <Button color="inherit" onClick={fetchTransactions} startIcon={<RefreshIcon />} disabled={loading}>
            Làm mới
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ bgcolor: '#e3fcec' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Tổng tiền nhận
                </Typography>
                <Typography variant="h5" component="div" color="green" fontWeight={700}>
                  {totalAmount.toLocaleString()} VND
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Số giao dịch
                </Typography>
                <Typography variant="h5" component="div" color="primary" fontWeight={700}>
                  {transactions.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{typeof error === 'string' ? error : JSON.stringify(error)}</Alert>}
        <Paper elevation={3}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell align="right">Số tiền</TableCell>
                  <TableCell align="right">Số dư sau GD</TableCell>
                  <TableCell>Reference</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Không có giao dịch tiền vào nào</TableCell>
                  </TableRow>
                ) : (
                  transactions.map(tx => (
                    <TableRow key={tx.id} hover>
                      <TableCell>{tx.performDate || tx.transactionDate || tx.valueDate}</TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell align="right" sx={{ color: 'green', fontWeight: 700 }}>
                        {Number(tx.amount).toLocaleString()} {tx.currency}
                      </TableCell>
                      <TableCell align="right">
                        {Number(tx.runningBalance).toLocaleString()} {tx.currency}
                      </TableCell>
                      <TableCell>{tx.reference}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
