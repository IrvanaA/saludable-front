import React, { useState } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import TextField from '@material-ui/core/TextField';
import { Box, Button, Card, CardActions, CardContent, CircularProgress, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, Input, InputAdornment, InputLabel, Paper, Radio, RadioGroup, Select, Snackbar } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import MuiAlert from '@material-ui/lab/Alert';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const urlServer = "http://localhost:8080/"
const pacienteApi = urlServer + "paciente";
const informeApi = urlServer + "informe";

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  console.log(response);
  return response.json();
}

const useStylesCardLogin = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: "100%",
  },
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

function App() {
  // this.state = {isToggleOn: false};
  const [isToggleOn, setIsToggleOn] = useState(0);
  const [loading, setLoading] = useState(0);
  const [tentacion, setTentacion] = useState(false);
  const [postre, setPostre] = useState(false);
  const [usuarioLogeado, setUsuarioLogeado] = React.useState(0);
  let usuario = usuarioLogeado;
  const [informes, setInformes] = React.useState([]);
  const [paginaSeleccionada, setPaginaSeleccionada] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  // iniciarSesion = iniciarSesion.bind(this);
  const classesCardLogin = useStylesCardLogin();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const [selectedDate, setSelectedDate] = React.useState(new Date('1999-01-01T21:11:54'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const cambiaAlimentoTentacion = (event) => {
    setTentacion(event.target.value == "true");
    console.log(event.target.value);
  };

  const cambiaPostre = (event) => {
    setPostre(event.target.value == "true");
    console.log(event.target.value);
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  async function seleccionarPagina(pagina) {
    console.log(usuario);
    switch (pagina) {
      case "misinformes":
        console.log({ usuarioLogeado });
        await postData(pacienteApi + "/login", {
          username: usuario.username,
          password: usuario.password
        }).then(data => {
          if (data.id != null) {
            setUsuarioLogeado(data);
            usuario = data;
            setInformes(data.informes);
          }
        });
        break;
    }
    setPaginaSeleccionada(pagina);
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };

  async function registrarUsuario() {
    const form = document.getElementById("form-registro");
    const req = {
      "apellido": form.apellidoregistro.value,
      "dni": form.dni.value,
      "fecha": form.fechanacimiento.value,
      "localidad": form.localidad.value,
      "nombre": form.nombre.value,
      "password": form.password.value,
      "sexo": form.sexo.value,
      "tipoTratamiento": form.tipotratamiento.value,
      "username": form.username.value
    };
    console.log(req);
    setLoading(true);
    window.setTimeout(async () => {
      await postData(pacienteApi + "/savePaciente", req).then(data => {
        if (data.id != null) {
          form.reset();
          seleccionarPagina(null);
        } else {
          console.log("error  ");
          // setOpenError(true);
        }
      });
      setLoading(false);
    }, 500);
  }

  async function enviarFormulario() {
    const form = document.getElementById("form-agregar-formulario");
    let usuarioAux = usuarioLogeado;
    delete usuarioAux['informes'];
    const req = {
      "bebida": form.bebida.value,
      "comidaDiaria": form.tipocomida.value,
      "comidaPrincipal": form.comidaprincipal.value,
      "comidaSecundaria": form.comidasecundaria.value,
      "hambre": form.sequedoconhambre.value == "true",
      "ingerioPostre": form.ingiriopostre.value == "true",
      "paciente": usuarioAux,
      "postre": form.postrequeingirio ? form.postrequeingirio.value : false,
      "tentacion": form.tentacion.value == "true",
      "tentacionAlimento": form.alimentotentacion ? form.alimentotentacion.value : false
    };
    console.log(req);
    console.log(form.tipocomida.value);

    setLoading(true);
    window.setTimeout(async () => {
      await postData(informeApi + "/saveInforme", req).then(data => {
        if (data.id != null) {
          form.reset();
          seleccionarPagina("misinformes");
        } else {
          console.log("error  ");
          // setOpenError(true);
        }
      });
      setLoading(false);
    }, 500);
  }

  function cerrarSesion() {
    setUsuarioLogeado(null);
    setInformes(null);
    usuario = null;
    seleccionarPagina(null);
    setIsToggleOn(false);
    handleMenuClose();
  }

  async function iniciarSesion() {
    console.log("iniciaste sesion");
    setLoading(true);
    window.setTimeout(async () => {
      await postData(pacienteApi + "/login", {
        username: document.getElementById("usuario").value,
        password: document.getElementById("password").value
      }).then(data => {
        if (data.id != null) {
          setOpen(true);
          setUsuarioLogeado(data);
          setInformes(data.informes);
          usuario = data;
          setIsToggleOn(true);
          seleccionarPagina("misinformes");
        } else {
          console.log("error  ");
          setOpenError(true);
        }
      });
      setLoading(false);
    }, 500);

  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => seleccionarPagina("misinformes")}>Mis informes</MenuItem>
      <MenuItem onClick={() => seleccionarPagina("agregarinforme")}>Agregar informe</MenuItem>
      <MenuItem onClick={() => cerrarSesion()}>Cerrar sesion</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {usuarioLogeado?.id != null ? (<MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Mi perfil</p>
      </MenuItem>) : ""}
    </Menu>
  );


  return (
    <React.Fragment>
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h6" noWrap>
              Saludable
        </Typography>
            <div className={classes.grow} />
            {isToggleOn ? <div className={classes.sectionDesktop}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div> : <Button onClick={() => seleccionarPagina("registro")} color="inherit">Registrarme</Button>}
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          ¡Bienvenido {usuarioLogeado?.nombre} {usuarioLogeado?.apellido}!
                              </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={4000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error">
          El usuario no existe o la contraseña es incorrecta
                              </Alert>
      </Snackbar>
      {
        !paginaSeleccionada && (<Grid container justify="center" spacing={3}>
          <Grid item xs={12} sm={5}>
            <Box m={3}>
              <Typography className={classes.title} variant="h4" noWrap>
                Iniciar sesion
            </Typography>
              <Paper className={classes.paper} >
                <Box p={3}>
                  <form noValidate autoComplete="off">
                    <Box m={3}>
                      <Grid item xs={12}>
                        <TextField fullWidth id="usuario" label="Usuario" variant="outlined" />
                      </Grid>
                    </Box>
                    <Box m={3}>
                      <Grid item xs={12}>
                        <TextField fullWidth type="password" id="password" label="Password" variant="outlined" />
                      </Grid>
                    </Box>
                    <Box m={3}>
                      <Grid>
                        <div className={classes.root}>
                          <div className={classes.wrapper}>
                            <Button
                              variant="contained"
                              color="primary"
                              disabled={loading}
                              onClick={iniciarSesion}
                            >
                              Iniciar sesion
                          </Button>
                            {loading ? <CircularProgress size={24} className={classes.buttonProgress} /> : ""}
                          </div>
                        </div>
                      </Grid>
                    </Box>
                  </form>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>)
      }
      {
        paginaSeleccionada == "misinformes" && (
          <React.Fragment>
            <Typography className={classes.title} variant="h4" noWrap>
              Mis informes
            </Typography>
            <Box m={3}>
              <Grid item xs={12}>
                <Grid container justify="center" spacing={3}>

                  {informes.map((i) => (<Grid item>
                    <Card className={classes.root} variant="outlined">
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                          {i.comidaDiaria}
                        </Typography>
                        <Typography variant="h5" component="h2">
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                          {i.fecha}
                        </Typography>
                        <Typography variant="body2" component="p">
                          Comida principal: {i.comidaPrincipal}
                        </Typography>
                        <Typography variant="body2" component="p">
                          Comida secundaria: {i.comidaSecundaria}
                        </Typography>
                        <Typography variant="body2" component="p">
                          Bebida: {i.bebida}
                        </Typography>
                        <Typography variant="body2" component="p">
                          Postre: {i.postre}
                        </Typography>
                        <Typography variant="body2" component="p">
                          Ingerio postre: {i.ingerioPostre ? "Si" : "No"}
                        </Typography>
                        <Typography variant="body2" component="p">
                          Tentacion: {i.tentacion ? "Si" : "No"}
                        </Typography>
                        <Typography variant="body2" component="p">
                          Alimento tentacion: {i.tentacionAlimento}
                        </Typography>
                        <Typography variant="body2" component="p">
                          ¿Quedo con hambre?: {i.hambre ? "Si" : "No"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>))}

                </Grid>
              </Grid>
            </Box>

          </React.Fragment>
        )
      }
      {
        paginaSeleccionada == "agregarinforme" && (
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} sm={8}>
              <Typography className={classes.title} variant="h4" noWrap>
                Agregar informe
            </Typography>
              <Box m={3}>
                <Paper className={classes.paper} >
                  <Box p={3}>
                    <form id="form-agregar-formulario" noValidate autoComplete="off">
                      <Box m={3}>
                        <Grid item xs={12}>
                          <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="tipo-comida">Tipo de comida</InputLabel>
                            <Select
                              labelId="tipo-comida"
                              id="tipo-comida-select"
                              label="Tipo de comida"
                              name="tipocomida"
                            >
                              <MenuItem value={"DESAYUNO"}>Desayuno</MenuItem>
                              <MenuItem value={"ALMUERZO"}>Almuerzo</MenuItem>
                              <MenuItem value={"MERIENDA"}>Merienda</MenuItem>
                              <MenuItem value={"CENA"}>Cena</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid item xs={12}>
                          <TextField name="comidaprincipal" fullWidth id="comidaprincipal" label="Comida principal" variant="outlined" />
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid item xs={12}>
                          <TextField fullWidth name="comidasecundaria" id="comidasecundaria" label="Comida secundaria" variant="outlined" />
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid item xs={12}>
                          <TextField fullWidth name="bebida" id="bebida" label="Bebida" variant="outlined" />
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid item xs={12}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">¿Ingirió postre?</FormLabel>
                            <RadioGroup aria-label="gender" id="ingeriopostre" name="ingiriopostre" value={postre} onChange={cambiaPostre}>
                              <FormControlLabel value={true} control={<Radio />} label="Si" />
                              <FormControlLabel value={false} control={<Radio />} label="No" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </Box>
                      {postre && <Box m={3}>
                        <Grid item xs={12}>
                          <TextField fullWidth name="postrequeingirio" id="postrequecomio" label="Postre que ingirió" variant="outlined" />
                        </Grid>
                      </Box>
                      }
                      <Box m={3}>
                        <Grid item xs={12}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">¿Tenia tentacion de ingerir otro alimento?</FormLabel>
                            <RadioGroup name="tentacion" aria-label="gender" id="tentacion" value={tentacion} name="tentacion" onChange={cambiaAlimentoTentacion}>
                              <FormControlLabel value={true} control={<Radio />} label="Si" />
                              <FormControlLabel value={false} control={<Radio />} label="No" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </Box>
                      {tentacion && <Box m={3}>
                        <Grid item xs={12}>
                          <TextField fullWidth name="alimentotentacion" id="alimentotentacion" label="Alimento que queria ingerir" variant="outlined" />
                        </Grid>
                      </Box>
                      }
                      <Box m={3}>
                        <Grid item xs={12}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">¿Se quedo con hambre?</FormLabel>
                            <RadioGroup name="sequedoconhambre" aria-label="gender" id="sequedoconhambre" name="sequedoconhambre">
                              <FormControlLabel value="true" control={<Radio />} label="Si" />
                              <FormControlLabel value="false" control={<Radio />} label="No" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid>
                          <div className={classes.root}>
                            <div className={classes.wrapper}>
                              <Button
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                onClick={enviarFormulario}
                              >
                                Agregar informe
                          </Button>
                              {loading ? <CircularProgress size={24} className={classes.buttonProgress} /> : ""}
                            </div>
                          </div>
                        </Grid>
                      </Box>
                    </form>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        )
      }
      {
        paginaSeleccionada == "registro" && (
          <Grid container justify="center" spacing={3}>
            <Grid item xs={12} sm={8}>
              <Typography className={classes.title} variant="h4" noWrap>
                Registro
            </Typography>
              <Box m={3}>
                <Paper className={classes.paper} >
                  <Box p={3}>
                    <form id="form-registro" noValidate autoComplete="off">
                      <Box m={3}>
                        <Grid item xs={12}>
                          <TextField name="nombre" fullWidth id="apellido" label="Nombre" variant="outlined" />
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid item xs={12}>
                          <TextField name="apellidoregistro" fullWidth id="apellido" label="Apellido" variant="outlined" />
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid item xs={12}>
                          <TextField name="dni" fullWidth id="dni" type="number" label="DNI" variant="outlined" />
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid item xs={12}>
                          <TextField name="sexo" fullWidth id="sexo" label="Sexo" variant="outlined" />
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid item xs={12}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="yyyy-MM-dd"
                                margin="normal"
                                value={selectedDate}
                                onChange={handleDateChange}
                                id="date-picker-inline"
                                name="fechanacimiento"
                                label="Fecha de nacimiento"
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                              />
                            </Grid>
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid item xs={12}>
                          <TextField name="localidad" fullWidth id="localidad" label="Localidad" variant="outlined" />
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid item xs={12}>
                          <TextField name="username" fullWidth id="usuario" label="Usuario" variant="outlined" />
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid item xs={12}>
                          <TextField name="password" fullWidth id="passwordRegister" label="Password" variant="outlined" />
                        </Grid>
                      </Box>

                      <Box m={3}>
                        <Grid item xs={12}>
                          <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="tipo-tratamiento">Tipo de tratamiento</InputLabel>
                            <Select
                              labelId="tipo-tratamiento"
                              id="tipo-tratamiento-select"
                              label="Tipo de tratamiento"
                              name="tipotratamiento"
                            >
                              <MenuItem value={"ANOREXIA"}>Anorexia</MenuItem>
                              <MenuItem value={"BULIMIA"}>Bulimia</MenuItem>
                              <MenuItem value={"OBESIDAD"}>Obesidad</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Box>
                      <Box m={3}>
                        <Grid>
                          <div className={classes.root}>
                            <div className={classes.wrapper}>
                              <Button
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                onClick={registrarUsuario}
                              >
                                Registrarme
                          </Button>
                              {loading ? <CircularProgress size={24} className={classes.buttonProgress} /> : ""}
                            </div>
                          </div>
                        </Grid>
                      </Box>
                    </form>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        )
      }
    </React.Fragment>

  );
}

export default App;
