import React, { useState, useEffect } from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';


function Todo() {

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [todoList, setTodoList] = useState([]);
    const [willBeDeletedEntry, setWillBeDeletedEntry] = useState("");
    const [willDeletedId, setWillBeDeletedId] = useState(null);
    const [willBeUpdateId, setWillBeUpdateId] = useState(null)
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
    const [openAddDialog, setOpenAddDialog] = React.useState(false);
    const [entry, setEntry] = useState("");
    const [date, setDate] = useState("");
    const [precedence, setPrecedence] = useState("");

    const checkboxHandleChange = (done, todoId) => {
        console.log(todoId)
        console.log(done)
        if (done == true) {
            done = false
            console.log(done)
        }
        else {
            done = true
            console.log(done)
        }
        let todo = { done }
        fetch('http://localhost:8088/api/updateDone/' + todoId, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
            .then((result) => {
                result.json().then((resp) => {
                    console.warn(resp)
                    getTodo();
                })

            })

    };


    const handlePrecedenceSelect = (event) => {
        setPrecedence(event.target.value);
    };

    const handleClickUpdate = (id, entry, date, precedence) => {
        setOpenUpdateDialog(true);
        setWillBeUpdateId(id)
        setEntry(entry);
        setDate(date);
        setPrecedence(precedence);
    };

    const handleCloseUpdate = () => {
        setOpenUpdateDialog(false);
    };

    const handleUpdateConfirm = () => {
        let todo = { entry, date, precedence }
        console.log(" güncelle id " + willBeUpdateId)
        fetch('http://localhost:8088/api/update/' + willBeUpdateId, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
            .then((result) => {
                result.json().then((resp) => {
                    console.warn(resp)
                    setOpenUpdateDialog(false)
                    getTodo();
                })

            })
    }

    const handleClickDelete = (entry, id) => {
        setOpenDeleteDialog(true);
        setWillBeDeletedEntry(entry);
        setWillBeDeletedId(id);
    };

    const handleCloseDelete = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteConfirm = () => {

        console.info('You clicked the delete icon.' + willDeletedId);
        fetch('http://localhost:8088/api/delete/' + willDeletedId, {
            method: "DELETE"
        }).then((result) => {
            // result.json()
            // .then((resp) => {console.warn(resp) })
            handleCloseDelete();
            getTodo();
        })
    }

    const handleClickAdd = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAdd = () => {
        setOpenAddDialog(false)
    }

    const handleAddConfirm = () => {
        let todo = { entry, date, precedence, }
        fetch('http://localhost:8088/api/create', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
            .then((result) => {
                result.json().then((resp) => {
                    console.warn(resp)
                    setOpenAddDialog(false);
                    getTodo();
                })

            })
    };

    useEffect(() => {
        getTodo()
    }, [])


    function getTodo() {

        fetch("/api/get-all")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setTodoList(result)
                    console.log(result)
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }

            )
    }


    if (error) {
        return <div> Error !!!</div>
    } else if (!isLoaded) {
        return <div> Loading... </div>
    } else {
        return (
            <div>
                <div> {/*add */}
                    <Button variant="outlined" onClick={() => handleClickAdd()}><AddIcon></AddIcon></Button>
                </div>
                <div>
                    <Dialog open={openAddDialog} onClose={handleCloseAdd}>
                        <DialogTitle>Yeni Yapılacak Oluştur</DialogTitle>
                        <DialogContent>
                            <label>Yapilacak</label>    <input type="text" placeholder="entry" value={entry} onChange={(e) => setEntry(e.target.value)} /><br></br>
                            <label>Tarih</label>   <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /><br></br>
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <InputLabel id="demo-select-small">Öncelik</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={precedence}
                                    label="Age"
                                    onChange={handlePrecedenceSelect}
                                >
                                    <MenuItem value={1}>Yüksek</MenuItem>
                                    <MenuItem value={2}>Orta</MenuItem>
                                    <MenuItem value={3}>Düşük</MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseAdd}>İptal</Button>
                            <Button onClick={handleAddConfirm}>Onayla</Button>
                        </DialogActions>
                    </Dialog>
                </div>

                <div> {/*list*/}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell >Yapıldı</TableCell>
                                    <TableCell >Yapılacaklar</TableCell>
                                    <TableCell align="right">Tarih</TableCell>
                                    <TableCell align="right">Öncelik</TableCell>
                                    <TableCell align="right">Güncelle</TableCell>
                                    <TableCell align="right">Sil</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {todoList.map((row) => (
                                    <TableRow
                                        key={row.entry}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>
                                            <Checkbox checked={row.done} onChange={() => checkboxHandleChange(row.done, row.id)} inputProps={{ 'aria-label': 'controlled' }} />
                                        </TableCell>
                                        <TableCell component="th" scope="row"> {row.entry} </TableCell>
                                        <TableCell align="right">{row.date}</TableCell>
                                        <TableCell align="right">
                                            <span className={"dot" + row.precedence}></span>
                                        </TableCell>
                                        <TableCell align="right"><EditIcon onClick={() => handleClickUpdate(row.id, row.entry, row.date, row.precedence, row.done)} /></TableCell>
                                        <TableCell align="right"><DeleteForeverIcon onClick={() => handleClickDelete(row.entry, row.id)} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <div>{/* Update */}
                    <Dialog open={openUpdateDialog} onClose={handleCloseUpdate}>
                        <DialogTitle> Güncelle </DialogTitle>
                        <DialogContent>
                            <form><br></br>
                                <Stack>
                                <Box sx={{ width: 200, maxWidth: '100%', }}>
                                    <TextField type="text" label="Entry"  value={entry} onChange={(e) => setEntry(e.target.value)} />
                                </Box>
                                </Stack>

                                    <Stack sx={{ minWidth: 150 }}>
                                    <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} variant="standard"> </TextField>
                                    </Stack>
                           
                                <Box>
                                    <Stack><br></br>
                                    <FormControl sx={{  minWidth: 200 }} size="small" >
                                        <InputLabel id="demo-select-small">Öncelik</InputLabel>
                                        <Select labelId="demo-select-small" id="demo-select-small" value={precedence} label="Age" onChange={handlePrecedenceSelect}  >
                                            <MenuItem value={1}>Yüksek</MenuItem>
                                            <MenuItem value={2}>Orta</MenuItem>
                                            <MenuItem value={3}>Düşük</MenuItem>
                                        </Select>
                                    </FormControl>
                                    </Stack>
                                </Box>



                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseUpdate}>İptal</Button>
                            <Button onClick={handleUpdateConfirm}>Güncelle</Button>
                        </DialogActions>
                    </Dialog>
                </div>

                <div> {/*delete*/}
                    <Dialog
                        open={openDeleteDialog}
                        onClose={handleCloseDelete}
                        aria-labelledby="alert-dialog-title"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {willBeDeletedEntry + " silinecek!"}
                        </DialogTitle>

                        <DialogActions>
                            <Button onClick={handleCloseDelete}>İptal</Button>
                            <Button onClick={handleDeleteConfirm} autoFocus>
                                Onayla
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>

            </div>
        )
    }

}
export default Todo;